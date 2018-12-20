CERIGameApp.controller('ProfileController',['$scope', 'Request', 'Session', '$filter', '$routeParams', function($scope, Request, Session, $filter, $routeParams) {


    let id = undefined;

    if($routeParams.id !== undefined){
        id = $routeParams.id;
        $scope.visitor = true;
    }
    else{
        id = Session.getSession().id;
        $scope.visitor = false;
    }

    Request.get('/getUser/' + id).then(function(user){

        user = user[0];
        $scope.firstName = user.nom;
        $scope.lastName = user.prenom;

        let dateFinale = $filter('date')(user.date_de_naissance, "dd/MM/yyyy");
        $scope.birthday = new Date(dateFinale);

        $scope.picture = user.avatar;
        $scope.identifiant = user.identifiant;
    },function (error) {
        swal("Error", "Une erreur s'est produite lors de la récupération des données !", "error");
    });

    $scope.modify = function(){

        Request.put('/updateUser',{
            "id" : id,
            "nom" : $scope.firstName,
            "prenom" : $scope.lastName,
            "avatar" : $scope.picture,
        }).then(function (response) {
            swal("Success", "Le profile est mis à jour", "success");
        },function (error) {
            swal("Error", "Une erreur s'est produite lors de la mise à jour des données de votre profil !", "error");
        });
    };

}]);