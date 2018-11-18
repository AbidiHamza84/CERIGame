
CERIGameApp.service('Session', ['$http', function ($http) {
    const config = require("./../../json/config");
    this.get = function () {
        $http.get("/session").then(function(response){
            console.log('get session = ' + response);
        });
    };

    this.set = function (session = config.session) {
        $http.post("/session", { session: session }).then(function(response){
            console.log('session after posting (' + session + ') = ' + response);
        });
    }
}]);