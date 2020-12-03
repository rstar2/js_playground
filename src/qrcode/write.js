const fs = require('fs');
const qrcode = require('qrcode');

run().catch(error => console.error(error.stack));

async function run() {
    const text = 'http://rumenneshev.net';
    fs.writeFileSync('./qr-data-url.html', `<img src="${await qrcode.toDataURL(text)}">`);
    
    fs.writeFileSync('./qr-to-string.svg', await qrcode.toString(text, {type:'svg'}));

    await qrcode.toFile('./qr-file.svg', text); 
    await qrcode.toFile('./qr-file.png', text);
    await qrcode.toFile('./qr-file.txt', text);
}