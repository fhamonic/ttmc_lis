"use strict";

let express = require('express');
let mustache = require('mustache-express');
var path = require('path');
let fs = require('fs');

let app = express();

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

let cards = require('./cards.js');
let history = [];

cards.load();

app.set('view engine', 'html');
app.use("/", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/cards-list', (req, res) => {
    res.render('cards-list', { cards: cards.cards() });
});

app.get('/choose-category', (req, res) => {
    res.render('choose-category', { categories: cards.categories() });
});

app.get('/pick-question/:category', (req, res) => {
    const category = req.params.category;
    const card_id = cards.pick_question(category);
    if (card_id === null) {
        res.status(404).send('No more cards of this category!');
    } else {
        res.redirect('choose-question-level/' + card_id);
    }
});

app.get('/choose-question-level/:id', (req, res) => {
    const id = req.params.id;
    const card = cards.get(id);
    let levels = [];
    for (let level of card.questions.keys()) {
        levels.push({ card_id: id, level_id: level, done: history.includes({ card: card, level: level }) })
    }
    res.render('choose-question-level', { card: card, levels: levels });
});

app.get('/card/:id', (req, res) => {
    const id = req.params.id;
    const card = cards.get(id);

    if (req.query.hasOwnProperty("level")) {
        const level = req.query.level;
        history.push({ card: card, level: level });

        let params = { card: card, question: card.questions[level], answer: card.answers[level] };
        if (card.hasOwnProperty("questions_en") && card.questions_en[level] != "")
            params["question_en"] = card.questions_en[level];
        if (card.hasOwnProperty("answers_en") && card.answers_en[level] != "")
            params["answer_en"] = card.answers_en[level];

        res.render('question', params);

    } else {
        res.render('card', card);
    }
});

app.get('/history', (req, res) => {
    res.render('history', { history: history });
});

app.listen(3000, () => {
    console.log('Listening http://localhost:3000 !');
});