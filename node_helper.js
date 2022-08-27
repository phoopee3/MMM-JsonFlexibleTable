var NodeHelper = require('node_helper');

const fetch = (...args) =>
	// eslint-disable-next-line no-shadow
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-JsonFlexibleTable helper started...');
	},

	getJson: function (url, method = null, body = null) {
		var self = this;

		fetch(url)
			.then( ( response ) => response.json() )
			.then( ( json ) => {
				self.sendSocketNotification("MMM-JsonFlexibleTable_JSON_RESULT", { url: url, data: json });
			})
		;
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, url) {
		if (notification === "MMM-JsonFlexibleTable_GET_JSON") {
			this.getJson(url);
		}
	}
});
