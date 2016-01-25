'use strict';
const change = require('./change_state')();

module.exports = function(request) {
  return {
    name: "Account No Name",
    otherIntent: function(request) {
      change.setUserName(request.From, request.Body);
      return 'Thanks! I will call you '+request.Body+' from now on. '
        + 'Type CHANGE NAME to change it again. Or start an election '
        + 'by typing JOIN *team name* to join a team.';
    },
    joinIntent: function(request) {
      change.setUserState(request.From, 'member');
      change.setUserTeam(request.From, 
        request.Body.trim().toLowerCase().replace('join','').trim());
      return 'Welcome to the Food Dicatorship. You have joined the '
        + request.Body.trim().toLowerCase().replace('join','').trim()
        + ' team. Please tell me your name.';
    },
    campaignStartIntent: function(request) {
      return 'I don\'t know your name yet. Please tell me your name.';
    },
    changeNameIntent: function(request) {
      change.setUserName(request.From, '');
      return 'Of course. What would you like to be called?';
    }
  };
};