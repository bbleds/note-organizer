const R = require('ramda')
const { editableUserProperties } = require('../constants/user')

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
	
	validateUserData : (v, k) => (typeof v === 'string' && v.trim() && R.contains(k, editableUserProperties))
	
}