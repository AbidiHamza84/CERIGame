CERIGameApp.controller('DashBoardController',['$rootScope', '$scope', function($rootScope, $scope) {
    $rootScope.lastConnexion = "Dernière connexion : " + localStorage.getItem('lastConnexion');
}]);