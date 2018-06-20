const stage = process.env.NODE_ENV || 'dev';

// 'await' requires to be used only inside an 'async' function
const main = async () => {
    const { app, apiRouter } = await require('./app')(stage);
    // load the local router
    require('./routes/api/local')(apiRouter);

    // run the Express server locally on port 3000
    app.listen(3000);
};

main();