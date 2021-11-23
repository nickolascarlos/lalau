const bot = require('venom-bot');
const yt_music = require('node-youtube-music');

const LalauAnswer = require('./utilities/LalauAnswer');
const clientRegistered = require('./utilities/clientRegistered');

bot.create()
    .then(async client => {

        client.onMessage(async(message) => {
            try {
                if (message.body.toLowerCase().startsWith("lalauzin") || message.body.toLowerCase().startsWith("lalauzinho"))
                    return await (new LalauAnswer(client, message.from)).text("Ninguém me chama assim há anos 😭😭😭 Agora, sério, meu nome é Lalau e eu quero ser tratado como tal")

                if (message.body.toLowerCase().startsWith("dadinho"))
                    return await (new LalauAnswer(client, message.from)).text("Dadinho é o @!$#%&*! Meu nome agora é Lalau")

                if (!message.body.toLowerCase().startsWith("lalau,")) return null

                let actualMessage = message.body.substr("lalau,".length, message.body.length).trim();

                if (!(await clientRegistered(message.from))) {
                    // Faremos o registro
                    return await require('./botUtilities/register')(new LalauAnswer(client, message.from), actualMessage)
                }

                let response
                if (actualMessage == 'oi')
                    response = require('./botAbilities/sayHi')()

                else if (actualMessage.toLowerCase().startsWith('quero ouvir')) {
                    let songTitle = actualMessage.substr('quero ouvir'.length, actualMessage.length).trim()
                    response = await require('./botAbilities/sendSong')(songTitle, new LalauAnswer(client, message.from))
                }


                if (!response) return;
                await (new LalauAnswer(client, message.from)).answer(response)
            } catch (e) {
                console.log("GENERAL: " + e.message)
                    // console.log(message)
            }
        })

    })