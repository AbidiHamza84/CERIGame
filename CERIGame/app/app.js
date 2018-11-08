let CERIGameApp = angular.module('CERIGameApp', ["ngRoute"]);

CERIGameApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/login.html',
            controller: 'UserController',
        })
        .when('/home', {
            templateUrl: 'app/views/home.html',
            controller: 'HomeController',
        });

    $locationProvider.html5Mode(true);


    });
