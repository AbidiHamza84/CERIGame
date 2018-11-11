
CERIGameApp.controller('UserController',['$rootScope', '$scope', '$window', '$location' , 'Authenticate', function($rootScope, $scope, $window, $location, Authenticate) {
    $scope.login = function () {
        let auth = Authenticate.login($scope.username, $scope.password, function () {
            $window.location.href="/home";
        });

    };
}]);