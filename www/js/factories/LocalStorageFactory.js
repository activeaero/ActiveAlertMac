(function() {
    'use strict';

    function LocalStorageFactory ($window, $log) {
      return {
        get: function (key, isObj) {

          var lookup = $window.localStorage.getItem(key);

          if (lookup && isObj) {
            var result = angular.fromJson(lookup);
            $log.debug('Found ' + key + ' in local storage. From Json');
            return result;
          } else if (lookup && !isObj) {
            $log.debug('Found ' + key + ' in local storage.');
            var result = lookup;
            return result;
          } else {
            $log.debug('Cannot find item in local storage.');
          }

        },
        set: function (key, value, isObj) {

          if (isObj) {
            var result = angular.toJson(value);
            $window.localStorage.setItem(key, result);
            $log.debug('Set Key: ' + key + ' with value: ' + result + ' in local storage. Converted to Json');
          } else {
            $window.localStorage.setItem(key, value);
            $log.debug('Set Key: ' + key + ' with value: ' + value + ' in local storage.');
          }

        },
        remove: function (key) {
          $window.localStorage.removeItem(key);
          $log.debug('Removed Key: ' + key + ' from local storage.');
        },
        list: function () {
          $log.debug('Local Storage (key,Value) Dump',$window.localStorage);
        },
        clear: function () {
          $window.localStorage.clear();
          $log.debug('Local Storage Empty');
        }
      };
    }

  angular.module('erpClient').factory('LocalStore', LocalStorageFactory);

}());
