(function() {
    'use strict';
  // define(['angularAMD'], function(angularAMD){
  // define(['app'], function (app){
  //   app_cached_providers
  //     angularAMD.factory('sessionInterceptor', function SessionInterceptor ($log, $window, $rootScope, AUTH_EVENTS) {

      function SessionInterceptor ($log, $window, $rootScope, AUTH_EVENTS) {
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
              $log.debug('Set Key: ' + key + ' with value: ' + result + ' in session storage. Converted to Json');
            } else {
              $window.sessionStorage.setItem(key, value);
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
            $log.debug('Session Storage Empty');
          }
        };
      }
// });
// });

  angular.module('erpClient')
    .factory('sessionInterceptor', SessionInterceptor);

}());
// $rootScope.$broadcast({
//   401: AUTH_EVENTS.notAuthenticated/*,
//    403: AUTH_EVENTS.notAuthorized*/
// }[res.status], res);
// return res;
