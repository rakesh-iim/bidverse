import assert from 'node:assert/strict';
import {test} from 'node:test';
import {calculateMinimumBid, validateBidIntent,shouldAcceptBid,calculateAvailableBudget} from '../lib/auction-rules.mjs';

test('minimum bid uses base price on first bid',()=>assert.equal(calculateMinimumBid(null,50,10),50));
test('minimum bid increments after first bid',()=>assert.equal(calculateMinimumBid(100,50,10),110));
test('rejects invalid bid increment',()=>assert.equal(validateBidIntent({amount:115,currentBid:100,basePrice:50,increment:10,remainingPurse:1000,reservedBudget:0}).ok,false));
test('rejects insufficient purse',()=>assert.equal(validateBidIntent({amount:110,currentBid:100,basePrice:50,increment:10,remainingPurse:110,reservedBudget:10}).ok,false));
test('accepts valid bid',()=>assert.equal(validateBidIntent({amount:110,currentBid:100,basePrice:50,increment:10,remainingPurse:120,reservedBudget:10}).ok,true));
test('rejects expired server deadline',()=>assert.equal(shouldAcceptBid({eventStatus:'live',lotStatus:'open',deadlineMs:1000,serverNowMs:1000}),false));
test('rejects paused lot',()=>assert.equal(shouldAcceptBid({eventStatus:'live',lotStatus:'paused',deadlineMs:null,serverNowMs:1}),false));
test('reserve for mandatory squad slots',()=>assert.equal(calculateAvailableBudget({remainingPurse:1000,minSquad:5,currentSquad:2,minNextPlayerCost:100}),800));
test('accepts while before deadline',()=>assert.equal(shouldAcceptBid({eventStatus:'live',lotStatus:'open',deadlineMs:2000,serverNowMs:1999}),true));
