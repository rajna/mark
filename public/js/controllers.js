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

    $scope.form = {};
    $scope.message="";
    $scope.ak="1000";
    $scope.showp = function(event) {
     alert(event);
  };
    $scope.reg= function () {
      alert("ddd");
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
  controller('BooksController', function($scope, $http,$rootScope, $location,$cookieStore,$q,Book,User) {
     var loginUser=$cookieStore.get('user');
     if(!loginUser){
      $location.path('/login');
     }
     $scope.user=loginUser;
     $scope.books = Book.queryself({user:loginUser.name});
     $scope.form = {};
     $scope.title="MARK";
     $scope.clicked=false;
     $scope.listfilter="个人";
    
    var url = 'http://fast-ridge-7096.herokuapp.com/';
    var urltest='http://192.168.1.107:3000/';
     var socket = io.connect(urltest);

     socket.on('newmarkdone', function(data){
      $http.get('/user/'+loginUser.email+'/fellowlist').
        success(function(fellow) {
          var hasFellow="false";
          console.log(loginUser.name);
          for(var i in fellow){
            //alert(fellow[i].name+data.user);
            if(fellow[i].name==data.user){
              //alert(fellow[i].name+data.user);
              Android.showNotification(data.user,data.bookname,data.pagenum,data.bookdesc);
              break;
            }
          }
        });
     });

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
    //下拉菜单end
    $scope.selfbooklist=function(){
          $scope.listfilter="个人";
          $scope.books=Book.queryself({user:$cookieStore.get('user').name});
          
    };
    $scope.booklist=function(){
          $scope.listfilter="所有";
          $scope.books=Book.query({user:$cookieStore.get('user').name});
          
    };
    $scope.openDuoKan= function () {
      Android.showToast();
    };
    $scope.searchUsers= function () {
      $location.path('/searchUsers');
    };
    $scope.showNotification= function () {
      Android.showNotification();
    };
    $scope.showVoiceinput= function () {
      Android.showVoiceinput();
    };
    $scope.searchFellows=function(){
      $location.path('/searchFellows');
    }
	  $scope.addMark= function () {
      $scope.form.user=$cookieStore.get('user').name;

	    $http.post('/books',$scope.form).
	      success(function(data) {

          $rootScope.go('/mark', 'slideLeft');

	      });
	  };
    $scope.addComment= function (book) {
      $rootScope.go('/books/comment/'+book.id, 'slideLeft');
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
      });
    }
  }).
  controller('searchUsersController',function($scope,$http,$location,$cookieStore,User){
    var user=$cookieStore.get('user');
    if(!user){
      $location.path('/');
     }
    $scope.users = User.query({useremail:user.email});
    $scope.goMark=function(){
      $location.path('/mark');
    }
    $scope.form={};
    $scope.folowUser=function(user,target){

      $scope.form.user=$cookieStore.get('user').email;
      $scope.form.follow=user.id;
       $http.post('/folowUser/',$scope.form).
         success(function(data) {
           if(data.msg){
             var ele=angular
              .element(target)
              .parent('li');
             if(ele.attr("class")!="ng-scope"){
               ele=ele.parent();
             }
            ele
              .children()
              .eq(1)
              .removeClass('mk-u-adding')
              .addClass('mk-u-added');
            ele
              .children()
              .eq(2)
              .removeClass('mk-u-following')
              .addClass('mk-u-followed');
           }
         });
    }
  }).
controller('searchFellowsController',function($scope,$http,$location,$cookieStore,User){
    var user=$cookieStore.get('user');
    if(!user){
      $location.path('/');
     }
    $scope.users = User.queryfellow({useremail:user.email});
    $scope.goMark=function(){
      $location.path('/mark');
    }
    $scope.form={};
    $scope.folowRemove=function(user,target){

      $scope.form.user=$cookieStore.get('user').email;
      $scope.form.follow=user.id;
       $http.post('/folowRemove/',$scope.form).
         success(function(data) {
           if(data.msg){
             var ele=angular
              .element(target)
              .parent('li');
             if(ele.attr("class")!="ng-scope"){
               ele=ele.parent();
             }
            ele
              .children()
              .eq(1)
              .removeClass('mk-u-adding')
              .addClass('mk-u-added');
            ele
              .children()
              .eq(2)
              .removeClass('mk-u-following')
              .addClass('mk-u-followed');
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
    var user=$cookieStore.get('user');
    if(!user){
      $location.path('/');
     }
     
     var url = 'http://fast-ridge-7096.herokuapp.com/';
     var urltest='http://192.168.1.107:3000/';
     var socket = io.connect(urltest);

    $scope.book= Book.get({id: $routeParams.id});
    $scope.save=function(){
      console.log($scope.book);
      $scope.book.$save(function(book){
          socket.emit('newmark',{user:user.name,
                                 email:user.email,
                                 bookname:book.book.name,
                                 pagenum:book.book.pagenum,
                                 bookdesc:book.book.bookdesc});
          $location.path('/mark');
      });
    }
  }).
  controller('MarkcommentController', function ($scope,$http,$location,$routeParams,$cookieStore,Book) {
    if(!$cookieStore.get('user')){
      $location.path('/');
     }
    $scope.book = Book.get({id: $routeParams.id});
    $scope.postComment= function () {
      $scope.book.user=$cookieStore.get('user').name;
      $http.post('/books/addComment',$scope.book).
        success(function(data) {
          $scope.book = Book.get({id: $routeParams.id});
        });
    };
  })
