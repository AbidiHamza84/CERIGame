
CERIGameApp.controller('UserController',['$scope','$location' , 'Authenticate', function($scope, $location, Authenticate) {
        $scope.login = function () {
            let auth = Authenticate.login($scope.username, $scope.password, function () {
                $location.path('/home');
            });

        };
}]);