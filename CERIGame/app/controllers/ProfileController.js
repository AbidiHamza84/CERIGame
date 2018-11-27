CERIGameApp.controller('ProfileController',['$scope', '$http', 'Session', '$filter', function($scope, $http, Session, $filter) {
    Session.get(function(session){
        if(session !== undefined){
            console.log("aaa");
            console.log(session.id);
            let id = session.id;
            $http.get('/getUser/' + id).then(function (user) {
                $scope.firstName = user.data[0].nom;
                $scope.lastName = user.data[0].prenom;
                //let date = new Date(user.data[0].date_de_naissance);
                //$scope.birthday = date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();

                //console.log($filter('date')(user.data[0].date_de_naissance, "dd/MM/yyyy"));
                let dateFinale = $filter('date')(user.data[0].date_de_naissance, "dd/MM/yyyy");
                $scope.birthday = new Date(dateFinale);

                $scope.picture = user.data[0].avatar;
                $scope.identifiant = user.data[0].identifiant;
            });
        }
        else
            console.log("aaaa 3");
    });

    $scope.modify = function () {
        Session.get(function (session) {

            $http.put('/updateUser',{
                "id" : session.id,
                "nom" : $scope.firstName,
                "prenom" : $scope.lastName,
                "avatar" : $scope.picture,
            }).then(function (response) {
                console.log("kamalt ! " + response.data);
            });
        }) ;
    };
}]);