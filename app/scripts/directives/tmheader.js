'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:header
 * @description
 * # header
 */
angular.module('luZhouApp')
    .directive('tmHeader', function() {
        return {
            templateUrl: 'components/tmHeader.html',
            restrict: 'EA',
            scope: {},
            link: function postLink(scope, element, attrs) {

            }
        };
    });