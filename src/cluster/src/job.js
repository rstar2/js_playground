const fs = require('fs');
const jimp = require('jimp2');
const log = require('./log');

module.exports = async function run(id) {
    const start = new Date().getTime();
    const randomNumber = () => Math.floor(Math.random() * 1995) * 15;
    const destFileName = `${__dirname}/../tmp/${randomNumber()}-img.jpg`;

    log(`Copying ${destFileName}`);
    await fs.promises.copyFile(`${__dirname}/landscape.jpg`, destFileName);

    log(`Flipping ${destFileName}`);
    const image = await jimp.read(destFileName);
    image.flip(true, false);

    log(`Deleting ${destFileName}`);
    await fs.promises.unlink(destFileName);
    
    const jobTime = new Date().getTime() - start;
    log(`Job ${id} finished for ${jobTime}`);
    return Promise.resolve(`Success - took ${jobTime} milliseconds`);
};