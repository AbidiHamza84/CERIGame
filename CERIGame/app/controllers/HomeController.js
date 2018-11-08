
CERIGameApp.controller('HomeController',['$rootScope', '$scope', function($rootScope, $scope) {

    $rootScope.titlePage = 'Login';
    $scope.lastConnexion = "Dernière connexion : " + localStorage.getItem('lastConnexion');

}]);