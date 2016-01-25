'use strict';
const change = require('./change_state')();

module.exports = function(request) {
  return {
    name: "Member",
    joinIntent: function(request) {
      change.setUserState(request.From, 'member');
      change.setUserTeam(request.From, 
        request.Body.trim().toLowerCase().replace('join','').trim());
      return 'Sure thing. I have switched you to the '
        + request.Body.trim().toLowerCase().replace('join','').trim()
        + ' team. If you are ready to start elections, type ELECT.';
    },
    campaignStartIntent: function(request) {
      return 'Tis already underway, guvnah!';
    },
    changeNameIntent: function(request) {
      change.setUserName(request.From, '');
      return 'Of course. What would you like to be called?';
    },
    resetIntent: function(request) {
      change.resetElections(request.From);
      return 'Cancelling Elections';
    }
  };
};