CERIGameApp.controller('LogoutController',['$scope', '$http', function($scope, $http) {

    $scope.logout = function() {
        console.log("logout !");
        $http.delete("/deleteSession").then(function () {
            console.log("done !");
        });
    }
}]);