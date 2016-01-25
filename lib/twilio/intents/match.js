'use strict';

module.exports = function(body) {
  var msg = body.trim().toLowerCase();

  var runMatcher = function(msg) {
    switch (true) {
      case (msg.substr(0,4) === "join"):
        return "joinIntent";
      case (msg.substr(0,11) === 'change name'):
        return "changeNameIntent";
      case (msg == 'elect' || msg == 'campaign' || msg == 'start'):
        return "campaignStartIntent";
      case (msg.split(" ").indexOf("yes") != -1 || msg.split(" ").indexOf("in") != -1):
        return "voteYesIntent";
      case (msg.split(" ").indexOf("no") != -1 || msg.split(" ").indexOf("out") != -1):
        return "voteNoIntent";
      case (msg.includes('step down') || msg.includes('reset') || msg.includes('renounce') || msg.includes('start over') || msg.includes('abdicate')):
        return "resetIntent";
      case (msg.includes('+')):
        return "karmaUpIntent";
      case (msg.includes('-')):
        return "karmaDownIntent";
      default: 
        return "otherIntent";
    };
  };

  return runMatcher(msg);
};