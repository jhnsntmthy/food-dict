'use strict';
const change = require('./change_state')();

module.exports = function(request) {
  return {
    name: "No Account",
    otherIntent: function(request) {
      console.log("inside no_account.otherIntent");
      change.createUser(request.From, '');
      return 'Welcome to the Food Dictatorship. Please tell me your name:';
    },
    joinIntent: function(request) {
      console.log("inside no_account.joinIntent");
      change.createUser(request.From, '');
      change.setUserState(request.From, 'member');
      change.setUserTeam(request.From, 
        request.Body.trim().toLowerCase().replace('join','').trim());
      return 'Welcome to the Food Dicatorship. You have joined the '
        + request.Body.trim().toLowerCase().replace('join','').trim()
        + ' team. Please tell me your name.';
    },
    campaignStartIntent: function(request) {
      change.createUser(request.From, '');
      return 'Who are you? Please tell me your name.';
    },
    changeNameIntent: function(request) {
      change.setUserName(request.From, '');
      return 'Of course. What would you like to be called?';
    }
  };
};