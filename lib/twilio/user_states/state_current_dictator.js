'use strict';
const change = require('./change_state')();

module.exports = function(request) {
  return {
    name: "Member",
    joinIntent: function(request) {
      change.setUserState(request.From, 'member');
      change.setUserTeam(request.From, 
        request.Body.trim().toLowerCase().replace('join','').trim());
      return 'You have defected to the '
        + request.Body.trim().toLowerCase().replace('join','').trim()
        + ' team! Your people will be so disappointed.';
    },
    campaignStartIntent: function(request) {
      return 'You have already won! You may start a new election cycle later.';
    },
    changeNameIntent: function(request) {
      change.setUserName(request.From, '');
      return 'It is not good to change your name after the people elected you. '
        + 'Maybe you should STEP DOWN, or just RESET the vote';
    },
    resetIntent: function(request) {
      change.resetElections(request.From);
      return 'You have been ousted from your seat! The people will '
        + 'choose a new leader next time.'
    }
  };
};