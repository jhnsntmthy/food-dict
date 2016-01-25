'use strict';
const firebase = require('firebase');
const DB = require('../../firebase/db');

// fetch all the state-specific objects
const no_account = require('./state_no_account');
const account_no_name = require('./state_account_no_name');
const alone = require('./state_alone');
const member_team = require('./state_member_team');
const running_for_dictator = require('./state_running_for_dictator');
const current_dictator = require('./state_current_dictator');

module.exports = function(request, callback) {

  // find out if the user exists, which state he is in
  DB.child('users/'+request.From.split('+')[1]).once('value', function(snapshot){
    var state = null;
    if (snapshot.val() === null) {
      state = no_account;
    } else if (snapshot.val().name.trim() == '') {
      state = account_no_name;
    } else if (snapshot.val().state.trim() === 'alone') {
      state = alone;
    } else if (snapshot.val().state.trim() === 'member') {
      state = member_team;
    } else if (snapshot.val().state.trim() === 'running') {
      state = running_for_dictator;
    } else if (snapshot.val().state.trim() === 'dictator') {
      state = current_dictator;
    } 
    if (state !== null) {
      callback(state);
    }
  });
};