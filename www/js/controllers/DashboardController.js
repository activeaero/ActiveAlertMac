(function (){
	'use strict';

	function DashboardController($rootScope, $state, $log, $ionicPopup, SessionStore, PushSrvc, DashboardSrvc, TaskSrvc, socket){
		var vm = this;

    vm.shownGroup = {};
    vm.taskReturn = [];
    vm.taskList = [];
    vm.message = [];
    vm.openIncidents = [];
    vm.showAck = false;

		vm.acknowledge = acknowledge;
    vm.defer = defer;
    vm.clearIncidentList = clearIncidentList;
    vm.gotoState = gotoState;

		function init() {
      vm.userData = SessionStore.get('user', true);
      if(vm.userData){
        $rootScope.user = vm.userData;
        getOpenIncidents();
      }

      else{
        $state.go('app.login');
      }
      //vm.isAuthenticated = vm.userData ? true : false;
// vm.incidentList = SessionStore.get('incidentList', true);
      /*If the incidentId is set, that means we have initiated the controller through push notification.  We are in the app.tabs.notification state.  Get the current incident and list it.

       If the incidentId is not set, then we entered through just opening the app.  In that case, get all of the open incidents.  We are now in the app.tabs.home state.
       */
      // if($rootScope.IncidentId){
      //   vm.newIncidentId = $rootScope.incidentId;
      //   var param = {
      //     IncidentId: parseInt($rootScope.IncidentId),
      //     CompanyId: vm.userData.CompanyId || parseInt(1)
      //   };
      //   getCurrentIncident(vm.userData.CompanyId || parseInt(1));
      //
      //   DashboardSrvc.getAcknowledgementWithIncidentId({'IncidentId':$rootScope.IncidentId, 'CompanyId':vm.userData.CompanyId})
      //     .then(function(result){
      //       vm.showAck = true;
      //       console.log('result w',result.data);
      //     }, function(error){
      //       console.debug('error',error);
      //     });
      // }
      //
      // else{
      //   // getOpenIncidents(vm.userData.CompanyId || parseInt(1));
      //   DashboardSrvc.getAcknowledgementWithoutIncidentId({'UserId':vm.userData.UserId, 'CompanyId':vm.userData.CompanyId})
      //     .then(function(result){
      //       var highest = 0;
      //       var target = {};
      //       _.forEach(result.data, function(val,key){
      //         if(parseInt(val.IncidentId) > highest){
      //           highest = parseInt(val.IncidentId);
      //           target = val;
      //         }
      //       });
      //
      //       console.log('this is target',target.Note);
      //       if((target.Note !== 'Acknowledged') || (target.Note !== 'defer')){
      //         // if(_.find(target, function(o) { return o.Note === 'Acknowledged' || o.Note === 'defer'; })) {
      //         vm.showAck = true;
      //         console.log('result w/o', target);
      //       }
      //
      //       else{
      //         getCurrentIncident(vm.userData.CompanyId);
      //       }
      //   }, function(error){
      //     console.debug('error',error);
      //   });
      // }
    }

    function createTaskList(){
      _.forEach(vm.incidentList, function(val,key) {
        var incidentInfo = _.last(val.incident);
        var params = { CategoryId:incidentInfo.categoryId, RoleId: vm.userData.RoleId };
        TaskSrvc.getTasksByRole(params).then(function(data){
          vm.taskReturn.push(data.data);
          vm.taskList = _.flattenDeep(vm.taskReturn);
        });
      });
    }

    function getCurrentIncident(id){
      var catName = '';
      vm.message = [];
        DashboardSrvc.getCurrentIncident(id).then(function(data){
          var list = angular.fromJson(data.data[0].IncidentList);
          $log.debug('list returned',list);
          vm.incidentDate = new Date(data.data[0].IncidentDate);

          _.forEach(list, function(val,key){
            _.forEach(val, function(val1,key1){
              if(key1 === 'incident'){
                if (val1.length === 1){
                  vm.message.push({categoryName: val1[0].categoryName, cssClass: val1[0].cssClass, cssIcon: val1[0].cssIcon});
                }

                else if(val1.length > 1){
                  _.forEach(val1, function(val2,key2){
                    console.log('dsfsdfsdwewe', val2);
                    catName += ' ' + val2.categoryName;
                  });
                  vm.message.push({categoryName: catName, cssClass: val1[0].cssClass, cssIcon: val1[0].cssIcon});
                  catName = '';

                }
              }
            });
          });

        },function(error){
          $log.debug('Incident pull',error);
        });
    }

    function getOpenIncidents(){
      var catName = '';
      DashboardSrvc.getAcknowledgementWithoutIncidentId({'UserId':vm.userData.UserId, 'CompanyId':vm.userData.CompanyId}).then(function(data){
        if(!_.isEmpty(data.data)) {
          vm.incidents = _.flattenDeep(data.data);
          console.log('these incidents', JSON.stringify(vm.incidents));
          _.forEach(vm.incidents, function (val, key) {
            val.IncidentDate = new Date(val.IncidentDate);
            DashboardSrvc.getCategoryByParentId(parseInt(_.head(val.CategoryList))).then(function (result) {
              val['cssIcon'] = result.data[0].css_icon;
              val['cssClass'] = result.data[0].css_class;
              val['CategoryName'] = result.data[0].CategoryName;
            });
          });
          var list = angular.fromJson(data.data[0].IncidentList);
          $log.debug('list returned', JSON.stringify(list));
          vm.incidentDate = new Date(data.data[0].IncidentDate);

          _.forEach(list, function (val, key) {
            _.forEach(val, function (val1, key1) {
              if (key1 === 'incident') {
                if (val1.length === 1) {
                  vm.openIncidents.push({
                    categoryName: val1[0].categoryName,
                    cssClass: val1[0].cssClass,
                    cssIcon: val1[0].cssIcon
                  });
                }

                else if (val1.length > 1) {
                  _.forEach(val1, function (val2, key2) {
                    catName += ' ' + val2.categoryName;
                  });
                  vm.openIncidents.push({categoryName: catName, cssClass: val1[0].cssClass, cssIcon: val1[0].cssIcon});
                  catName = '';

                }
              }
            });
          });
        }
      },function(error){
        $log.debug('Incident pull',error);
      });


    }

    function clearIncidentList() {
      vm.incidentList = [];
      SessionStore.remove('incidentList');
    }

    function acknowledge() {
      var alertPopup2 = $ionicPopup.alert({
          title: 'Notification Acknowledged',
          template: '<div class="bg-danger"><p class="uppercase">Warning: While Responding to this event<br />' +
                    'Do not attempt to send emails/text messages or dial/talk on the telephone while driving without' +
                    ' using a hands-free device.<br />Do NOT Speak about this event with anyone that does not have an operational need to know. </p></div>',
          okText: 'Proceed to Tasks'
        });
        alertPopup2.then(function(res) {
          pushMessage('Acknowledged');
          $state.go('app.tabs.tasks');
        });
    }

    function defer() {
      var alertPopup = $ionicPopup.alert({
        title: 'Notification Deferred to Alternate'
      });
      alertPopup.then(function(res) {
        pushMessage('Deferred');
        alertPopup.close();
      });
    }

    function gotoState(state){
      $state.go(state);
    }

    function pushMessage (message) {
      var timeStamp = moment();
      var obj = {user: vm.userData.name, msgDate: timeStamp, content: message, note: message, incidentId: 16, userId: vm.userData.UserId, contactId: vm.userData.ContactId, positionId: vm.userData.PositionId};

      // vm.eventLog.push(obj);
      SessionStore.set('response', vm.eventLog, true);
      PushSrvc.addEvent(obj).then(function(resp){
        // $http(req).then(function(resp){
        // Handle success
        $log.debug("Event added to log", angular.toJson(resp));
      },function(err){
        console.log('error adding to log',err)
      });
      // socket.emit('SendNotification', { message: obj });
    }

    socket.on('SendNotification', function (data) {
      var obj = data.message;
      vm.eventLog.push(obj);
      SessionStore.set('response', vm.eventLog, true);
      PushSrvc.addEvent(vm.eventLog).then(function(resp){
        // $http(req).then(function(resp){
        // Handle success
        $log.debug("Event added to log", angular.toJson(resp));
      },function(err){
        console.log('error adding to log',err)
      });
      $log.debug('socket data', obj);
    });


    socket.on('connect', function(data) {
      if ( angular.isDefined(vm.incidentList) ) {
        socket.emit('incident', vm.incidentList);
      } else {
        vm.incidentList = $rootScope.incidentList = data;

        $log.debug('socket incident data', data);
      }
    });

    init();
    //$rootScope.$on('$stateChangeSuccess',
    //  function(event, toState, toParams, fromState, fromParams) {
    //    vm.incidentList = SessionStore.get('incidentList', true);
    //  });
	}

	angular.module('erpClient').controller('DashboardCtrl', DashboardController);


})();
