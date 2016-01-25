const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const api = express();

const sms_incoming = require('./twilio/incoming');
const watch_db = require('./firebase/watch');

// Better HTTP logs
api.use(morgan('combined'));

// Express static file middleware - serves up JS, CSS, and images from the
// "public" directory where we started our webapp process
api.use(express.static(path.join(process.cwd(), 'public')));

// Parse incoming request bodies as form-encoded
api.use(bodyParser.urlencoded({
  extended: true
}));

// Process incoming SMS from Twilio
api.post('/sms', function(req, res) {
  sms_incoming(res).response(req.body);
});

// Render the WebPage
api.get('/', function(req, res) {
  res.send('HELLO BACON.')
});

api.listen(port, function(err) {
  // var alert = require('./twilio/send')('+19144941974', 'You knows it Honey Boo. Now hows about sum shuga?');

  console.log('Application Started on port '+ port);
});
