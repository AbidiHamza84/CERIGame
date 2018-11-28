CERIGameApp.controller('ProfileController',['$scope', 'Request', 'Session', '$filter', function($scope, Request, Session, $filter) {

    let session = Session.getSession();
    Request.get('/getUser/' + session.id, function(user){
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

    $scope.modify = function(){
        Request.put('/updateUser',{
            "id" : session.id,
            "nom" : $scope.firstName,
            "prenom" : $scope.lastName,
            "avatar" : $scope.picture,
        }, function (response) {
            swal("Success", "Le profile est mis à jour", "success");
        });
    };

}]);