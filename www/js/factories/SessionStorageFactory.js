(function() {
  'use strict';

  function SessionStorageFactory ($window, $log) {
    var loggedIn = false;
    return {
      get: function (key, isObj) {

        var lookup = $window.sessionStorage.getItem(key);

        if (lookup && isObj) {
          var result = angular.fromJson(lookup);
          $log.debug('Found ' + key + ' in session storage. From Json');
          return result;
        } else if (lookup && !isObj) {
          $log.debug('Found ' + key + ' in session storage.');
          var result = lookup;
          return result;
        } else {
          $log.debug('Cannot find item in session storage.');
        }

      },
      set: function (key, value, isObj) {

        if (isObj) {
          var result = angular.toJson(value);
          $window.sessionStorage.setItem(key, result);
          this.setLoggedIn(true);
          $log.debug('Set Key: ' + key + ' with value: ' + result + ' in session storage. Converted to Json');
        } else {
          $window.sessionStorage.setItem(key, value);
          this.setLoggedIn(true);
          $log.debug('Set Key: ' + key + ' with value: ' + value + ' in session storage.');
        }

      },
      remove: function (key) {
        $window.sessionStorage.removeItem(key);
        $log.debug('Removed Key: ' + key + ' from session storage.');
      },
      list: function () {
        $log.debug('Session Storage (key,Value) Dump',$window.sessionStorage);
      },
      clear: function () {
        $window.sessionStorage.clear();
        loggedIn = false;
        $log.debug('Session Storage Empty');
      },
      isLoggedIn: function(){
        return loggedIn;
      },
      setLoggedIn: function(status){
        loggedIn = status;
      }
    };
  }

  angular.module('erpClient').factory('SessionStore', SessionStorageFactory);

}());
