const https = require('https');
https.get('https://promptforge-verse.vercel.app', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
        if (match) {
            console.log('Found main script:', match[1]);
            https.get('https://promptforge-verse.vercel.app' + match[1], (res2) => {
                let js = '';
                res2.on('data', chunk => js += chunk);
                res2.on('end', () => console.log('JS content starts with:', js.substring(0, 100).replace(/\n/g, '\\n')));
            });
        } else {
            console.log('No script found, html:', data.substring(0, 200).replace(/\n/g, '\\n'));
        }
    });
});
