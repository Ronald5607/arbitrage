const jsdom = require('jsdom');
const fs = require('fs');
const jquery = require('jquery');


async function getpage() {
    return await fetch("https://www.hltv.org/betting/money")
}

async function main() {
    // const resp = await getpage();
    // await fs.writeFile('test.html',await resp.text(), err => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });


}

fs.readFile('test.html', 'utf-8', (err, data) => {
    if (err) {
        console.log(err)
    }
    const oddsPage = new jsdom.JSDOM(data);
    const bookMakerMatches = oddsPage.window.document.querySelectorAll('.bookmakerMatch tbody');

    console.log(bookMakerMatches[0].querySelector('td'))

});