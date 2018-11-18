CERIGameApp.controller('LogoutController',['$scope', 'Session', function($scope, Session) {

    $scope.logout = function() {
        Session.delete();
    }
}]);