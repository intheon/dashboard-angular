import $ from "jquery";

function feedController($q, $scope, $rootScope, $firebaseObject, backendService, toastr){

 
	// -----------
	// INIT
	// ----
	$rootScope.$on("widgetScopeUpdated", () => {
		console.log("not sure when this gets fired?");
		initiateDataGrab();
	});

	// ---------------
	// MODEL
	// -----
	this.sourceName = "";
	this.sourceURL = "";

	// --------------------
	// HELPERS
	// -------

	this.validURL = (urlStr) => {
		const pattern = new RegExp(/^https?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/);

		if(!pattern.test(urlStr)){
			return false;
		} 
		else {
			return true;
		}
	}

	// -----------------------------
	// LISTENERS
	// ---------

	// show the add new feed source form at the side

	this.revealFeedAddForm = () => {

		$(".hidden-form form").fadeToggle();
		$(".hidden-form").toggleClass("wide-form");
		$(".feed-list").toggleClass("list-smaller");

		// toggle between open and close font
		if ($("#toggleFeedAddFormIcon").hasClass("fa-plus")){
			$("#toggleFeedAddFormIcon").removeClass("fa-plus");
			$("#toggleFeedAddForm").addClass("tool-circle-active");
			$("#toggleFeedAddFormIcon").addClass("fa-times");
		}
		else {
			$("#toggleFeedAddFormIcon").removeClass("fa-times");
			$("#toggleFeedAddForm").removeClass("tool-circle-active");
			$("#toggleFeedAddFormIcon").addClass("fa-plus");
		}

	}


	this.addNewFeedSource = () => {
		// TODO, UNIT TEST THE SHIT OUTTA THIS
		if (!this.sourceName || !this.sourceURL){
			toastr.info("Please enter something :)", "Empty");
		}
		else {
			if (!this.validURL(this.sourceURL)){
				toastr.info("Please enter a valid URL :)", "Empty");
			}
			else {
				const newSource = {
					title: this.sourceName,
					url: this.sourceURL
				};

				// reset
				this.sourceName = "";
				this.sourceURL = "";

				// write todo to db, angularfire will take care of the rest
				$rootScope.$emit("createNewWidgetRecordForUser", "feedSource", newSource);

			}
		}
	}


	// ---------------- 
	// FEED PARSING
	// ------------
	let serverTransactionInProcess = false;

	function initiateDataGrab() {
		// because my own mongodb instance is now involved, throttle the connection to occur every 10 seconds
		// if any other requests to this function are received (for which there will be about 5/6 because firebase is calling it lots)
		// then discard them and only do a server request for one

		if (!serverTransactionInProcess){
			// set server to be blocked
			serverTransactionInProcess = true;

			$scope.$parent.userWidgetMeta.$loaded().then(() => {

				// loop through urls and get the server to grab the feed data they contain 
				for (let key in $scope.$parent.userWidgetMeta.feed){
					let url = $scope.$parent.userWidgetMeta.feed[key].url;
					getFromServer(url, key);
				}

			})

		}
		else {
			setTimeout(() => {
				serverTransactionInProcess = false;
			}, 8000);
			return false;
		}
	}

	function getFromServer(url, key){
		// a http promise from the server
		let requestNewsPromise = backendService.requestNewsData;
		// promise for async getting rss data from foreign servers
		requestNewsPromise(url)
			.then((response) => {
				parseServerResponse(response, key);
			})
			.catch((error) => {
				console.log(error);
			})
	}

	function parseServerResponse(response, key){
		if (response.rss.channel){
			// set on the parent items scope
			$rootScope.$emit("updateLocalParentScope", "feed", key, response.rss.channel[0].item);
		}
		else {
			console.log("something else.... not sure... take a look and handle");
			console.log(response);
		}
	}

}

feedController.$inject = ["$q", "$scope", "$rootScope", "$firebaseObject", "backendService", "toastr"];


export default feedController;