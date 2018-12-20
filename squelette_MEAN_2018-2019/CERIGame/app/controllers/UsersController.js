CERIGameApp.controller('UsersController',['$scope','Request', function($scope,Request) {


    Request.get("/getUsers").then(function (response){
        $scope.users = response;
    });


}]);