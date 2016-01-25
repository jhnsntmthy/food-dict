'use strict';
const DB = require('./db');

module.exports = function(request) {

  let findTeamFromPhone = function(phonenumber, cb) {
    DB.child('users/'+phonenumber.replace('+','')).once('value', function(snap) {
      var team = snap.val().team;
      cb(phonenumber, team);
    });
  };
  return {
    findTeamFromPhone: findTeamFromPhone
  }
}