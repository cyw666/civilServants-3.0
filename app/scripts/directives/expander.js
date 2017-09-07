'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:expander
 * @description
 * # expander
 */
angular.module('luZhouApp')
  .directive('expander', function () {
    return {
      templateUrl: 'components/expander.html',
      restrict:'EA',
      transclude:true,
      scope:{
        title:'=expanderTitle',
        titleClick:'=titleClick',
        channelId:'=channelId',
      },
      link:function(scope,element,attrs){
        scope.showMe=false;
        scope.toggle=function toggle(){
          scope.showMe=!scope.showMe;
        }
      }
    };
  });
