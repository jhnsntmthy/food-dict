'use strict';
const DB = require('./db');

let teamArray = [];

function checkIfUserIsInTeam(team, phone, campaign) {
  DB.child('teams/'+team+'/members/'+phone).once('value', function(snap) {
    console.log(['checkIfUserIsInTeam',snap.val()]);
    if (snap.val() === null) {
      DB.child('teams/'+team+'/members/'+phone).set(0); 
    }
    if (campaign) {
      DB.child('users/'+phone+'/state').set("running");
    }
  });
}
function checkIfTeamExists(team, phone, cb) {
  DB.child('teams/'+team).once('value', function(snap) {
    var campaign = false;
    console.log(['checkIfTeamExists', snap.val(), team, phone]);
    if (snap.val() === null && teamArray.indexOf(team) === -1) {
      // some kind of bug in Firebase will delete many inserts at the same time
      // cause these are happening concurrently. So I want to skip this process
      // on subsequent inserts of the team object.
      teamArray.push(team); 
      DB.child('teams/'+team).set({state: 'awaiting', members: {}}); 
    } else if (snap.val() !== null && snap.val().state === "campaign") {
      campaign = true;
    }
    cb(team, phone, campaign);
  });
}

// Watching the DB for changes to the users, to see if we need to create any
// new teams, and to add the user to any team he joins. Each user starts with 
// a score of 0 within that team when joining

DB.child('users').orderByChild('state').equalTo('member')
  .on('child_added', function(snap, prevChildKey) {
    checkIfTeamExists(snap.val().team, snap.key(), checkIfUserIsInTeam);
});
DB.child('users').orderByChild('state').equalTo('member')
  .on('child_changed', function(snap, prevChildKey) {
    checkIfTeamExists(snap.val().team, snap.key(), checkIfUserIsInTeam);
});
