const R = require('ramda')

const editableNoteProperties = ['title', 'description', 'content']
const requiredUserProperties = R.filter(i => (i !== 'description'), editableNoteProperties)

module.exports = {
	editableNoteProperties,
	requiredNoteProperties : requiredUserProperties
}