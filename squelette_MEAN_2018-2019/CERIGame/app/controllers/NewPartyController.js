CERIGameApp.controller('NewPartyController',['$scope', 'Request', function($scope, Request) {
    $scope.currentStep = 1;
    $scope.levelParty = 1;
    $scope.showNextQuizz = false;
    let quizzList;
    let currentQuizz = 0;
    $scope.showNextQuizz = false;

    /* passer à l'étape suivante de la configuration de la nouvelle partie

     */
    $scope.nextStep = function(){
        $scope.currentStep++;
    };

    /* revenir à l'étape précedente de la configuration de la nouvelle partie

     */
    $scope.previousStep = function(){
        $scope.currentStep--;
    };

    /* récuperer la liste des themes afin de les afficher à l'utilisateur lors de la configuration de la partie

     */
    $scope.getThemes = function () {
        Request.get('/getThemes', function(themes){
            $scope.themes = themes.data;
        });
    };

    /* récuperer l'id du thème choisie

     */
    $scope.handleRadioClick = function(id_party){
        $scope.themeParty = id_party;
    };

    /* récuperer la liste des quizz par rapport à un thème choisie

     */
    $scope.getQuizz = function() {
        Request.post('/getQuizzByTheme', {idTheme : $scope.themeParty}, function (response) {
            quizzList = response.data;
            currentQuizz = 0;
            $scope.quizz = quizzList[currentQuizz];
            console.log(JSON.stringify($scope.quizz));
        });
    };

    /* choisir une réponse

     */
    $scope.chooseQuizz = function (event, choosenResponse) {
        if($scope.showNextQuizz === false) {
            if (quizzList[currentQuizz].propositions[choosenResponse] === quizzList[currentQuizz].reponse) {
                event.currentTarget.className += " true";
            } else {
                event.currentTarget.className += " false";
            }
        }
        $scope.showNextQuizz = true;
    };

    /* passer au quizz suivant de la liste chargée auparavant

     */
    $scope.nextQuizz = function () {
        if(currentQuizz < quizzList.length) {
            currentQuizz++;
            $scope.quizz = quizzList[currentQuizz];
            console.log(JSON.stringify($scope.quizz));
            $scope.showNextQuizz = false;
        }
    };
}]);