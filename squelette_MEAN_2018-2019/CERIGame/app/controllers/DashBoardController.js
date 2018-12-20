CERIGameApp.controller('DashBoardController',['$rootScope', '$scope', 'Request', 'Session', function($rootScope, $scope, Request, Session) {
    $rootScope.lastConnexion = "Dernière connexion : " + localStorage.getItem('lastConnexion');

    Request.get('/getConnectedUsersNumber').then(function (response) {
        $scope.connectedUsersNumber = response[0].users_number;
    });

    Request.get('/getUserHistorySize/' + Session.getSession().id).then(function (response) {
        $scope.historySize = response[0].history_size;
    });
}]);