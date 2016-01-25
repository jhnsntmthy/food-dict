'use strict';
const Firebase = require('firebase');

module.exports = new Firebase(process.env.FIREBASEURI || 'https://food-dictator.firebaseio.com/');
