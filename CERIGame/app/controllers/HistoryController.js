CERIGameApp.controller('HistoryController',['$scope', '$http', 'Session', function($scope, $http, Session) {

    Session.get(function (session) {
        $http.get("/getHistoryByUser/" + session.id).then(function (histories) {
            for (let i = 0; i < histories.data.length; i++){
                let history = histories.data[i];
                history.date = history.date.replace('Z','');
            }
            $scope.histories = histories.data;
        });
    });
}]);