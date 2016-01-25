'use strict';
const DB = require('./db');
const DBH = require('./db_helpers');
const SMS = require('../twilio/send');
const electionResults = require('../election_results');

// Start Campaign, send out SMS, start timer
DB.child('teams').orderByChild('state').equalTo('campaign')
  .on('child_added', function(snap, prevChildKey) {
    let minutes = 5;
    let time = new Date((new Date()).getTime() + (minutes*60000)).getTime() / 1000;
    console.log([snap.key(), 'started their campaign', snap.val()]);
    messageTeamOptIn(snap.key(), 'Elections for the next Food Dictator'
      + ' have begun. Are you in or out?');
    DB.child('teams/'+snap.key()+'/election_time').set(time);
    setTimeout(function(team) {
      DB.child('teams/'+team+'/state').set('election');
    }, 1000 * 60 * minutes, snap.key());
});

DB.child('teams').orderByChild('state').equalTo('election')
  .on('child_added', function(snap, prevChildKey) {
    console.log(['team switched to election', snap.key()]);
    electionResults().getCandidates(snap.key());
});

DB.child('teams').orderByChild('state').equalTo('awaiting')
  .on('child_added', function(snap, prevChildKey) {
    DB.child('users').orderByChild('team').equalTo(snap.key())
      .once('value', function(childSnapshot){
        childSnapshot.forEach(function(childSnap) {
          childSnap.ref().update({state: 'member'});
        });
    });
});

let messageTeamOptIn = function(team, msg) {
  DB.child('users').orderByChild('team').equalTo(team)
    .once('value', function(snap){
      snap.forEach(function(childSnap) {
        if (childSnap.val().state === 'member'){
          SMS('+'+childSnap.key(), msg);
        }
      });
  });
};
