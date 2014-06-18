'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngSanitize','ngCookies']).
  controller('loginController', function ($scope,$http,$location,$cookieStore) {
    $scope.logo="MARK";

    $http.get('/user/login').
        success(function(data){
          if(data.user!=null){
            $scope.user=data.user;
            $location.path('/mark');
          }
        });

    $scope.login= function () {
      $http.post('/api/login',$scope.form).
        success(function(data){
          $scope.error=data.error;
          if(!data.error){
            $cookieStore.put('user',data.user);
            $location.path('/mark');
          }
        });
    };
    
  }).
  controller('registerController', function ($scope,$http,$location) {
    $http.get('/user/login').
        success(function(data){
          if(data.user!=null){
            $scope.user=data.user;
            $location.path('/mark');
          }
        });

    $scope.form = {};
    $scope.message="";
    
    $scope.reg= function () {
      $http.post('/api/reg',$scope.form).
        success(function(data) {
          $scope.message=data.error;
          if(data.success){
            //$scope.user=data.user;
            $location.path('/login');
          }
        });
    };
  }).
  controller('BooksController', function($scope, $http, $location,$cookieStore,$q,Book) {
    $http.get('/user/login').
        success(function(data){
          if(data.user==null){
            $scope.user=data.user;
            $location.path('/login');
          }else{
            $scope.user=data.user;
          }
        });
     //$http.get('/books/booklist').success(function(data, status, headers, config) {
        //$scope.books = data;
     //});
     $scope.books = Book.query();
     $scope.form = {};
     $scope.title="MARK";
     $scope.clicked=false;
	 $scope.addMark= function () {
	    $http.post('/books',$scope.form).
	      success(function(data) {
	        $location.path('/mark');
	      });
	  };
    $scope.addNewmark= function (book) {
       $location.path('/books/'+book.id);
    };
    $scope.logout= function () {
      //$cookieStore.remove('user');
      $http.get('/user/logout').
        success(function(data) {
          $location.path('/login');
        });
    };
    $scope.openMenu=false;
    $scope.openNav=function(){
      $scope.openMenu=!$scope.openMenu
      if($scope.openMenu){
        $scope.title="PROFILE";
      }else{
        $scope.title="MARK";
      }
    };
    $scope.remove=function(index,book){
      book.$remove(function(data){
       $scope.books.splice(index, 1);
       $scope.apply();
      });
    }
  }).
  controller('BaikeController', function ($scope,$http,$location) {
    $http.get('/api/baike').success(function(data, status, headers, config) {
        $scope.bookfaces= data.bookfaces;
      });
  }).
  controller('BookmarkedController', function ($scope,$http,$location,$routeParams,Book) {
    $scope.book = Book.get({id: $routeParams.id});
    $scope.save=function(){
      $scope.book.$save(function(book){
        $location.path('/mark');
      });
    }
  })
