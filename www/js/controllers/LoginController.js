(function (){

	'use strict';

	function LoginController($scope, $rootScope, $ionicModal, $state, $timeout, $log, LoginSvc, SessionStore) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //vm.$on('$ionicView.enter', function(e) {
  //});

    var vm = this;

    vm.loginData = {};

    vm.userData = SessionStore.get('user',true);
    vm.doLogin = doLogin;
    vm.login = login;
    vm.closeLogin = closeLogin;

    function init(){
      //init();
      // Form data for the login modal
    }

    // Create the login modal that we will use later
    // $ionicModal.fromTemplateUrl('templates/login.html', {
    //   scope: $scope,
    //   animation: 'slide-in-up'
    // }).then(function(modal) {console.log('im in login modal');
    //   $scope.loginModal = modal;
    // });

    // Triggered in the login modal to close it
    function closeLogin() {
      $scope.loginModal.hide();
    }

    // Open the login modal
    function login() {console.log('open');
      $scope.loginModal.show();
    }

    $scope.logout = function () {
      LoginSvc.logout();
    };

    // Perform the login action when the user submits the login form
    // function doLogin() {
    //   LoginSvc.initiate({
    //     email: vm.loginData.username,
    //     password: vm.loginData.password,
    //     deviceId: $rootScope.deviceToken
    //   }).then(function (result) {
    //     //$rootScope.isLoggedIn = true;
    //     vm.userData = result.data || SessionStore.get('user', true);
    //     vm.isAuthenticated = $rootScope.isAuthenticated = vm.userData ? true : false;
    //     if (vm.isAuthenticated) {
    //       $rootScope.$broadcast('authenticated');
    //       $log.debug('User Authenticated', vm.userData);
    //       closeLogin();
    //     }
    //   }, function(error){
    //     var alertPopup = $ionicPopup.alert({
    //       title: 'Login Failed ' + JSON.stringify(error),
    //       template: 'Please re-enter credentials!'
    //     });
    //   });
    // }
    function doLogin() {
      LoginSvc.initiate({
        email: vm.loginData.username,
        password: vm.loginData.password,
        deviceId: $rootScope.deviceToken
      }).then(function (result) {
        vm.userData = result;
        $log.debug('***RESULT***',vm.userData);
        closeLogin();
        // $state.go('app.tabs.home');
        // $rootScope.$broadcast('authsenticated');
        //   var validUser = '';
        //   if(result.id !== undefined){
        //     validUser = true;
        //   }
        //
        //   else{
        //     validUser = false;
        //   }
        //
        //
        //   //$rootScope.isLoggedIn = true;
        //   vm.userData = result.data || SessionStore.get('user', true);
        //   // vm.isAuthenticated = $rootScope.isAuthenticated = vm.userData ? true : false;
        //   if (vm.userData) {
        //     $rootScope.$broadcast('authenticated');
        //     // $log.debug('User Authenticated', vm.userData);
        //     closeLogin();
        //     // $state.go('app.tabs.home');
        //   }
        //
        //   else{
        //     var alertPopup = $ionicPopup.alert({
        //       title: 'Login Failed',
        //       template: 'Invalid Credentials Supplied. <br /> Please re-enter credentials!'
        //     });
        //   }
        // }, function(error){$log.debug('login error',error);
        //   var alertPopup = $ionicPopup.alert({
        //     title: 'Login Failed',
        //     template: error.data.error.message + ' Please re-enter credentials!'
        //   });


        // vm.isAuthenticated = vm.userData ? true : false;
        $log.debug('authenticated',SessionStore.isLoggedIn(), $state);
        // if (SessionStore.isLoggedIn()) {
        //   $rootScope.$broadcast('authenticated');
        //   $log.debug('User Authenticated', vm.userData);
        //   $state.go('app.tabs.home');
        // }
      }, function(error){
        $log.debug('returned error promise', error);
        var alertPopup = $ionicPopup.alert({
          title: 'Login Error',
          template: error.data.error.message +  ' Please Try To Login Again.'
        });

        alertPopup.then(function(result){
          vm.loginData.username = null;
          vm.loginData.password = null;
        });
      });
    }

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.loginModal.remove();
    });

    // $scope.$on('authenticated', function(){$log.debug('authenticated');
    //   vm.loginData.username = null;
    //   vm.loginData.password = null;
    //   closeLogin();
    //   $state.go('app.tabs.home', {}, {reload: true});
    // });

    $scope.$on('authenticated', function () {
      $log.debug('authenticated');
      vm.loginData.username = null;
      vm.loginData.password = null;
      // closeLogin();
      vm.isAuthenticated = true;
      $log.debug('current state',$state.current);
      if($state.current.name === 'app.login'){
        $state.go('app.tabs.home', {}, {reload: true});
      }

      else{
        $state.reload();
      }
      // $state.go($state.current.name, {}, {reload: true})
    });
	}

	angular.module('erpClient').controller('LoginCtrl', LoginController);

})();
