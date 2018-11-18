CERIGameApp.controller('DashBoardController',['$rootScope', '$scope','$http', function($rootScope) {
    $rootScope.lastConnexion = "Dernière connexion : " + localStorage.getItem('lastConnexion');
}]);