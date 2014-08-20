'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngSanitize','ngCookies']).
  controller('loginController', function ($scope,$http,$location,$cookieStore) {
    $scope.logo="MARK";

    if($cookieStore.get('user')){
      $location.path('/mark');
     }

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
  controller('registerController', function ($scope,$http,$location,$cookieStore) {
    if($cookieStore.get('user')){
      $location.path('/mark');
     }

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
  controller('BooksController', function($scope, $http,$rootScope, $location,$cookieStore,$q,Book) {
    
     if(!$cookieStore.get('user')){
      $location.path('/login');
     }
     $scope.user=$cookieStore.get('user');
     $scope.books = Book.query({user:$cookieStore.get('user').name});
     $scope.form = {};
     $scope.title="MARK";
     $scope.clicked=false;
    $scope.openDuoKan= function () {
      Android.showToast();
    };
    $scope.searchUsers= function () {
      $location.path('/searchUsers');
    };
	  $scope.addMark= function () {
      $scope.form.user=$cookieStore.get('user').name;
	    $http.post('/books',$scope.form).
	      success(function(data) {
          $rootScope.go('/mark', 'slideLeft')
	      });
	  };
    $scope.addNewmark= function (book) {
       $rootScope.go('/books/'+book.id, 'slideLeft');
    };
    $scope.logout= function () {
      $cookieStore.remove('user');
      $location.path('/');
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
  controller('searchUsersController',function($scope,$http,$location,$cookieStore,User){
    if(!$cookieStore.get('user')){
      $location.path('/');
     }
    $scope.users = User.query();
    $scope.goMark=function(){
      $location.path('/mark');
    }
    $scope.form={};
    $scope.folowUser=function(user){

      $scope.form.user=$cookieStore.get('user').email;
      $scope.form.follow=user.id;
      $http.post('/folowUser/',$scope.form).
        success(function(data) {
          if(data.success){
            alert("ok");
          }
        });
    }
  }).
  controller('BaikeController', function ($scope,$http,$location,$cookieStore) {
    if(!$cookieStore.get('user')){
      $location.path('/');
     }
    $http.get('/api/baike').success(function(data, status, headers, config) {
        $scope.bookfaces= data.bookfaces;
      });
  }).
  controller('BookmarkedController', function ($scope,$http,$location,$routeParams,$cookieStore,Book) {
    if(!$cookieStore.get('user')){
      $location.path('/');
     }
    $scope.book = Book.get({id: $routeParams.id});
    $scope.save=function(){
      $scope.book.$save(function(book){
        $location.path('/mark');
      });
    }
  })
