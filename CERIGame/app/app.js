let CERIGameApp = angular.module('CERIGameApp', ["ngRoute"]);

CERIGameApp
    .run(['$rootScope', '$route', function($rootScope,$route) {
        $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
            //Change page title, based on Route information
            $rootScope.title = $route.current.title;
        });
    }])
    .config(function($routeProvider, $locationProvider) {
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
        .when('/statistics', {
            templateUrl: '/app/views/statistics.html',
            controller: 'StatisticsController',
            title: 'Statistiques',
        })
        .when('/about', {
            templateUrl: '/app/views/about.html',
            controller: 'AboutController',
            title: 'About',
        });

    $locationProvider.html5Mode(true);


    });
