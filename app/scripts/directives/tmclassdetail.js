'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmclassdetail
 * @description
 * # tmClassDetail
 */
angular.module('luZhouApp')
    .directive('tmClassDetail', function() {
        return {
            templateUrl: 'components/tmClassDetail.html',
            restrict: 'EA',
            transclude: {
                'pagation': 'tm-pagation'
            },
            link: function postLink(scope, element, attrs) {

            }
        };
    });