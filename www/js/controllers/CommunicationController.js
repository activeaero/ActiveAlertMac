(function (){
  'use strict';
  //TODO: Add activity stream style logic here from EventLogSrvc
  function CommunicationController(SessionStore, socket, $log) {
    var vm = this;
    var msg = {};
    vm.eventLog = [];
    vm.logHistory = SessionStore.get('communication', true);
    if (angular.isDefined(vm.logHistory)) {
      vm.eventLog = vm.logHistory;
      angular.forEach(vm.eventLog, function(msg){
        msg.message.content.substring(0,10) === 'data:image' ? msg.image = true : msg.image = false;console.log('objmsg session',msg.message.content.substring(0,10),msg.image);
      });
      $log.debug(vm.eventLog);
    }
    vm.userData = SessionStore.get('user', true);
    //vm.userData.initials = function () {
    //var firstName = vm.userData.first_name.charAt(0);
    //var lastName = vm.userData.last_name.charAt(0);

    //return firstName+lastName;
    //};


    vm.pushMessage = function (message) {
      var timeStamp = new Date();
      var obj = {user: vm.userData.name, msgDate: timeStamp, content: message};
      socket.emit('LogUpdated', { message: obj });
      $log.debug('obj sent', obj);
    };

    socket.on('UpdateLog', function (data) {
      var obj = data.message;console.log('objmsg',obj.message.content);
      obj.message.content.substring(0,10) === 'data:image' ? obj.image = true : obj.image = false;
      vm.eventLog.push(obj);
      SessionStore.set('communication', vm.eventLog, true);
      $log.debug('socket data', vm.eventLog);
    });

    vm.incidentList = SessionStore.get('incidentList', true);

    socket.on('connect', function(data) {
      if ( angular.isDefined(vm.incidentList) ) {
        socket.emit('incident', vm.incidentList);
      } else {
        vm.incidentList = data;
        $log.debug('socket incident data', data);
      }
    });


    $log.debug(vm.incidentList);

  }

  angular.module('erpClient').controller('CommunicationCtrl', CommunicationController);

})();

