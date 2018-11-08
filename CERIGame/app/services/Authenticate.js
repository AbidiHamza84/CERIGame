CERIGameApp.service('Authenticate', ['$http', function ($http) {

    this.login = function (username, password, callback = undefined) {


        $http.post("/login", { username: username, password: password }).then(function(response){
            if (response.data.error.state === false) {
                localStorage.setItem('lastConnexion', new Date().toLocaleString());
                console.log(JSON.stringify(response));

                if(callback !== undefined)
                    callback();

            }
            else{
                let message = '<strong> Connexion refusée</strong>  Login ou mot de passe est incorrect.';
                console.log(message);
            }
        },function (error) {
            let message = '<strong> Connexion refusée</strong>  Une erreur se produite !.';
            console.log(message);
        });
    }
}]);