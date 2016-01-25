'use strict';
const DB = require('./firebase/db');
const SMS = require('./twilio/send');
var _ = require('lodash-node');

module.exports = function() {

  let getCandidates = function(team) {
    DB.child('/teams/'+team).once('value', function(snap) {
      console.log(['Get Candidates Snap',snap.val()]);
      var scores = snap.val().members;
      console.log(['scores',scores]);
      DB.child('users').orderByChild('team').equalTo(snap.key())
        .once('value', function(snapshot) {
          var candidates = [];
          console.log(['users by team',snapshot.val()]);
          snapshot.forEach(function(childSnap) {
            if (childSnap.val().state === 'running') {
              candidates.push({phone: childSnap.key(), name: childSnap.val().name, 
                score: scores[childSnap.key()]});
            }
          });
          if (candidates.length > 0){
            // notify all the candidates that are running for dictator
            // process the winner, and notify all
            notifyCandidates(candidates, electionResults(candidates), snap.key());
          } else {
            // team state is in a weird place, with nobody running, so
            // reset the team state
            DB.child('teams/' + snap.key() + '/state').set('awaiting');
          }
      });
    });
  };

  let electionResults = function(candidates) {
    var can = candidates.sort(function (a, b) {
      if (a.score > b.score) {
        return 1;
      }
      if (a.score < b.score) {
        return -1;
      }
      return 0;
    });
    console.log(['can', can, candidates]);
    return _.sample(can.filter(function(obj) {
      return can[0].score == obj.score;
    }));
  };

  let notifyCandidates = function(candidates, winner, team) {
    var losers;

    // set the right states on team, and dictator
    DB.child('users/'+winner.phone+'/state').set('dictator');
    DB.child('teams/'+team+'/state').set('ruling');
    DB.child('teams/'+team+'/members/'+winner.phone).set(winner.score + 1);

    // message the winner
    SMS('+'+winner.phone, 'Congratulations! The proletariat has spoken '
      + 'and you are now the supreme Food Dictator');

    losers = candidates.filter(function(obj) {
      return obj.phone !== winner.phone;
    });

    losers.forEach(function(candidate) {
      // send messages to the losers and reset their status to "member"
      SMS('+'+candidate.phone, winner.name + ' is the new Food Dictator. '
        + 'The people have spoken!');
      DB.child('users/'+candidate.phone+'/state').set('member');
    })
  };

  return {
    getCandidates: getCandidates,
    electionResults: electionResults
  };
};