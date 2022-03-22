import {readFile, writeFile} from 'fs';
console.log('Incrementing build number...');
readFile('./metadata.json', function (err, content) {
    if (err) throw err;
    let metadata = JSON.parse(content);
    metadata.buildRevision = metadata.buildRevision + 1;
    if (metadata.buildRevision > 9) {
        metadata.buildRevision = 0;
        metadata.buildMinor = metadata.buildMinor + 1;
    }
    if (metadata.buildMinor > 9) {
        metadata.buildMinor = 0;
        metadata.buildMajor = metadata.buildMajor + 1;
    }
    writeFile('./metadata.json', JSON.stringify(metadata), function (err) {
        if (err) throw err;
        console.log(`Current build number: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision}`);
    });
});
