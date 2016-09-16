(function () {
  'use strict';
  function AppController($scope, $rootScope, $ionicModal, $ionicPopup, $cordovaDevice, $timeout, $state, $log, LoginSvc, PushSrvc, SessionStore) {

    var vm = this;

    vm.login = login;
    vm.logout = logout;
    vm.doLogin = doLogin;
    vm.closeLogin = closeLogin;
    vm.gotoState = gotoState;
    vm.conveneTeam = conveneTeam;
    $rootScope.loader = {};
    $rootScope.loader.loading = true;
    vm.isAuthenticated = false;

//    vm.navImg = '<img src="./img/usa_jet_logo.png" class="title-image" />';

    $scope.$watch(function () {
      return $rootScope.isAuthenticated;
    }, function (newVal) {
      vm.isAuthenticated = $rootScope.isAuthenticated;
    });

    // Form data for the login modal
    vm.loginData = {};

    // Triggered in the login modal to close it
    function closeLogin() {
      $scope.loginModal.hide();
    }

    //set the modal
    function login() {
      // $rootScope.loader.loading = false;
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        // document.getElementById('overlay').style.display = 'none';
        // $rootScope.loader.loading = false;
        $scope.loginModal = modal;
        showLogin();
      });
    }

    // Open the login modal
    function showLogin() {
      $scope.loginModal.show();
    }

    function logout() {
      LoginSvc.logout();
      login();
    }

    // Perform the login action when the user submits the login form
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

    function gotoState(state) {
      $state.go(state);
    }

    function conveneTeam() {
      console.log('convening team');
      // PushSrvc.send([], 'Please Report to Headquarters',true);
    }

    // $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {console.log('not authenticated anymore');
    //   logout();
    //   var alertPopup = $ionicPopup.alert({
    //     title: 'Session Lost!',
    //     template: 'Please login again.'
    //   });
    //   $state.go('app.login',{},{reload: true});
    // });


    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.loginModal.remove();
    });

    $scope.$on('authenticated', function () {
      $log.debug('authenticated');
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

    function init() {
      if (vm.isAuthenticated === false) {
        login();
      }

      else if (vm.isAuthenticated === true){
        $state.go('app.tabs.home');
      }
    }

    init();

    }
  // });

  angular.module('erpClient'/*, [{name:'login',file:['../services/LoginService.js']}]*/).controller('AppCtrl', AppController);
// });
})();
