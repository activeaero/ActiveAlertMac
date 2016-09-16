(function (){
  'use strict';

  function ProfileController ($rootScope, $state, $log, $ionicPopup, UsersSrvc, SessionStore){

    var vm = this;
    var userData = vm.user = SessionStore.get('user', true);
    // vm.user = {};
    vm.getRoles = getRoles();

    (function init(){
      if(!vm.user) {
        getProfile();
      }

      getRoles();
    })();

    function getProfile(){
        UsersSrvc.getUser(userData).then(function (result) {
            vm.user = result.data[0];
            $log.debug('contacts returned', vm.user);
          },
          function (error) {
            console.debug('error', error);

        });
    }

    /*****ROLES*****/
    function getRoles() {
      UsersSrvc.getRoles(userData.CompanyId).then(function(result) {
        vm.roles = result.data;
        $log.debug('Roles', vm.roles);
      });
    }

    vm.updateRole = function(){
      UsersSrvc.updateRole(vm.role).then(function(result){
        console.log('role updated',result);
      },function(error){
        console.debug('role update error',error);
      });
    };

    vm.updateUser = function(user){
      UsersSrvc.editUser(user).then(function(result){
        var alertPopup = $ionicPopup.alert({
            title: '',
            template: 'Profile Updated'
        });
      });
    }

  }

  angular.module('erpClient').controller('ProfileCtrl', ProfileController);

})();
