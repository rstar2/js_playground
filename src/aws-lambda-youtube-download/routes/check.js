module.exports = (app) => {
    app.get('/check/:logKey/:mp3Key', (req, res) => {
        const logKey = decodeURIComponent(req.params.logKey);
        const mp3Key = decodeURIComponent(req.params.mp3Key);
        
    });

};