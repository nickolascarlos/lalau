const yt_music = require('node-youtube-music').default;
const YoutubeMusicApi = require('youtube-music-api');
const Spintax = require('node-spintax');
const downloader = require('../botUtilities/downloader');
const path = require('path')

module.exports = async(songTitle, lalauAnswer) => {
    if (songTitle === '')
        return await lalauAnswer.text(`Puts! Quer que eu descubra o que você quer ouvir?`, true)

    const ytApi = new YoutubeMusicApi()
    await ytApi.initalize() /* Sim, .initalize(), com esse erro mesmo... */

    let songList
    try {
        songList = (await ytApi.search(songTitle, 'song')) // yt_music.searchMusics(songTitle));
    } catch (e) {
        return await lalauAnswer.text(e.message, true)
    }

    if (songList.length === 0)
        return await lalauAnswer.text(`{Mals aí... |Foi mal! |}{Não foi encontrada|Não encontrei} nenhuma música com esse nome`, true)

    await lalauAnswer.text(`{Peraí|Calma|Carma|Calma aí|Pera}, {agorinha|já já|daqui a pouco} te {envio} a música`)

    let result = await downloader(songList.content)
    if (result) {
        await lalauAnswer.voice(path.resolve(result[0].file)) /*'./misc/media/trau.mp3')*/
        let downloadedSong = songList.content[result[1]]
        console.log(downloadedSong)
        await lalauAnswer.text(`\n\n🎵 *${downloadedSong['name']}*\n👨‍🎤 _${downloadedSong['artist']['name']}_\n\n💽 ${downloadedSong['album']['name']}`)
        await lalauAnswer.text(`\n\n📺 https://youtu.be/${downloadedSong['videoId']}`)
    } else await lalauAnswer.text(`É... algo de errado não está certo!`, true)

    return null
}