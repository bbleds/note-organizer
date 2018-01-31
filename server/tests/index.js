const expect = require('chai').expect

describe('user', function() {
    describe('properties', function() {

			var user = {name: 'Scott'};

        it('should have a name property', function() {
            expect(user).to.have.property('name');
        });
    });
});
