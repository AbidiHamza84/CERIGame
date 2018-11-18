CERIGameApp.controller('HistoryController',['$scope', '$http', function($scope,$http) {
    $scope.history = function() {
        $http.get("/getHistoryByUser/1").then(function (histories) {

            let content = "";

            for (let i = 0; i < histories.data.length; i++){
                let history = histories.data[i];
                content += history.date + ", " + history.nbreponse + ", " + history.temps + ", " + history.score + "</br>";
            }

            $scope.content = content;
            console.log($scope.content);
        });
    }
    $scope.content = "kjsdhf";
}]);