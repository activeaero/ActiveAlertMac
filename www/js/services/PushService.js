(function (){
  'use strict';

  function PushService($http, $rootScope, DSP_URL){
    var privateKey = 'f7c1546c903671cdf926ca22acd4b2d183d389710c03e17b';
    var access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNDU1M2NmNy02YjU4LTQyNjEtYTlhYi1hMTM0ODU4MzZjOTQifQ.vKEHVGUczPavwLYppG8ejWMhT1AMNoM1xBUFiZOP05w';
    //var tokens = [];
    var profile = "prod";
    var appId = 'b18a8fc5';
    // var sns = new AWS.SNS();

// Encode your key
    var auth = btoa(privateKey + ':');
    return{
      send: function(tokens,message,sendToAll){
        // Build the request object
        var req = {
            "tokens": tokens,
            "send_to_all": sendToAll,
            "profile": profile,
            "notification": {
              "title":"ActiveAlert Incident",
              "alert":message,
              "message":message,
              "priority":10,
              "ios":{
                "badge":1,
                "sound":"sound.wav",
                "contentAvailable": false/*,
                 "payload":{
                 "key1":"value",
                 "key2":"value"
                 }*/
              },
              "android":{
                "delayWhileIdle":true,
                "stack": 10,
                // "collapse_key": false,
                "delay_while_idle": false,
                "icon": "ionitron.png",
                "icon_color": "#0840F9"/*,
                 "payload":{
                 "key1":"value",
                 "key2":"value"
                 }*/
              }
            }
        };

        // Make the API call
        $http({
          method: 'POST',
          url: 'https://api.ionic.io/push/notifications',
          headers: {
            'Content-Type': 'application/json',
            'X-Ionic-Application-Id': undefined,
            // 'X-Ionic-Application-Id': appId,
            'Authorization': 'Bearer ' + access_token,
            'X-DreamFactory-Api-Key': undefined,
            'X-DreamFactory-Session-Token': undefined
          },
          // transformRequest: function(data, headersGetter) {
          //   var headers = headersGetter();
          //
          //   _.forEach(headers, function(val,key){
          //     if((key === 'X-DreamFactory-Api-Key' ) || (key === 'X-DreamFactory-Session-Token') || (key === 'x-dreamfactory-api-key' ) || (key === 'x-dreamfactory-session-token')) {
          //       delete headers[key];
          //     }
          //   });
          //
          //   return headers;
          // },
          data: req
        }).then(function(resp){
          // $http(req).then(function(resp){
          // Handle success
          console.log("Ionic Push: Push success!", angular.toJson(resp));
          $http({
            method: 'GET',
            url: 'https://api.ionic.io/push/notifications/'+resp.data.data.uuid,
            headers: {
              'Content-Type': 'application/json',
              'X-Ionic-Application-Id': undefined,
              // 'X-Ionic-Application-Id': appId,
              'Authorization': 'Bearer ' + access_token,
              'X-DreamFactory-Api-Key': undefined,
              'X-DreamFactory-Session-Token': undefined
            }
          }).then(function(data){
            console.log('successful push status',angular.toJson(data));
          },function(err){
            console.log('error push status',err)
          });
        },function(error){
          // Handle error
          console.log("Ionic Push: Push error...");
        });
      },
      createEndpoint: function(payload){
        // return $http.post('http://sns.us-west-2.amazonaws.com', payload);
        $http({
          method: 'POST',
          url: 'http://sns.us-west-2.amazonaws.com/',
          headers: {
            'Content-Type': 'application/json',
            'X-Ionic-Application-Id': undefined,
            // 'X-Ionic-Application-Id': appId,
            'X-DreamFactory-Api-Key': undefined,
            'X-DreamFactory-Session-Token': undefined
          },
          data: payload
        }).then(function(results){
          console.debug('endpoint created successfully', JSON.stringify(results));
        }, function(error){
          console.debug('endpoint creation failed', error);
        });
      },
      addEvent: function(event){
        var payload = {
          "params": [
            {
            "name": "PositionId",
            "param_type": "IN",
            "value": event.positionId || null
            },
            {
            "name": "IncidentId",
            "param_type": "IN",
            "value": event.incidentId
            },
            {
              "name": "ContactId",
              "param_type": "IN",
              "value": event.contactId || null
            },
            {
              "name": "Note",
              "param_type": "IN",
              "value": event.note || null
            },
            {
              "name": "LastModBy",
              "param_type": "IN",
              "value": event.userId || 1000
            }
          ]
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$EventLog$Add',payload);
      }

    };

  }

  angular.module('erpClient').service('PushSrvc', PushService);


})();
