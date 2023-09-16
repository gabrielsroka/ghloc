javascript:
/* /GH LOC# */
(async function () {
    console.clear();
    const repo = location.pathname.split('/').slice(1, 3).join('/');
    const branch = 'master';
    const files = [];
    var total = 0;
    for (let p = 1; ; p++) {
        /* see https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax */
        const r = await fetch(`/search?q=repo:${repo}&type=code&p=${p}`); /* path:src language:js language:python NOT path:generated */
        const page = await r.json();
        await Promise.all(page.payload.results.map(async item => {
            const r = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/` + item.path);
            const lines = (await r.text()).split('\n');
            files.push({path: item.path, lines: lines.length});
            total += lines.length;
        }));
        if (files.length == page.payload.result_count) break;
    }
    files.sort((f1, f2) => f1.path.localeCompare(f2.path)).push({path: '(TOTAL)', lines: total});
    console.table(files);
})();
