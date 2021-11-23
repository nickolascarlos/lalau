const Spintax = require('node-spintax');

const sessionManager = require('./SessionManager');

class LalauAnswer {
	constructor (client, number) {
		this.client = client
		this.number = number
	}

	async answer(messageObject) {

		switch (messageObject.type) {
			case 'text':
				this.text(messageObject.body)
				break;
			
			case 'file':
				this.file(messageObject.body)
				break;

			case 'voice':
				this.voice(messageObject.body)
				break;

			case 'image':
				this.image(messageObject.body, messageObject.caption)
		}

	}

	async text(message, error = false) {
		await this.client.sendText(this.number, `*${error ? '🙉' : '🐵'} Lalau:* ${(new Spintax(message)).unspin(1)[0]}`)
		sessionManager.addToHistory(this.number, message, 'to')
	}

	async file(file) {
		await this.client.sendFile(this.number, file)
		sessionManager.addToHistory(this.number, '###FILE###', 'to')
	}

	async voice(file) {
		await this.client.sendVoice(this.number, file)
		sessionManager.addToHistory(this.number, '###VOICE###', 'to')
	}

	async image(file, caption) {
		await this.client.sendImage(this.number, file, 'nome_imagem', caption)
		sessionManager.addToHistory(this.number, '###IMAGE###', 'to')
	}
}

module.exports = LalauAnswer