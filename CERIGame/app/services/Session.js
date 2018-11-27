CERIGameApp.service('Session', ['$http', '$window', function ($http, $window) {

    this.get = function (callback = undefined) {
        $http.get("/getSession").then(function(session){
            if(session !== undefined && callback !== undefined){
                callback(session.data[0].session.user);
            }
        });
    };

    this.delete = function () {
        $http.post("/deleteSession").then(function () {
            $window.location.href = "/";
        });
    };
}]);

