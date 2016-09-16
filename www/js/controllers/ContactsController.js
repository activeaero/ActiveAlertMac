(function (){
  'use strict';

  function ContactsController ($log, $cordovaSms, ContactsSrvc, SessionStore){

    var vm = this;
    vm.contacts = [];

    vm.sendSms = sendSms;

    function init(){
      vm.userData = SessionStore.get('user', true);

      getContacts();
    }

    init();

    function getContacts(){

      ContactsSrvc.getContacts(vm.userData.CompanyId).then(function(result){$log.debug('this is contact',result.data);
       // vm.contacts = result.data;
        _.forEach(_.flatten(result.data), function(val,key){
          if(val.Archived == 0){
            vm.contacts.push(val);
          }
        });
        $log.debug('contacts',vm.contacts);
      },
       function(error){
         console.debug('error',error);

      });

      // ContactsSrvc.getContacts(vm.userData.CompanyId).then(function(result) {
      //     vm.contacts = _.filter(result.data, function(value){
      //       if((value.Company !== null) && (value.FirstName === null) && (value.LastName === null)){
      //         return value;
      //       }
      //
      //     });
      //     $log.debug('Contacts', vm.contacts);
      //   });
      //

    }

    var indexedContacts = [];

    vm.contactsToFilter = function() {
      indexedContacts = [];
      return vm.contacts;
    };

    vm.filterContacts = function(contact) {
      var contactIsNew = indexedContacts.indexOf(contact.Company) == -1;
      if (contactIsNew) {
        indexedContacts.push(contact.Company);
      }
      return contactIsNew;
    };

    function sendSms(phoneNum){
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT'  // send SMS with the native android SMS messaging
          //intent: '' // send SMS without open any other app
        }
      };

      $cordovaSms
        .send(phoneNum, '', options)
        .then(function() {
          // Success! SMS was sent
          console.log('sms sent!');
        }, function(error) {
          // An error occurred
          console.debug('sms not sent',error);
        });
    }

  }

  angular.module('erpClient').controller('ContactsCtrl', ContactsController);

})();
