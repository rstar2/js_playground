const fs = require('fs');
const readline = require('readline');

const argv = process.argv.slice(2);

const inFile = argv[0];
const outFile = argv[1] || `${inFile}.out`;

const outStream = fs.createWriteStream(outFile);

const rl = readline.createInterface({
    input: fs.createReadStream(inFile),
});

rl.on('line', (/* String */line) => {
    // strip line from version
    const index = line.lastIndexOf('@');
    if (index > 1) { // allow the first character to be '@' as in "@angular/cli" package
        line = line.substring(0, index);
    }
    outStream.write(line + '\n');
});
rl.on('end', () => outStream.end());