
CERIGameApp.controller('UserController',['$scope', '$window', 'Authenticate', 'Session', function($scope, $window, Authenticate, Session) {
    $scope.login = function () {
        let auth = Authenticate.login($scope.username, $scope.password, function () {
            Session.store();
            $window.location.href="/home";
        });

    };
}]);