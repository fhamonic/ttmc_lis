"use strict";

const fs = require('fs');

let cards = [];
let cards_categories_ids = {};

function read_cards(category) {
    const folder = "cards/" + category;
    let ids = [];
    fs.readdirSync(folder).forEach(file => {
        let question = JSON.parse(fs.readFileSync(folder + "/" + file, { encoding: "utf8" }));
        question["id"] = cards.length;
        ids.push(question["id"]);
        cards.push(question);
    });
    cards_categories_ids[category] = ids;
};

exports.load = function () {
    read_cards("Laboratoire");
    read_cards("Science");
};

exports.cards = function () {
    return cards;
};

exports.get = function (id) {
    return cards[id];
};

exports.categories = function () {
    return Object.keys(cards_categories_ids);
};

function pickAndRemoveRandomElement(array) {
    if (array.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    const randomElement = array[randomIndex];
    array.splice(randomIndex, 1);
    return randomElement;
}

exports.pick_question = function (category) {
    const randomElement = pickAndRemoveRandomElement(cards_categories_ids[category]);
    return randomElement;
};
