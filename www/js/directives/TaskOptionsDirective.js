(function() {
    'use strict';

    function taskOptionsDirective ($log) {
      var taskOptions = {
        link: 'href="',
        phone: 'href="tel:',
        email: 'href="mailto:'
      };
      var taskIcons = {
        link: 'button button-calm icon-left ion-link',
        phone: 'button button-calm icon-left ion-android-call',
        email: 'button button-calm icon-left ion-email'
      };
      return {
        restrict: 'E',
        template: function(elem, attr) {
          if (attr.optionText) {
            return '<a ' + taskOptions[attr.optionType] + attr.optionTarget + '" class="' + taskIcons[attr.optionType] + '">' + attr.optionText + '</a>';
          }
        }
      };
    }

    angular.module('erpClient')
      .directive('taskOptions', taskOptionsDirective);

}());
