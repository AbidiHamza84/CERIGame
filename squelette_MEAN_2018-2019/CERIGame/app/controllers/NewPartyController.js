CERIGameApp.controller('NewPartyController',['$scope', 'Request', function($scope, Request) {
    $scope.currentStep = 1;
    $scope.levelParty = 1;

    $scope.nextStep = function(){
        $scope.currentStep++;
    };

    $scope.previousStep = function(){
        $scope.currentStep--;
    };
    
    $scope.getThemes = function () {
        Request.get('/getThemes', function(themes){
            $scope.themes = themes.data;
            $scope.themeParty = $scope.themes[0].id;
        });
    }
}]);