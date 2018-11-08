
CERIGameApp.controller('UserController',['$rootScope', '$scope','$location' , 'Authenticate', function($rootScope, $scope, $location, Authenticate) {

    $rootScope.titlePage = 'Login';

    $scope.login = function () {
        let auth = Authenticate.login($scope.username, $scope.password, function () {
            $location.path('/home');
        });

    };
}]);