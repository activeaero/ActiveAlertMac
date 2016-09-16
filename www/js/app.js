// USAJet ActiveAlert App
// define([], function(){
// define(['ionic',/*'angularAMD',*/'oc.lazyload','ui.bootstrap', 'ngCordova', 'btford.socket-io'], function(/*angularAMD*/){
//   'use strict';
// var app_cached_providers = {};
  var app = angular.module('erpClient', ['ionic','oc.lazyLoad', 'ui.bootstrap', 'ngCordova', 'btford.socket-io']);

app.run(function($ionicPlatform, $cordovaDevice, $rootScope, $cordovaPush, $cordovaToast, $state, $http, SENDERID, PushSrvc, SessionStore) {


    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)S
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }


       var push = new Ionic.Push({
         "onNotification": function(notification) {
           var payload = notification.payload;
           console.log('in on', angular.toJson(notification), payload, notification._raw.message);
           $rootScope.IncidentId = payload.incidentId;
           $rootScope.message = notification._raw.message;
           // SessionStore.set('message',$rootScope.message, true);
           $state.go('app.tabs.home');
           // $state.go('app.notification');
         },

        "debug": true
      });

      push.register(function(token) {
        console.debug("Device token:",token.token);
        $rootScope.deviceToken = token.token;
        push.saveToken(token);
      });

  var user = SessionStore.get('user',true);

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if ((angular.isUndefined($http.defaults.headers.common['X-DreamFactory-Session-Token'])) && (user)) {
      $http.defaults.headers.common['X-DreamFactory-Session-Token'] = user.session_token;
    }
    //
    //   if (!$rootScope.isAuthenticated){console.log('in if',toState.name,toState, $rootScope.isAuthenticated);
    //     event.preventDefault();
    //     // $state.transitionTo("login");
    //     LoginSvc.logout();
    //   }
    if (/*(toState.name !== 'app.login') && */(angular.isUndefined($http.defaults.headers.common['X-DreamFactory-Session-Token'])) && (SessionStore.isLoggedIn() === false)) {
      console.debug('islogged in', SessionStore.isLoggedIn(), 'to state', toState.name, 'header',$http.defaults.headers.common['X-DreamFactory-Session-Token']);
      event.preventDefault();
      // $state.transitionTo('app.login');
      LoginSvc.logout();
    }

    // else{// if(SessionStore.isLoggedIn() === true){
    //   $log.debug('****************LOGGED IN BUT OUT****************',SessionStore.isLoggedIn(),$http.defaults.headers.common['X-DreamFactory-Session-Token']);
    // }

  });
    });

});
app.constant('SENDERID', '215914933648');
app.constant('DSP_URL', 'https://api2.activeaero.com');
app.constant('DSP_API_KEY', 'aac1e7fdf7db12e011f4899bb00713eed37e6b281e34296360c9b21b84c69253');
app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.config(['$httpProvider', 'DSP_API_KEY', function($httpProvider, DSP_API_KEY) {
  $httpProvider.defaults.headers.common['X-DreamFactory-Api-Key'] = DSP_API_KEY;
  $httpProvider.interceptors.push('sessionInterceptor');
}]);
// app.config(['$controllerProvider', function(controllerProvider){
//       app_cached_providers.$controllerProvider = controllerProvider;
//     }]);
app.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    controllerAs: 'ctrl',
    // resolve: {
    //     loadAppCtrl: ["$q", function($q) {
    //       var deferred = $q.defer();
    //       require(["AppCtrl"], function() { deferred.resolve(); });
    //       return deferred.promise;
    //     }]
    // }
    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load(['js/controllers/AppController.js','js/services/LoginService.js','js/services/PushService.js','js/factories/SessionStorageFactory.js']);
      }]
    }
  })

  .state('app.login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'ctrl'
    })
