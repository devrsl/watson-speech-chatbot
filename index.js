const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const env = require('./env.json')
const fs = require('fs')
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

const speechService = new SpeechToTextV1({
    url: env.url,
    username: env.username,
    password: env.password
});

app.use(express.static('static'));

app.post('/api/sendaudio', multipartMiddleware, (req, res, next) => {
    if (!req.files || !req.files.audio || !req.files.audio.path) {
        return res.status(400).json({
            message: 'Bad Request'
        });
    }

    //pt-BR_NarrowbandModel
    //pt-BR_BroadbandModel
    
    speechService.recognize({
        audio: fs.createReadStream(req.files.audio.path),
        content_type: 'audio/webm',
        model: 'pt-BR_BroadbandModel' 
    }, function(err, resIBM) {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        return res.json(resIBM);
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});