/* this is the main reference point for the app, all stuff is effectively pulled into here, and then bundled with jspm */

// library imports
import angular from "angular";
import uiRouter from "angular-ui-router";
import $ from "jquery";

// services
import dbSrv from "./services/database.service.js";

// directives
import dashboardHeader from "./directives/dashboard-header.directive.js";
import dashboardSidebar from "./directives/dashboard-sidebar.directive.js";

// controllers
import MainCtrl from "./controllers/main.controller.js";
import TodoCtrl from "./controllers/todo.controller.js";

// GO
angular.module("dashboardApp", ["ui.router"])
	.controller("MainCtrl", MainCtrl)
	.directive("dashboardHeader", dashboardHeader)
	.directive("dashboardSidebar", dashboardSidebar)
	.service("dbSrv", dbSrv)
	.config(($stateProvider, $urlRouterProvider, $locationProvider) => {

		$urlRouterProvider.otherwise('/todo');
		$locationProvider.html5Mode(true);

		$stateProvider
			.state("todo",{
				url : "/todo",
				templateUrl: "../../views/widget-todo.html",
				controller: TodoCtrl,
				controllerAs: "todo"
			})
			.state("feed",{
				url : "/feed",
				templateUrl: "../../views/widget-feed.html",
			})
			.state("media",{
				url : "/media",
				templateUrl: "../../views/widget-media.html",
			})
			.state("calendar",{
				url : "/calendar",
				templateUrl: "../../views/widget-calendar.html",
			})
			.state("health",{
				url : "/health",
				templateUrl: "../../views/widget-health.html",
			})



	});

