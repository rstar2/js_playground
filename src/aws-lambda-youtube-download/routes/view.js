// Handle extracting the path from the original URL.

module.exports = (app) => {

    app.get('/', (req, res) => {
        // Render the download page template.
        res.render('home');
    });
    
    app.get('/list', (req, res) => {
        // Handle extracting the path from the original URL.
        // const originalUrl = module.parent ? req.originalUrl.slice(1) :
        //     req.originalUrl.slice(`/${apiStage}/`.length);
        // const path = decodeURIComponent(originalUrl);

        // // Handle full youtube URLs or just the video ID.
        // const urlPrefixes = ['https://', 'http://', 'www.youtube.com', 'youtube.com'];
        // let videoId, videoUrl;
        // if (urlPrefixes.some(prefix => path.startsWith(prefix))) {
        //     videoUrl = path;
        //     videoId = videoUrl.match(/v=([^&]*)/)[1];
        // } else {
        //     videoId = path;
        //     videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        // }
        // 
        // Render the download page template.
        // res.render('list', { apiStage, videoId, videoUrl });


        res.render('list');
    });
};