CERIGameApp.service('Request', ['$http', 'Session', '$rootScope', function ($http, Session, $rootScope) {


    this.get = function (request, callback = undefined) {

        $rootScope.showPane = function() {
            $rootScope.isPaneShown = true;
        };

        // on récupère la session
        Session.get(function (session) {
           if(session !== undefined){

               // si la session est valide, on envoie la requete
               $http.get(request).then(function(response){

                    // si il y a callback, on l'execute en lui passant le résultat de la requete
                    if(callback !== undefined){
                        callback(response);
                    }

                   $rootScope.hidePane = function() {
                       $rootScope.isPaneShown = false;
                   };
               });
           }
        });


    };

    this.post = function(request = "", params = {}, callback = undefined){
        // on récupère la session
        Session.get(function (session) {
            if(session !== undefined){

                // si la session est valide, on envoie la requete
                $http.post(request,params).then(function(response){

                    // si il y a callback, on l'execute en lui passant le résultat de la requete
                    if(callback !== undefined){
                        callback(response);
                    }
                });
            }
        });
    };

    this.put = function (request = "", params = {}, callback = undefined) {
        // on récupère la session
        Session.get(function (session) {
            if(session !== undefined){

                // si la session est valide, on envoie la requete
                $http.put(request,params).then(function(response){

                    // si il y a callback, on l'execute en lui passant le résultat de la requete
                    if(callback !== undefined){
                        callback(response);
                    }
                });
            }
        });
    };

    this.delete = function (request = "", params = {}, callback = undefined) {
        // on récupère la session
        Session.get(function (session) {
            if(session !== undefined){

                // si la session est valide, on envoie la requete
                $http.delete(request,params).then(function(response){

                    // si il y a callback, on l'execute en lui passant le résultat de la requete
                    if(callback !== undefined){
                        callback(response);
                    }
                });
            }
        });
    };
}]);
