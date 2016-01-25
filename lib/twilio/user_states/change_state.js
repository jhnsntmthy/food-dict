'use strict';
const DB = require('../../firebase/db');
const DBH = require('../../firebase/db_helpers');
const SMS = require('../send');

module.exports = function(request) {

  var findTeamFromPhone = function(phonenumber, cb) {
    DB.child('users/'+phonenumber.replace('+','')).once('value', function(snap) {
      var team = snap.val().team;
      cb(phonenumber, team);
    });
  };

  return {
    createUser: function(phonenumber, name) {
      console.log('inside createUser');
      var phone = phonenumber.replace('+','');
      var userObject = {name: name, state: 'alone', team: 'alone', karma: 0};
      return DB.child('users/'+phone).set(userObject);
    },
    setUserState: function(phonenumber, state, cb, msg) {
      DB.child('users/'+phonenumber.replace('+','')+'/state').set(state);
      if (cb)
        cb(phonenumber, state, msg);
    },
    setUserTeam: function(phonenumber, team) {
      return DB.child('users/' + phonenumber.replace('+','')+'/team').set(team);
    },
    setUserName: function(phonenumber, name) {
      return DB.child('users/'+phonenumber.replace('+','')+'/name').set(name);
    },
    setTeamState: function(phonenumber, state) {
      DBH.findTeamFromPhone(phonenumber, function(phonenumber, team) {
        DB.child('teams/'+team+'/state').set(state);
      });
    },
    resetElections: function(phonenumber) {
      DBH.findTeamFromPhone(phonenumber, function(phonenumber, team) {
        DB.child('teams/'+team+'/state').set('awaiting');
      });
    }
  }
};