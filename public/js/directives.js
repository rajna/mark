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
  				if(localStorage.componentReady){
            element.addClass('loading-hide');
          }
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
              $http({method: 'POST',url:'/api/fetchBookface',data:{bookname:scope.form.name}}).success(function(data, status, headers, config) {
                data.bookfaces.push({
                  name:scope.form.name,
                  bookface: "/img/markBookfaceDefault.png"
                });
                scope.bookfaces= data.bookfaces;
                scope.hasdata=true;
                //scope.$apply();
              }).error(function(data, status, headers, config) {
                alert("获取数据失败!");
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
}).directive('touchNav', function() {
    //滑动导航
    return {
        link : function(scope, elm, attrs, ctrl) {
            function mobilecheck() {
              var check = false;
              (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
              return check;
             }
            var eventtype = mobilecheck() ? 'touchmove' : 'click';
             
            if(mobilecheck()){
              var startX = 0;
              elm.bind('touchstart', function(evt) {
                var touch = evt.touches[0]; //获取第一个触点
                var x = Number(touch.pageX); //页面触点X坐标
                //记录触点初始位置
                startX = x;
              });
              elm.bind('touchmove', function(evt) {
                evt.preventDefault();
                var touch = evt.touches[0]; //获取第一个触点
                var x = Number(touch.pageX); //页面触点X坐标
                var movex=x-startX;
                if(movex<0){
                  elm.css('left',movex+'px');
                }
              });
              elm.bind('touchend', function(evt) {
                
                var left=parseInt(elm.css('left').split("px")[0]); 
                var halfslidewidth=302/2;
                if(left+halfslidewidth<0){
                   scope.openMenu=!scope.openMenu;
                
                  if(scope.openMenu){
                    scope.title="PROFILE";
                  }else{
                    scope.title="MARK";
                  }
                  scope.$apply();
                  elm.attr('style','none');
                }else{
                  elm.attr('style','0px');
                }
                
              });
            }else{
              elm.bind('click', function(evt) {
                evt.preventDefault();
                scope.openMenu=!scope.openMenu;
                
                  if(scope.openMenu){
                    scope.title="PROFILE";
                  }else{
                    scope.title="MARK";
                  }
                  scope.$apply();
              });
            }
            
        }
    }
});




