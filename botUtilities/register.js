const path = require('path');
const sessionManager = require('../utilities/SessionManager');

module.exports = async (lalauAnswer, message) => {
	let session = sessionManager.get(lalauAnswer.number)
	// console.log(session)
	
	if (!session) {
		await lalauAnswer.image(path.resolve('./lalauMedia/foto.png'), `Olá, meu nome é *Lalau* (em negrito mesmo).\n\nSou um macaco criado com o propósito de responder a algumas de suas perguntas e servir a você.\n\nSe quiser ouvir uma musguinha é só me falar o que quer ouvir, se eu tiver no clima e desocupado, te envio um audiozinho meu cantando.\n\nÉ isso!\n\nDeus 'bençoa!`)
		session = sessionManager.register(lalauAnswer.number)
	}

	// console.log(session)
	let lastSentMessage = sessionManager.getLastSentMessage(lalauAnswer.number)?.body

	console.log("ÚLTIMA MENSAGEM: " + lastSentMessage)

	switch (lastSentMessage) {
		case 'Qual seu nome?':
			session.name = message
			break;

		case 'Qual sua cor favorita?':
			session.favoriteColor = message
			break;

		case 'Em que ano você nasceu?':
			if (isNaN(message)) {
				await lalauAnswer.text('Parece que não é um número! Vou assumir que você nasceu em 1715', true)
				session.year = 1715
			} else
				session.year = message

			break;

		case 'Qual seu animal favorito?':
			if (message != 'macaco')
				await lalauAnswer.text('Por que não é o macaco? Hashtag chateado', true)
			session.favoriteAnimal = message
		break;
	}

	sessionManager.update(lalauAnswer.number, session)
	
	if (!session.name)
		return await lalauAnswer.text('Qual seu nome?')
	
	if (!session.favoriteColor)
		return await lalauAnswer.text('Qual sua cor favorita?')

	if (!session.year)
		return await lalauAnswer.text('Em que ano você nasceu?')

	if (!session.favoriteAnimal)
		return await lalauAnswer.text('Qual seu animal favorito?')

	lalauAnswer.text('Prontcho! Registrado. Obrigado por me fornecer tantas informações inúteis')

	session.registered = true
	sessionManager.update(lalauAnswer.number, session)
}