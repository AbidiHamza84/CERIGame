CERIGameApp.service('Request', ['$http', 'Session', '$q', function ($http, Session, $q) {

    let result = undefined;


    this.get = function (request) {
        let deferred = $q.defer();
        // on récupère la session
        Session.get().then(function (session) {
            // si la session est valide, on envoie la requete
            $http.get(request).then(function(response){

                result = response.data;
                deferred.resolve(result);

            }, function(error) {

                result = error;
                deferred.reject(error);

            });
        }, function(error) {
            result = error;
            deferred.reject(error);
        });

        result = deferred.promise;

        return $q.when(result);
    };

    this.post = function(request = "", params = {}){
        let deferred = $q.defer();
        // on récupère la session
        Session.get().then(function (session) {

            // si la session est valide, on envoie la requete
            $http.post(request,params).then(function(response){
                result = response.data;
                deferred.resolve(result);
            }, function(error) {
                result = error;
                deferred.reject(error);
            });
        }, function(error) {
            result = error;
            deferred.reject(error);
        });

        result = deferred.promise;

        return $q.when(result);
    };

    this.put = function (request = "", params = {}) {
        let deferred = $q.defer();
        // on récupère la session
        Session.get().then(function (session) {
            // si la session est valide, on envoie la requete
            $http.put(request,params).then(function(response){
                result = response.data;
                deferred.resolve(result);
            }, function(error) {
                result = error;
                deferred.reject(error);
            });
        }, function(error) {
            result = error;
            deferred.reject(error);
        });

        result = deferred.promise;

        return $q.when(result);
    };

    this.delete = function (request = "", params = {}) {
        let deferred = $q.defer();
        // on récupère la session
        Session.get().then(function (session) {

            // si la session est valide, on envoie la requete
            $http.delete(request,params).then(function(response){
                result = response.data;
                deferred.resolve(result);
            }, function(error) {
                result = error;
                deferred.reject(error);
            });
        }, function(error) {
            result = error;
            deferred.reject(error);
        });

        result = deferred.promise;

        return $q.when(result);
    };
}]);
