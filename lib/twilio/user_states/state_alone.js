'use strict';
const change = require('./change_state')();

module.exports = function(request) {
  return {
    name: "Alone",
    otherIntent: function(request) {
      // We are assuming that the user has been asked to type his name
      return 'You have not joined any food teams yet. Type JOIN *team name* '
        + 'to join a team to choose a place to eat.';
    },
    joinIntent: function(request) {
      change.setUserState(request.From, 'member');
      change.setUserTeam(request.From, 
        request.Body.trim().toLowerCase().replace('join','').trim());
      return 'Thanks. You have joined the '
        + request.Body.trim().toLowerCase().replace('join','').trim()
        + ' team. If you are ready to start elections, type ELECT.';
    },
    campaignStartIntent: function(request) {
      return 'You don\'t even belong to a team yet. Type JOIN *team name* to '
        + 'join a team to choose a place to eat.';
    },
    changeNameIntent: function(request) {
      change.setUserName(request.From, '');
      return 'Of course. What would you like to be called?';
    }
  };
};