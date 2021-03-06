define(["js/core/Application", "js/core/I18n", "app/model/Todo", "app/collection/TodoList", "js/data/FilterDataView"],
    function (Application, I18n, Todo, TodoList, FilterDataView) {

        var ENTER_KEY = 13;

        return Application.inherit("app.TodoClass", {
            /**
             * Initializes the app
             * In this method we set the initial models
             */
            initialize: function () {
                this.set("todoList", null);
                this.set("filterList", null);
                this.callBase();
            },
            /**
             * Are triggered
             */
            showAll: function () {
                this.$.filterList.set("filter", 'all');
            },
            showActive: function () {
                this.$.filterList.set("filter", "active");
            },
            showCompleted: function () {
                this.$.filterList.set("filter", "completed");
            },
            /**
             * The rest is just controller stuff
             */
            addNewTodo: function (e) {
                if (e.domEvent.keyCode === ENTER_KEY) {
                    var title = e.target.get("value").trim();
                    if (title) {
                        var newTodo = this.$.dataSource.createEntity(Todo);
                        newTodo.set({title: title, completed: false});
                        this.get("todoList").add(newTodo);

                        // save the new item
                        newTodo.save();
                        e.target.set('value', '');
                    }
                }
            },
            markAllComplete: function (e) {
                var done = e.target.$.checked;
                this.$.todoList.each(function (item) {
                    item.setCompleted(done);
                    item.save();
                });
            },
            clearCompleted: function () {
                this.$.todoList.clearCompleted();
            },
            removeTodo: function (todo) {
                var self = this;
                todo.remove(null, function (err) {
                    if (!err) {
                        self.get("todoList").remove(todo);
                    }
                });
            },
            /**
             * Start the application and render it to the body ...
             */
            start: function (parameter, callback) {
                this.set('todoList', this.$.dataSource.createCollection(TodoList));

                // fetch all todos, can be done sync because we use localStorage
                this.$.todoList.fetch();

                this.set('filterList', new FilterDataView({
                    baseList: this.get("todoList"),
                    filter: 'all',
                    filterFnc: function (item) {
                        var filter = this.$.filter;
                        if (filter == "active") {
                            return !item.isCompleted();
                        } else if (filter == "completed") {
                            return item.isCompleted();
                        } else {
                            return true;
                        }
                    }})
                );
                // false - disables autostart
                this.callBase();
            },
            translateItems: function (num) {
                return (num === 1) ? "item" : "items";
            },
            selectedClass: function (expected, current) {
                return expected == current ? "selected" : "";
            }
        });
    });