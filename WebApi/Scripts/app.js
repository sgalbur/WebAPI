var TodoApp = angular.module('TodoApp', ['ngRoute', 'ngResource']);

TodoApp.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', { controller: ListCtrl, templateUrl: 'home/list' }).
          otherwise({ redirectTo: '/' });
});

TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function () {
        Todo.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_desc,
            offset: $scope.offset,
            limit: $scope.limit
            },
            function (data) {
                $scope.more = data.length === $scope.limit;
                $scope.items = $scope.items.concat(data);
        });
    };
    $scope.sort = function (col) {
        if ($scope.sort_order === col) {
            $scope.is_desc = !$scope.is_desc;
        } else {
            $scope.sort_order = col;
            $scope.is_desc = false;
        }
        $scope.sort_order = col;
        $scope.reset();
    };

    $scope.show_more = function () {
        $scope.offset += $scope.limit;
        $scope.search();
    };

    $scope.has_more = function () {
        return $scope.more;
    };

    $scope.reset = function () {
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.items = [];
        $scope.more = true;
        $scope.search();
    };

    $scope.sort_order = "Priority";
    $scope.is_desc = false;

    $scope.reset();
};