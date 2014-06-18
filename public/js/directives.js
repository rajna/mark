'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('butterbar',['$rootScope',function($rootScope){
  	return {
  		link:function(scope,element,attrs){
  			element.addClass('loading-hide');

  			$rootScope.$on('$routeChangeStart',function(){
  				element.removeClass('loading-hide');
  			});

  			$rootScope.$on('$routeChangeSuccess',function(){
  				element.addClass('loading-hide');
  			});
  		}
  	}
  }]).directive('focus',function(){
  	return {
  		link:function(scope,element,attrs){
  			element[0].focus();
  		}
  	}
  }).directive('fetchBookface', function($http) {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            scope.hasdata=false;
            elm.bind('keyup', function() {
              $http({method: 'POST',url:'/api/baike',data:{bookname:scope.form.name}}).success(function(data, status, headers, config) {
                scope.bookfaces= data.bookfaces;
                scope.hasdata=true;
                //scope.$apply();
              }).error(function(data, status, headers, config) {
                alert("server error");
              });
            });
        }
    }
}).directive('chooseBookface', function() {
    //添加书籍选择封面
    return {
        link : function(scope, elm, attrs, ctrl) {
            elm.bind('click', function() {
              elm.parent().children().removeClass('mk-true-click');
              elm.addClass('mk-true-click');
              //console.log(elm.children().eq(0).attr("src"));
              scope.form.bookface=elm.children().eq(0).attr("src");
              scope.form.name=elm.children().eq(0).attr("alt");
              scope.$apply();
            });
        }
    }
});




