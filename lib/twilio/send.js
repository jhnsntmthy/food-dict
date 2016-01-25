'use strict';
const twilio = require('twilio');
const PHONE = new twilio.RestClient('AC015a5f451bbba0b04155def63c0866a8', 'db3a4c3ce157b84e73e393ae03283f58');

module.exports = function(to, msg) {
  PHONE.sms.messages.create({
      to: to,
      from: process.env.TWILIO_SMS_NUMBER || '+16692003988',
      body: msg
  }, function(error, message) {
    if (!error) {
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid);
      console.log([to,msg])
      console.log('Message sent on:');
      console.log(message.dateCreated);
      return true;
    } else {
      console.log('Oops! There was an error.');
      return false;
    }
  });
};