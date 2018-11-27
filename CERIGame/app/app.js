let CERIGameApp = angular.module('CERIGameApp', ['ngRoute','sweetalert']);

CERIGameApp
    .run(['$rootScope', '$route', '$window', 'Session', function ($rootScope, $route, $window, Session) {
        $rootScope.$on("$routeChangeSuccess", function (currentRoute, previousRoute) {

            Session.get(function(session){
                if(session !== undefined){
                    //Change page title, based on Route information
                    $rootScope.title = $route.current.title;
                }
                else if ($route.current.originalPath !=="/"){
                    $window.location.href = "/";
                }
            });

            //Change page title, based on Route information
            $rootScope.title = $route.current.title;

            //En cas de déconnexion
            if ($route.current.redirectTo !== undefined && $route.current.redirectTo === '/logout') {
                $window.location.href = "/";
            }
        });
    }])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode({enabled: true, requireBase: false});

        $routeProvider
            .when('/', {
                controller: 'UserController',
                title: 'Login',
            })
            .when('/home', {
                templateUrl: '/app/views/dashboard.html',
                controller: 'DashBoardController',
                title: 'Tableau de bord',
            })
            .when('/dashboard', {
                templateUrl: '/app/views/dashboard.html',
                controller: 'DashBoardController',
                title: 'Tableau de bord',
            })
            .when('/profile', {
                templateUrl: '/app/views/profile.html',
                controller: 'ProfileController',
                title: 'Profile',
            })
            .when('/history', {
                templateUrl: '/app/views/history.html',
                controller: 'HistoryController',
                title: 'Historique',
            })
            .when('/users', {
                templateUrl: '/app/views/users.html',
                controller: 'UsersController',
                title: 'Amis',
            })
            .when('/statistics', {
                templateUrl: '/app/views/statistics.html',
                controller: 'StatisticsController',
                title: 'Statistiques',
            })
            .when('/about', {
                templateUrl: '/app/views/about.html',
                controller: 'AboutController',
                title: 'About',
            })
            .when('/newParty', {
                templateUrl: '/app/views/newParty.html',
                controller: 'NewPartyController',
                title: 'Nouvelle partie',
            })
            .otherwise({
                redirectTo: '/logout'
            })
    }]);
