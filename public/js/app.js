'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider,$httpProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'partials/login',
      controller: 'loginController'
    }).
    when('/register', {
      templateUrl: 'partials/register',
      controller: 'registerController'
    }).
    when('/mark', {
      templateUrl: 'partials/marklist',
      controller: 'BooksController'
    }).
    when('/books/:id', { 
     templateUrl: 'partials/booknewmark',
     controller: 'BookmarkedController' 
   }).
    when('/addMark', {
      templateUrl: 'partials/addMark',
      controller: 'BooksController'
    }).
    when('/baike', {
      templateUrl: 'partials/baike',
      controller: 'BaikeController'
    }).
    otherwise({
      redirectTo: '/login'
    });

  $locationProvider.html5Mode(true);
});
