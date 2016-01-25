'use strict';
const ER = require('../../lib/election_results');

describe('Election Results Test', function() {
  let candidates = [{phone: '15404033423',
                      name: "Hoji Moji",
                      score: 0},
                    {phone: '12352345345',
                      name: "Toby McGuire",
                      score: 1},
                    {phone: '13453232235',
                      name: "David Hasselhoff",
                      score: 1},
                    {phone: '12363453467',
                      name: "Dom Kruise",
                      score: 1},
                    {phone: '10877484793',
                      name: "Mamma Mia",
                      score: 1}]
  
  it('should be the lowest score', function() {
    expect(ER().electionResults(candidates).name).toBe('Hoji Moji');
  });

  it('should not be the highest score', function() {
    candidates[1].score = 0;
    candidates[3].score = 0;
    candidates[4].score = 0;
    expect(ER().electionResults(candidates).name).toNotBe('David Hasselhoff');
  });
});