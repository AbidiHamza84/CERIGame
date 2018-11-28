CERIGameApp.controller('HistoryController',['$scope', 'Session', 'Request', function($scope, Session, Request) {


    Request.get('/getHistoryByUser/' + Session.getSession().id, function(histories){
        for (let i = 0; i < histories.data.length; i++){
            let history = histories.data[i];
            history.date = history.date.replace('Z','');
        }
        $scope.histories = histories.data;
    });
}]);