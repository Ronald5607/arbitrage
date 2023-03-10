'use strict';

const jsdom = require('jsdom');
const fs = require('fs');

const bmClass = {
    betway: '.odds.b-list-odds.b-list-odds-provider-betway a',
    ggbet: '.odds.b-list-odds.b-list-odds-provider-ggbet a',
    thunderpick: '.odds.b-list-odds.b-list-odds-provider-thunderpick a',
    lootbet: '.odds.b-list-odds.b-list-odds-provider-lootbet a',
    lxbet: '.odds.b-list-odds.b-list-odds-provider-1xbet a',
    pinnacle: '.odds.b-list-odds.b-list-odds-provider-pinnacle a',
    unibet: 'odds.b-list-odds.b-list-odds-provider-unibet a',
    betwinner: 'odds.b-list-odds.b-list-odds-provider-betwinner a',
    twentytwobet: '.odds.b-list-odds.b-list-odds-provider-22bet a',
    vulkan: '.odds.b-list-odds.b-list-odds-provider-vulkan a',
    bettwenty: '.odds b-list-odds.b-list-odds-provider-bet20 a',
    parimatch: '.odds.b-list-odds.b-list-odds-provider-parimatch a',
    nlbet: '.odds.b-list-odds.b-list-odds-provider-n1bet a',
    coinplay: '.odds.b-list-odds.b-list-odds-provider-coinplay a',

}

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

    for (const match of bookMakerMatches) {

        const teamnames = getMatchNames(match);
        const matchodds = getMatchOdds(match);

        console.log(checkMatch(matchodds));

        


    }
});


function getTeamName(teamrow) {
    return teamrow.querySelector('.team-name a img').title
}


function getTeamOdds(teamrow) {
    let odds = {};
    for (const key in bmClass) {
        const odd = teamrow.querySelector(bmClass[key]);
        // If a bookmaker doesnt offer a bet on the match odd will be null.
        if (odd != null) {
            Object.defineProperty(odds, key, {value: odd.innerHTML, enumerable: true});
        }
    }
    return odds
}


function getMatchNames(match) {
    return {
        first: getTeamName(match.children[0]),
        second: getTeamName(match.children[1])
    }
}

function getMatchOdds(match) {
    return {
        first: getTeamOdds(match.children[0]),
        second: getTeamOdds(match.children[1]),
        bookmakers: Object.keys(getTeamOdds(match.children[0]))
    }   
}

function isBetProfitable(oddOne, oddTwo) {
    return ((1/oddOne + 1/oddTwo) < 1);
}

function betRatio(oddOne, oddTwo) {
    return oddOne/oddTwo;
}

function checkMatch(matchOdds) {

    const profitableBets = [];

    for (const firstBookmaker of matchOdds.bookmakers) {

        

        for (const secondBookmaker of matchOdds.bookmakers) {

            let betObject = {};

            const firstOdd = matchOdds['first'][firstBookmaker];
            const secondOdd = matchOdds['second'][secondBookmaker];

            if (isBetProfitable(firstOdd, secondOdd)) {

                Object.defineProperty(betObject, firstBookmaker, {value: firstOdd, enumerable: true});
                Object.defineProperty(betObject, secondBookmaker, {value: secondOdd, enumerable: true});
                profitableBets.push(betObject);
            }
        }
    }
    return profitableBets
}