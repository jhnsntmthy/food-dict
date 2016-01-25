'use strict';
const match_intent = require('../../lib/twilio/intents/match');


describe('Twilio Intent Matcher', function() {

  it('should attempt to Join', function() {
    expect(match_intent('JOIN sctient ')).toBe('joinIntent');
  });

  it('should attempt to change name', function() {
    expect(match_intent('CHANGE name')).toBe('changeNameIntent');
  });

  it('should vote yes', function() {
    let intent = 'voteYesIntent'
    expect(match_intent('yes')).toBe(intent);
    expect(match_intent('in')).toBe(intent);
    expect(match_intent('IN')).toBe(intent);
  });
  it('should vote no', function() {
    let intent = 'voteNoIntent'
    expect(match_intent('no')).toBe(intent);
    expect(match_intent('out')).toBe(intent);
    expect(match_intent('Im out')).toBe(intent);
  });
  it('should start the campaign', function() {
    let intent = 'campaignStartIntent'
    expect(match_intent('START')).toBe(intent);
    expect(match_intent('elect')).toBe(intent);
    expect(match_intent('campaign')).toBe(intent);
  });
  it('should reset the campaign', function() {
    let intent = 'resetIntent'
    expect(match_intent('reset')).toBe(intent);
    expect(match_intent('renounce')).toBe(intent);
    expect(match_intent('step down')).toBe(intent);
  });
});
