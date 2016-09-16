(function() {
    'use strict';

    function SocketFactory (socketFactory) {
      var IoSocket = io.connect('http://api2.activeaero.com:8001');
      return socketFactory({
        ioSocket: IoSocket
      });
    }

  angular.module('erpClient')
    .factory('socket', SocketFactory);

}());
