const fs = require('fs');
const md5 = require('md5');
const path = require('path');

const sessionsPath = path.resolve('./lalauSessions') + '/'; // Coloque "/" no final

class SessionManager {
	
	constructor(path) {
		this.path = path
	}

	get(number) {
		if (fs.existsSync(this.getNumberSessionPath(number)))
			return JSON.parse(fs.readFileSync(this.getNumberSessionPath(number)));
		return null
	}

	getNumberSessionPath(number) {
		return this.path + md5(number) + ".json"
	}

	register(number) {
		let session = {
			number,
			since: new Date().getTime(),
			name: undefined,
			registered: false,
			history: [],
			lastMessage: 0
		}

		fs.writeFileSync(this.getNumberSessionPath(number), JSON.stringify(session))

		return session
	}

	update(number, newSessionObject) {
		console.log('Updating...')
		fs.writeFileSync(this.getNumberSessionPath(number), JSON.stringify(newSessionObject))
	}

	setProperty(number, property, value) {
		if (property == 'number' || property == 'lastMessage')
			return console.log('You just can\'t, bro! :/')

		let session = this.get(number)
		session[property] = value

		this.update(number, session)
	}

	getProperty(number, property) {
		let session = JSON.parse(fs.readFileSync(this.getNumberSessionPath(number)))
		return session[property]
	}

	addToHistory(number, message, direction) {
		let session = this.get(number)

		if (!session) return false

		let nowTimestamp = (new Date()).getTime()

		session.history.push({
			body: message,
			direction: direction, // 'to' or 'from'
			timestamp: nowTimestamp
		})

		session.lastMessage = nowTimestamp

		console.log('Adding to history...')
		this.update(number, session)

		return true
	}

	getHistory(number) {
		return this.get(number).history
	}

	clearHistory(number) {
		let session = this.get(number)

		if (!session) return false

		let nowTimestamp = (new Date()).getTime()
		session.history = []
		session.lastMessage = nowTimestamp

		this.update(number, session)
		
		return true
	}

	getLastMessage(number) {
		let history = this.get(number).history

		if (!history) return false
		if (history.length <= 0) return false

		return history[history.length - 1]
	}

	getLastReceivedMessage(number) {
		let historyFiltered = this.get(number).history.filter(x => x.direction == 'from')
		if (historyFiltered.length <= 0) return false
		return historyFiltered[historyFiltered.length - 1]
	}

	getLastSentMessage(number) {
		let historyFiltered = this.get(number).history.filter(x => x.direction == 'to')
		if (historyFiltered.length <= 0) return false
		return historyFiltered[historyFiltered.length - 1]
	}
}

module.exports = new SessionManager(sessionsPath)