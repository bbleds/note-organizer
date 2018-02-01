const R = require('ramda')

const editableUserProperties = ['first_name', 'last_name']

module.exports = {
	editableUserProperties,
	requiredUserProperties : R.insertAll(editableUserProperties.length, ['email'], editableUserProperties)
}