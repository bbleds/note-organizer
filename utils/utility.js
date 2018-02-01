const R = require('ramda')
const { 
	editableUserProperties, 
	requiredUserProperties 
} = require('../constants/user')
const { ADMIN_SECRET_KEY } = require('../config')

// contains utility methods for general usage
module.exports = {
	
	// this is used in the api to send back consistent output
	standardRes : (data=[], msg='', error =false) => ({ 
		error, 
		msg, 
		data: Array.isArray(data) ? data : [data] 
	}),
	
	// returns a trimmed verson of a value -- should be used on strings
	trimValue : v => v.trim(),
	
  // this is a comparison function used to check that value "v" on object with key "k" is not empty and is a string, and that key "k" is a valid key existing in some array "editableUserProperties"
	validateEditableUserData : (v, k) => (typeof v === 'string' && v.trim() && R.contains(k, editableUserProperties)),
	
	validateRequiredUserData : (v, k) => (typeof v === 'string' && v.trim() && R.contains(k, requiredUserProperties)),
	
	// checks headers to validate a request
	authorizeRequest : req => (req.headers.authorization === ADMIN_SECRET_KEY ? 
		module.exports.standardRes() :
		module.exports.standardRes([], 'You do not have permission to perform this action', true) 
	)
}