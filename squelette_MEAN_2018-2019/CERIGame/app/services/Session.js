CERIGameApp.service('Session', ['$http', '$window', '$q', function ($http, $window, $q) {
    let name = "session";
    let $this = this;
    this.error = "error session";
    let result = undefined;
    let deferred = $q.defer();
    /*
    get the current session from mongodb
     */
    this.get = function () {
        $http.get("/getSession").then(function(session){
            if(session !== undefined && session.data !== undefined && session.data[0] !== undefined) {
                sessionStorage.setItem(name, JSON.stringify(session.data[0].session));
                result = session.data[0];
                deferred.resolve(result);
            }
            else{
                console.log(JSON.stringify(session));
                console.log("session expired !");
                deferred.reject("session expired !");
                $this.remove();
            }

        }, function (error) {
            $this.remove();
            this.error = error;
            result = JSON.parse(error);
            deferred.reject(result);
        });

        result = deferred.promise;
        return $q.when(result);
    };

    /*
    store session in the sessionStorage
     */
    this.store = function () {
        $this.get().then(function (session) {
            sessionStorage.setItem(name, JSON.stringify(session.session));
        });
    };

    /*
    remove session from the sessionStorage
     */
    this.remove = function () {
        sessionStorage.removeItem(name);
    };

    /*
    get the current session from the sessionStorage
     */
    this.getSession = function () {
        let session = sessionStorage.getItem(name);
        if(session !== undefined) {
            console.log(session);
            return JSON.parse(session).user;
        }

        this.error = "you are disconnected !";
        return this.error;
    };

    this.getError = function () {
        return this.error;
    }

    /*
    delete session from mongodb
     */
    this.delete = function () {
        $http.post("/deleteSession").then(function () {
            $this.remove();
            $window.location.href = "/";
        });
    };
}]);

