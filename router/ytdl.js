const router = require('express').Router();
const ytdl = require('ytdl-core');
const http = require('https');

router.get('/info/:id', async (req, res) => {
    try {
    
        const URL = req.params.id;
        let info = await ytdl.getInfo(URL);

        /* URl Information*/ 
        let detail = info.player_response.videoDetails;
  
        /* Video with audio */ 
        let vna = info.player_response.streamingData.formats;
  
        /* Video without audio & audio only */    
        let data = info.player_response.streamingData.adaptiveFormats;

        /* Video without audio */
        let video  = data.filter(a => a.mimeType === 'video/webm; codecs="vp9"');

        /* Audio only*/
        audio = data.filter(a => a.audioQuality === 'AUDIO_QUALITY_MEDIUM');


        res.send({info: detail, video: vna, audioOnly: audio, videoOnly: video});
    } catch (error) {
        res.send({success: false, message: error.message});
    }
});

router.get('/download/:id/:type/:quality', async (req, res) => {

    const URL = req.params.id;
    const type = req.params.type;
    const quality = req.params.quality;   
    
    try {
    
        const data = await ytdl.getInfo(URL);
        let title = data.player_response.videoDetails.title;
        let videoList = data.player_response.streamingData.adaptiveFormats;
    
        let video;
        let format;
        switch (type) {

            case 'audioOnly':
                video = videoList.filter(a => a.audioQuality === 'AUDIO_QUALITY_MEDIUM').shift().url;
                format = 'mp3';
            break;

            case 'videoOnly':
                video = videoList.filter(a => a.mimeType === 'video/webm; codecs="vp9"').find(a => a.qualityLabel === quality).url;
                format = 'mp4';
            break;

            default:
                video = data.player_response.streamingData.formats.find(a => a.qualityLabel === quality).url;
                format = 'mp4';
            break;
        
        }

        
        http.get(video, (response) => {

            res.writeHead(200, {"Content-disposition": `attachment; filename="${title}.${format}"`});
            response.pipe(res);

        });

    } catch (error) {
        res.send(error.message);
    }

});

module.exports = router;