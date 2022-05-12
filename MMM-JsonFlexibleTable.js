'use strict';

Module.register("MMM-JsonFlexibleTable", {

	jsonData: null,

	// Default module config.
	defaults: {
		url           : "",
		arrayName     : null,
		keepColumns   : [],
		size          : 0,
		tryFormatDate : false,
		updateInterval: 15000,
		method : "get",
		body : null
	},

	start: function () {
		this.getJson();
		this.scheduleUpdate();
	},

	scheduleUpdate: function () {
		var self = this;
		setInterval(function () {
			self.getJson();
		}, this.config.updateInterval);
	},

	// Request node_helper to get json from url
	getJson: function () {
		if ( this.config.method && this.config.method.toLowerCase() == 'post' ) {
			this.sendSocketNotification("MMM-JsonFlexibleTable_GET_JSON", this.config.url, this.config.method, this.config.body);
		} else {
			this.sendSocketNotification("MMM-JsonFlexibleTable_GET_JSON", this.config.url);
		}
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-JsonFlexibleTable_JSON_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.url)
			{
				this.jsonData = payload.data;
				this.updateDom(500);
			}
		}
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.className = "xsmall";

		if (!this.jsonData) {
			wrapper.innerHTML = "Awaiting json data...";
			return wrapper;
		}
		
		var table = document.createElement("table");
		var thead = document.createElement("thead");
		var tbody = document.createElement("tbody");
		
		var items = [];
		if (this.config.iterator) {
			items = this.jsonData[this.config.iterator];
		}
		else {
			items = this.jsonData;
		}

		// Check if items is of type array
		if (!(items instanceof Array)) {
			wrapper.innerHTML = "Json data is not of type array! " +
				"Maybe the config arrayName is not used and should be, or is configured wrong";
			return wrapper;
		}

		// create header row
		if ( this.config.columns && this.config.columns.length ) {
			var row = document.createElement("tr");
			this.config.columns.forEach( elm => {
				var cell = document.createElement("td");
				var cellText = document.createTextNode( elm.label );
				cell.appendChild( cellText );
				row.appendChild( cell );
			});
			thead.appendChild( row );
			table.appendChild( thead );
		}

		items.forEach(element => {
			var row = this.getTableRow(element);
			tbody.appendChild(row);
		});

		table.appendChild(tbody);
		wrapper.appendChild(table);
		return wrapper;
	},

	getTableRow: function (jsonObject) {
		var row = document.createElement("tr");
		// if columns are defined, loop over that
		if ( this.config.columns && this.config.columns.length ) {
			this.config.columns.forEach( elm => {
				// console.log( jsonObject );
				var cell = document.createElement("td");
				var cellText = '';
				if ( elm.name ) {
					cellText = this.valueByPath(jsonObject, elm.name.split('.'));
				} else {
					cellText = jsonObject;
				}
				
				// if there are keys defined on the column, do a lookup
				if (elm.keys && elm.keys[cellText]) {
					cellText = elm.keys[cellText];
				}
				cellText = document.createTextNode( cellText );
				cell.appendChild( cellText );
				row.appendChild( cell );
			});
		// if no columns are defined, loop over the entire object
		} else {
			for (var key in jsonObject) {
				var cell = document.createElement("td");
				
				var valueToDisplay = "";
				if (key === "icon") {
					cell.classList.add("fa", jsonObject[key]);
				}
				else if (this.config.tryFormatDate) {
					valueToDisplay = this.getFormattedValue(jsonObject[key]);
				}
				else {
					if ( this.config.keepColumns.length == 0 || this.config.keepColumns.indexOf(key) >= 0 ){
						valueToDisplay = jsonObject[key];
					}
				}

				var cellText = document.createTextNode(valueToDisplay);

				if ( this.config.size > 0 && this.config.size < 9 ){
					var h = document.createElement("H" + this.config.size );
					h.appendChild(cellText)
					cell.appendChild(h);
				}
				else
				{
					cell.appendChild(cellText);
				}

				row.appendChild(cell);
			}
		}
		return row;
	},

	// Format a date string or return the input
	getFormattedValue: function (input) {
		var m = moment(input);
		if (typeof input === "string" && m.isValid()) {
			// Show a formatted time if it occures today
			if (m.isSame(new Date(), "day") && m.hours() !== 0 && m.minutes() !== 0 && m.seconds() !== 0) {
				return m.format("HH:mm:ss");
			}
			else {
				return m.format("YYYY-MM-DD");
			}
		}
		else {
			return input;
		}
	},

	valueByPath: function ( jsonObject, path ) {
		if ( path.length ) {
			jsonObject = jsonObject[path.shift()];
			if ( path.length && typeof jsonObject === 'object' && jsonObject !== null ) {
				return this.valueByPath( jsonObject, path );
			} else {
				return jsonObject;
			}
		} else {
			return jsonObject;
		}
	}

});
