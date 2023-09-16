javascript:
/*

Name: /GH LOC#
Url: https://github.com/gabrielsroka/ghloc/blob/main/ghloc.js

Setup:
1. drag/drop or copy/paste the bookmarklet to the browser toolbar

Usage:
1. sign in to GH and navigate to a repo
2. open the dev console (eg, F12 on Windows)
3. click the bookmarklet
4. results in the console
*/
(async function () {
    console.clear();
    const repo = location.pathname.split('/').slice(1, 3).join('/');
    const branch = 'master';
    const files = [];
    var total = 0;
    let p = 1;
    do {
        /* examples: path:src language:js language:python NOT path:generated
           see: https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax */
        const r = await fetch(`/search?q=repo:${repo}&type=code&p=${p++}`);
        var page = await r.json();
        await Promise.all(page.payload.results.map(async item => {
            const r = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/` + item.path);
            const lines = (await r.text()).split('\n');
            files.push({path: item.path, lines: lines.length});
            total += lines.length;
        }));
    } while (files.length < page.payload.result_count);
    files.sort((f1, f2) => f1.path.localeCompare(f2.path)).push({path: '(TOTAL)', lines: total});
    console.table(files);
})();
