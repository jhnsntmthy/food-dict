'use strict';
const twilio = require('twilio');
const match_state = require('./user_states/match');
const match_intent = require('./intents/match');

module.exports = function(apiresponse) {
  var sms = new twilio.TwimlResponse();

  return {
    response: function(request) {
      console.log(['INCOMING',request.Body.trim(),
        'FROM',request.From]);
      try {
        match_state(request, function(state) {
          var resp = '';
          console.log(['STATE',state()]);
          console.log(['MATCH INTENT',match_intent(request.Body)]);
          try {
            resp = state()[match_intent(request.Body)](request);
          }
          catch(exception){
            resp = 'Why did you say: '+request.Body.trim()+ '?'
          }
          finally {
            sms.message(resp);
            apiresponse.send(sms.toString());
          }
        });
      }
      catch(exception) {
        sms.message("An Error Occured");
        apiresponse.send(sms.toString());
      }
    }
  }
};
