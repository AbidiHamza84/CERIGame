CERIGameApp.controller('NewPartyController',['$scope', 'Request', '$timeout', 'Session', function($scope, Request, $timeout, Session) {
    $scope.currentStep = 1;
    $scope.level = "2";
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
        Request.get('/getThemes').then(function(themes){
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
        Request.post('/getQuizzByTheme', {idTheme : $scope.themeParty}).then(function (response) {
            $scope.quizzList = response.data;
            $scope.currentQuizz = -1;
            $scope.nextQuizz();
        });
    };

    /*
        choisir une réponse
     */
    $scope.chooseResponse = function (event, choosenResponse) {

        // vérifier si on peut toujours choisir une réponse

        let response = angular.element( document.querySelector('#prop_' + choosenResponse + ' .proposition')).text();
        if($scope.showNextQuizz === false) {
            if (response === $scope.quizzList[$scope.currentQuizz].reponse) {

                $scope.goodResponse = choosenResponse;
                $scope.score++;

                $scope.wellResponse="Bonne reponse !";
            } else {
                $scope.showGoodResponse();

                $scope.wrongResponse="Mauvaise reponse !";
            }

            $scope.showAnecdote();
        }


        $scope.showNextQuizz = true;
    };

    function getGoodResponseIndex (){

        let goodResponse = -1;

        //chercher l'indice de la bonne réponse
        $scope.quizzList[$scope.currentQuizz].propositions.forEach(function (proposition, i){
            if(proposition === $scope.quizzList[$scope.currentQuizz].reponse)
                goodResponse = i;

        });

        return goodResponse;
    }

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

    };

    /*
    Afficher l'anecdote
     */
    $scope.showAnecdote = function() {
        angular.element( document.querySelector('#prop_' + $scope.goodResponse + ' .anecdote')).text($scope.quizzList[$scope.currentQuizz].anecdote);
    };

    let time = 0;
    let minutes, seconds;
    let timeStopper ;
    let timer = function() {
        time += 1;
        let rest = new Date(time * 1000);
        minutes = rest.getMinutes();
        seconds = rest.getSeconds();
        if(minutes !== 0)
            $scope.timer = minutes + " minute(s) et " + seconds + " seconde(s)";
        else
            $scope.timer = seconds + " seconde(s)";
        timeStopper = $timeout(timer, 1000);
    };

    function generateRandomNumber(min_value , max_value)
    {
        return Math.floor(Math.random() * (max_value-min_value) + min_value) ;
    }

    function getQuizzByLevel() {
        let quizz = {propositions: []};
        let taken = Array();

        quizz.question = $scope.quizzList[$scope.currentQuizz].question;
        quizz.response = $scope.quizzList[$scope.currentQuizz].reponse;
        taken[0] = getGoodResponseIndex();
        let i = 1;
        switch ($scope.level) {
            case "4" :
                quizz.propositions = $scope.quizzList[$scope.currentQuizz].propositions;
                break;
            case "3" :

                while(i < 3){
                    let val = generateRandomNumber(0,3);
                    let exist = false;
                    taken.forEach(function (elem) {
                       if(elem === val)
                           exist = true;
                    });

                    if(exist === false){
                        taken[i] = val;
                        i++;
                    }
                }
                taken.forEach(function (elem, index) {
                   quizz.propositions[index] = $scope.quizzList[$scope.currentQuizz].propositions[elem];
                });
                break;
            case "2" :
                while(i < 2){
                    let val = generateRandomNumber(0,3);
                    let exist = false;
                    taken.forEach(function (elem) {
                        if(elem === val)
                            exist = true;
                    });

                    if(exist === false){
                        taken[i] = val;
                        i++;
                    }
                }
                taken.forEach(function (elem, index) {
                    quizz.propositions[index] = $scope.quizzList[$scope.currentQuizz].propositions[elem];
                });

                break;
        }

        return quizz;
    }

    /* passer au quizz suivant de la liste chargée auparavant en affichant le compteur

     */
    $scope.nextQuizz = function () {
        if($scope.currentQuizz == -1)
        {
            timer();
        }

        if($scope.currentQuizz < $scope.quizzList.length - 1) {


            $scope.goodResponse = -1;
            $scope.currentQuizz++;
            $scope.wellResponse = "";
            $scope.wrongResponse = "";



            $scope.quizz = getQuizzByLevel();

            $scope.showNextQuizz = false;

        }
        else{

            $timeout.cancel(timeStopper);
            let total = minutes * 60 + seconds;
            let nbResponse = $scope.score;
            $scope.score = Math.floor(total / $scope.score);

            Request.post('/setHistory/' + Session.getSession().id, {nbreponse: nbResponse, temps: total, score :$scope.score});
            
            $scope.nextStep();
        }
    };
}]);