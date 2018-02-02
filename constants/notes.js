const R = require('ramda')

const editableNoteProperties = ['title', 'description', 'content']
const requiredUserProperties = R.filter(i => (i !== 'description'), editableNoteProperties)
const accessibleApiFields = R.union(editableNoteProperties, ['updated_at', 'created_at', 'id', 'user_id'])

module.exports = {
	editableNoteProperties,
	accessibleApiFields,
	requiredNoteProperties : requiredUserProperties
}
