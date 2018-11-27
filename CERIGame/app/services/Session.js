CERIGameApp.service('Session', ['$http', '$window', function ($http, $window) {
    let name = "session";
    let $this = this;
    /*
    get the current session from mongodb
     */
    this.get = function (callback = undefined) {
        $http.get("/getSession").then(function(session){
            if(session !== undefined && session.data !== undefined && session.data[0] !== undefined) {
                if(callback !== undefined)
                    callback(session.data[0].session.user);
            }
            else {
                $this.remove();
                if(callback !== undefined)
                    callback(undefined);
            }
        });
    };

    /*
    store session in the sessionStorage
     */
    this.store = function () {
        $this.get(function (session) {
            if(session !== undefined){
                sessionStorage.setItem(name, JSON.stringify(session));
            }
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
        if(session !== undefined)
            return JSON.parse(session);

        return undefined;
    };

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

