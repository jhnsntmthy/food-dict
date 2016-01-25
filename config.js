module.exports = {
    // Twilio Account SID - found on your dashboard
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,

    // Twilio Auth Token - found on your dashboard
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,

    // A Twilio number that you have purchased through the twilio.com web
    // interface or API
    twilioNumber: process.env.TWILIO_NUMBER,

    // The port your web application will run on
    port: process.env.PORT || 8080
};
