import $ from "jquery";
import linkify from "linkify";

function todoController($scope, $rootScope, $firebaseObject, toastr){

	// ------------
	// INIT
	// ----
	this.addNewTodoTitle = "";
	this.isCurrent = true;

	// ------------
	// EVENTS
	// ------

	// Add a brand new todo
	this.addNewTodoSubmit = () => {
		if (!this.addNewTodoTitle){
			toastr.info("Please enter something :)", "Empty");
		} 
		else {
			const newTodo = {
				title: this.addNewTodoTitle,
				added: Date.now(),
				archived: false
			};
			// reset
			this.addNewTodoTitle = "";
			// write todo to db, angularfire will take care of the rest
			$rootScope.$emit("createNewWidgetRecordForUser", "todo", newTodo);
		}
	};

	// allow an icon to be archivable
	this.archiveItem = (event, clickedItem) => {
		clickedItem.archived = true;
		$rootScope.$emit("deleteOneExistingRecordForWidget", "todo", clickedItem.id);
		$rootScope.$emit("createNewWidgetRecordForUser", "todoArchive", clickedItem);
	}

	// show the archived todos
	this.showArchivedTodos = () => {
		this.isCurrent = !this.isCurrent;
	}

	// allow the deletion of ALL todos
	this.deleteAllTodos = () => {
		// delete evvvveerrrrryyything
		$rootScope.$emit("deleteWidgetMeta", "todo");
		$rootScope.$emit("deleteWidgetMeta", "todoArchive");

	} 

	// make the little toolbar icon clickable
	this.revealContextMenu = () => {
		$(".revealed-options").toggleClass("reveal-element");
		$(".options-menu").toggleClass("dimmed");

		// toggle between open and close font
		if ($("#toggleTodoToolsIcon").hasClass("fa-wrench")){
			$("#toggleTodoToolsIcon").removeClass("fa-wrench");
			$("#toggleTodoTools").addClass("tool-circle-active");
			$("#toggleTodoToolsIcon").addClass("fa-times");
		}
		else {
			$("#toggleTodoToolsIcon").removeClass("fa-times");
			$("#toggleTodoTools").removeClass("tool-circle-active");
			$("#toggleTodoToolsIcon").addClass("fa-wrench");
		}
	}
 
	// show the add new todo form
	this.revealTodoAddForm = () => {

		$(".hidden-form form").fadeToggle();
		$(".hidden-form").toggleClass("wide-form");
		$(".todo-list").toggleClass("list-smaller");

		// toggle between open and close font
		if ($("#toggleTodoAddFormIcon").hasClass("fa-plus")){
			$("#toggleTodoAddFormIcon").removeClass("fa-plus");
			$("#toggleTodoAddForm").addClass("tool-circle-active");
			$("#toggleTodoAddFormIcon").addClass("fa-times");
		}
		else {
			$("#toggleTodoAddFormIcon").removeClass("fa-times");
			$("#toggleTodoAddForm").removeClass("tool-circle-active");
			$("#toggleTodoAddFormIcon").addClass("fa-plus");
		}

	}

}

todoController.$inject = ["$scope", "$rootScope", "$firebaseObject", "toastr"];


export default todoController;