/*  .state('app.logout', {
    url: '/logout',
    templateUrl: 'templates/logout.html',
    controller: 'LogoutCtrl'
  })*/

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent':{
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'ctrl'
      }
    },
    resolve: {
      // loadProfileCtrl: ["$q", function($q) {
      //   var deferred = $q.defer();
      //   require(["ProfileCtrl"], function() { deferred.resolve(); });
      //   return deferred.promise;
      // }]
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load(['js/controllers/ProfileController.js','js/services/UsersService.js']);
      }]
    }
  })

  .state('app.tabs', {
    url: '/tab',
    views: {
      'menuContent':{
         templateUrl: 'templates/tabs.html'
      }
    }

  })

  .state('app.tabs.tasks', {
    url: '/tasks',
    views:{
      'home-tab': {
        templateUrl: 'templates/tasks.html',
        controller: 'TasksCtrl',
        controllerAs: 'ctrl'
      }
    },
    resolve: {
      // loadTasksCtrl: ["$q", function($q) {
      //   var deferred = $q.defer();
      //   require(["TasksCtrl"], function() { deferred.resolve(); });
      //   return deferred.promise;
      // }]
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load(['js/controllers/TasksController.js','js/services/TasksService.js']);
      }]
    }
  })

  .state('app.tabs.detail', {
    url: '/tasks/:id',
    views:{
      'home-tab': {
        templateUrl: './templates/taskDetail.html',
        controller: 'TaskCtrl',
        controllerAs: 'ctrl'
      }
    },
    params: { tasks: null },
    resolve: {
      // loadTaskCtrl: ["$q", function($q) {
      //   var deferred = $q.defer();
      //   require(["TaskCtrl"], function() { deferred.resolve(); });
      //   return deferred.promise;
      // }]
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load(['js/controllers/TaskController.js','js/services/TaskService.js','js/factories/SessionStorageFactory.js']);
      }]
    }
  })

    //.state('app.taskContacts',{
    //  url:'/tasks/:id/contacts/:task',
    //  views:{
    //    'menuContent':{
    //      templateUrl: './templates/taskContacts.html',
    //      controller: 'TaskCtrl',
    //      controllerAs: 'ctrl'
    //    }
    //  }
    //})

    .state('app.tabs.contacts', {
    url: '/contacts',
    //abstract: true,
    views:{
      'contacts-tab': {
      //'menuContent': {
        templateUrl: 'templates/contacts.html',
        controller: 'ContactsCtrl',
        controllerAs: 'ctrl'
      }
    },
      resolve: {
        // loadContactsCtrl: ["$q", function($q) {
        //   var deferred = $q.defer();
        //   require(["ContactsCtrl"], function() { deferred.resolve(); });
        //   return deferred.promise;
        // }]
        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load(['js/controllers/ContactsController.js','js/services/DashboardService.js','js/services/ContactsService.js']);
        }]
      }
  })

    .state('app.tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'DashboardCtrl',
          controllerAs: 'ctrl'
        }
      },
      resolve: {
        // loadDashboardCtrl: ["$q", function($q) {
        //   var deferred = $q.defer();
        //   require(["DashboardCtrl"], function() { deferred.resolve(); });
        //   return deferred.promise;
        // }]
        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load(['js/controllers/DashboardController.js','js/services/DashboardService.js','js/services/TaskService.js','js/factories/SocketFactory.js']);
        }]
      }
    })

    .state('app.tabs.camera', {
      url: '/camera',
      views: {
        'camera-tab': {
          templateUrl: 'templates/camera.html',
          controller: 'CameraCtrl',
          controllerAs: 'ctrl'
        }
      },
      resolve: {
        // loadCameraCtrl: ["$q", function($q) {
        //   var deferred = $q.defer();
        //   require(["CameraCtrl"], function() { deferred.resolve(); });
        //   return deferred.promise;
        // }]
        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load(['js/controllers/CameraController.js','js/services/DashboardService.js','js/services/CameraService.js','js/factories/SocketFactory.js']);
        }]
      }
    })
    .state('app.tabs.communication', {
      url: '/communication',
      views: {
        'communication-tab': {
          templateUrl: 'templates/communication.html',
          controller: 'CommunicationCtrl',
          controllerAs: 'ctrl'
        }
      },
      resolve: {
        // loadCommunicationCtrl: ["$q", function($q) {
        //   var deferred = $q.defer();
        //   require(["CommunicationCtrl"], function() { deferred.resolve(); });
        //   return deferred.promise;
        // }]
        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load(['js/controllers/CommunicationController.js','js/factories/SocketFactory.js']);
        }]
      }
    });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/home');
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get('$state');
    $state.go('app.tabs.home');
  });
}]);
