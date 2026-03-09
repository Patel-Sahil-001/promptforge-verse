(async () => {
    const res = await fetch('https://promptforge-verse.vercel.app');
    const text = await res.text();
    const match = text.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
        console.log('Found script tag:', match[1]);
        const jsRes = await fetch('https://promptforge-verse.vercel.app' + match[1]);
        const jsText = await jsRes.text();
        console.log('Script content preview:', jsText.substring(0, 100).replace(/\n/g, '\\n'));
    } else {
        console.log('No script matching index found. HTML:', text.substring(0, 200).replace(/\n/g, '\\n'));
    }
})();
