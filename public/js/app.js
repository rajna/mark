'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngAnimate',
  'ng-polymer-elements'
  /*'ui.bootstrap'*/
], function ($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }).
run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {

    'use strict';
    /**
     * Helper method for main page transitions. Useful for specifying a new page partial and an arbitrary transition.
     * @param  {String} path               The root-relative url for the new route
     * @param  {String} pageAnimationClass A classname defining the desired page transition
     */
    $rootScope.go = function (path, pageAnimationClass) {

        if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
            $rootScope.pageAnimationClass = 'crossFade';
        }
        
        else { // Use the specified animation
            $rootScope.pageAnimationClass = pageAnimationClass;
        }

        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }
        
        else { // Go to the specified path
            $location.path(path);
        }
    };
}]).
config(function ($routeProvider, $locationProvider,$httpProvider) {
  $routeProvider.
    when('/login', {
      controller: 'loginController',
      template: document.getElementById('loginView').text
    }).
    when('/register', {
      controller: 'registerController',
      template: document.getElementById('registerView').text
    }).
    when('/mark', {
      controller: 'BooksController',
      template: document.getElementById('marklistView').text
    }).
    when('/books/:id', { 
     template: document.getElementById('booknewmarkView').text,
     controller: 'BookmarkedController' 
    }).
    when('/books/comment/:id', { 
     template: document.getElementById('addcommentView').text,
     controller: 'MarkcommentController' 
    }).
    when('/addMark', {
      template: document.getElementById('addmarkView').text,
      controller: 'BooksController'
    }).
    when('/baike', {
      templateUrl: 'partials/baike',
      controller: 'BaikeController'
    }).
    when('/searchUsers', {
      template: document.getElementById('searchUsersView').text,
      controller: 'searchUsersController'
    }).
    when('/searchFellows', {
      template: document.getElementById('searchFellowsView').text,
      controller: 'searchFellowsController'
    }).
    otherwise({
      redirectTo: '/login'
    });

  $locationProvider.html5Mode(true);


});
