CERIGameApp.controller('HistoryController',['$scope', 'Session', 'Request', function($scope, Session, Request) {


    Request.get('/getHistoryByUser/' + Session.getSession().id).then(function(histories){
        $scope.histories = histories;
    });
}]);