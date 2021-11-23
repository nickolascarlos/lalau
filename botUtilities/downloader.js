var YoutubeMp3Downloader = require("youtube-mp3-downloader");

function getYD() {
    return new YoutubeMp3Downloader({
        "ffmpegPath": "./misc/ffmpeg/ffmpeg.exe", // FFmpeg binary location
        "outputPath": "./misc/media", // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio", // Desired video quality (default: highestaudio)
        "queueParallelism": 2, // Download parallelism (default: 1)
        "progressTimeout": 2000, // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false // Enable download from WebM sources (default: false)
    });
}

async function downloadSong(ytId) {
    try {
        return await (new Promise((res, rej) => {
            let nYD = getYD()

            nYD.download(ytId, ytId + '.mp3')
            nYD.on('finished', (err, data) => {
                console.log(err)
                if (err)
                    rej(err)

                res(data)
            })
            nYD.on('error', err => {
                console.log(err)
                rej(err)
            })

            nYD.on('progress', prog => console.log(`PROGRESSO: ${prog.progress.percentage} %`))
        }))
    } catch (e) {
        return null
    }
}

module.exports = async(songList) => {
    for (let i = 0; i < songList.length; i++) {
        console.log(`DOWNLOADER: Música #${i} ::: ${songList[i].videoId}`)
        let songId = songList[i].videoId
        let result = await downloadSong(songId)
        if (result)
            return [result, i]
    }

    console.log(`DOWNLOADER: Nenhuma (das ${songList.length}) pôde ser baixada`)
    return null
};