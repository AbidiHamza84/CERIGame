CERIGameApp.controller('NewPartyController',['$scope', 'Request', 'Counter', function($scope, Request, Counter) {
    $scope.currentStep = 1;
    $scope.durationQuestion = 3;
    $scope.showNextQuizz = false;
    $scope.goodResponse = -1;
    $scope.currentQuizz = -1;
    $scope.score = 0;

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
            $scope.firstThemeId = themes.data[0].id;
            $scope.themes = themes.data;
            $scope.themeParty = $scope.firstThemeId;
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
            $scope.quizzList = response.data;
            $scope.currentQuizz = -1;
            $scope.nextQuizz();
        });
    };

    /*
        choisir une réponse
     */
    $scope.chooseResponse = function (event, choosenResponse) {
        console.log("from chooseResponse : current quizz = "  +$scope.currentQuizz);
        console.log("from chooseResponse : choosenResponse = "  +choosenResponse);
        // vérifier si on peut toujours choisir une réponse
        if($scope.showNextQuizz === false) {
            if ($scope.quizzList[$scope.currentQuizz].propositions[choosenResponse] === $scope.quizzList[$scope.currentQuizz].reponse) {
                event.currentTarget.className += " true";
                $scope.goodResponse = choosenResponse;
                $scope.score++;
                console.log("score = " + $scope.score);
            } else {

                $scope.showGoodResponse();
                event.currentTarget.className += " false";
            }

            $scope.showAnecdote();
        }

        // on arrete le compteur
        if($scope.counter !== undefined)
            Counter.stop($scope.counter);

        $scope.showNextQuizz = true;
    };

    /*
    Montrer à l'utilisateur la bonne réponse et mettre à jour son indice
     */
    $scope.showGoodResponse = function(){
        $scope.goodResponse = -1;

        //chercher l'indice de la bonne réponse
        $scope.quizzList[$scope.currentQuizz].propositions.forEach(function (proposition, i){
            if(proposition === $scope.quizzList[$scope.currentQuizz].reponse)
                $scope.goodResponse = i;

        });

        $('#prop_' + $scope.goodResponse).addClass("true-not-choosen");
    };

    /*
    Afficher l'anecdote
     */
    $scope.showAnecdote = function() {
        $('#prop_' + $scope.goodResponse + ' .anecdote').text($scope.quizzList[$scope.currentQuizz].anecdote);
    };


    /* passer au quizz suivant de la liste chargée auparavant en affichant le compteur

     */
    $scope.nextQuizz = function () {
        console.log("nb questions = " + $scope.quizzList.length);
        console.log("current quizz = " + +$scope.currentQuizz);
        if($scope.currentQuizz < $scope.quizzList.length) {

            // si il y a un compteur qui est entrain de tourner, on l'arrete
            /*if($scope.counter !== undefined)
                Counter.stop($scope.counter);

            // set the counter
            $scope.counter = Counter.countDown(function (current) {
                let rest = new Date(current * 1000);
                let minutes = rest.getMinutes();
                let seconds = rest.getSeconds();
                if(minutes !== 0)
                    $scope.timer = minutes + " minute(s) et " + seconds + " seconde(s)";
                else
                    $scope.timer = seconds + " seconde(s)";

                if(minutes === 0 && seconds === 0){
                    let response = $scope.showGoodResponse();
                    $scope.showAnecdote(response);
                    $scope.showNextQuizz = true;
                }

            },1000,0, $scope.durationQuestion);*/

            $scope.goodResponse = -1;
            $scope.currentQuizz++;
            $scope.quizz = $scope.quizzList[$scope.currentQuizz];
            $scope.showNextQuizz = false;
        }
        else{
            $scope.nextStep();
        }
    };
}]);