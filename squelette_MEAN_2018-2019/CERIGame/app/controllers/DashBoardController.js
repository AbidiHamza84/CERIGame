CERIGameApp.controller('DashBoardController',['$rootScope', function($rootScope) {
    $rootScope.lastConnexion = "Dernière connexion : " + localStorage.getItem('lastConnexion');
}]);