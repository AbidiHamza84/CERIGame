
CERIGameApp.controller('UserController',['$rootScope', '$scope', '$window', '$location' , 'Authenticate', function($rootScope, $scope, $window, $location, Authenticate) {

    $rootScope.titlePage = 'Login';

    $scope.login = function () {
        let auth = Authenticate.login($scope.username, $scope.password, function () {
            $window.location.href="/home";
            //$window.location.reload();
        });

    };
}]);