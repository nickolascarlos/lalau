const sessionManager = require('./SessionManager');

module.exports = async (number) => {
	if (sessionManager.get(number))
		return sessionManager.getProperty(number, 'registered')
	return false
}