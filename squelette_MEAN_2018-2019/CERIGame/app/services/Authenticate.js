CERIGameApp.service('Authenticate', ['$http', function ($http) {

    this.login = function (username, password) {
        return $http.post("/login", { username: username, password: password }).then(function(response){
            if (response.data.error.state === false) {

                localStorage.setItem('lastConnexion', new Date().toLocaleString());

                return(response);

            }
            else{
                let message = '<strong> Connexion refusée</strong>  Login ou mot de passe est incorrect.';
                return(message);
            }
        },function (error) {
            let message = '<strong> Connexion refusée</strong>  Une erreur se produite !.';
            return(message);
        });
    }
}]);