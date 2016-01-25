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
      change.setTeamState(request.From, 'campaign');
      change.setUserState(request.From, 'running');
      return 'ELECTIONS have begun! Viva la proletariat!';
    },
    changeNameIntent: function(request) {
      change.setUserName(request.From, '');
      return 'Of course. What would you like to be called?';
    },
    resetIntent: function(request) {
      change.resetElections(request.From);
      return 'Okie Dokie';
    },
    voteYesIntent: function(request) {
      change.setUserState(request.From, 'running');
      return 'You are in the running. Elections last 2 minutes, stay tuned for the results.';
    },
    voteNoIntent: function(request) {
      return 'Okie Dokie. Maybe next time.'
    },
    karmaUpIntent: function(request) {
      return 'Thanks but we aren\'t keeping track of Karma, not just yet...';
    },
    karmaDownIntent: function(request) {
      return 'Oh dear, sorry you had a bad time, but we aren\'t tracking Karma just yet.';
    }
  };
};