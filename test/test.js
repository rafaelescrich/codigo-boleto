var assert = require('assert');
describe('identifica_moeda', function() {
	it('should return Real when number 9 is the parameter', function() {
	  assert.equal("Real", indentifica_moeda(9));
  });
});