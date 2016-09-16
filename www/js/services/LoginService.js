(function() {
  'use strict';

  function LoginService ($http, $q, $rootScope, $state, $log, $ionicPopup, DSP_URL, SessionStore) {

    var svc = this;

    return {
      session: function () {
        return userData;
      },

      initiate: function (options) {
        var deferred = $q.defer();

        var payload = {
          "params": [
            {
              "name": "UserName",
              "param_type": "IN",
              "value": options.email
            },
            {
              "name": "Password",
              "param_type": "IN",
              "value": options.password
            },
            {
              "name": "DeviceId",
              "param_type": "IN",
              "value": null
            }
          ]
        };

        var optns = {
          email: options.email,
          password: options.password
        };

        $http.post(DSP_URL + '/api/v2/user/session/', optns)
          .then(function (result) {$log.debug('UMMMM',result);
            var sessionData = result.data;
            return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$User$Login', payload).then(function(response) {
              $log.debug('SQL Login Response: ', response.data[0], response);
              _.merge(sessionData, response.data[0]);
              SessionStore.set('user', sessionData, true);
              //     $rootScope.userData = sessionData;
              //     $rootScope.isAuthenticated = true;
                  $rootScope.$broadcast('authenticated');
              //     // $state.go('app.tabs.home');
              deferred.resolve(sessionData);
            }, function(error){
              return deferred.reject(error);
            });
          }, function(error){
            return deferred.reject(error);
          });

        return deferred.promise;
      },

      logout: function () {
        $http.delete(DSP_URL + '/api/v2/user/session')
          .then(function (response) {
            $log.debug('Logout Session Response', response);
            $http.defaults.headers.common['X-DreamFactory-Session-Token'] = null;
            SessionStore.clear();
            if ($state.current.name !== 'app.login') {
              $state.go('app.login',{});
            }
          });

      }
    };

  }

  angular.module('erpClient').service('LoginSvc', LoginService);

}());
