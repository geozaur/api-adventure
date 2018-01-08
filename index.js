const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('./config');
const story = require('./story');

const app = express();

// Utility

function verifyKeyFor(chapter){
    return (req, res, next) => {
        let key = req.headers.key;
        jwt.verify(key, config.SECRET, (err, decoded) => {
            if (err) {
                return res.json({ text: ['You need to provide a valid key!'] });
            } else {
                if (decoded.chapter >= story.chapters.indexOf(chapter)) {
                    next();
                } else {
                    return res.json({ text: ['You need another key to access this part of the story!'] })
                }
            }
        });
    }
}

// Parse json requests

app.use(bodyParser.json());

// Enable CORS

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, key");
  next();
});

// Frontend for API

app.use('/client', express.static('client'));

// Intro endpoints

app.get('/', (req, res) => {
    res.json({
        text: [
            'Welcome to the API Adventure',
            'Post your name here to start the adventure!'
        ]
    });
});

app.post('/', (req, res) => {
    let name = req.body.name;
    
    if (!name) {
        res.json({
            text: ['You did not include a name. Please try again!']
        });
        return;
    }

    res.json({
        text: [
            `Hello ${req.body.name}!`,
            'Below is a key which grants you access to the tavern.'
        ],
        key: jwt.sign({ chapter: 0 }, config.SECRET, { expiresIn: config.TOKEN_REFRESH }),
        hint: 'You must place it in your headers for every request! The tavern is an endpoint!',
        warning: 'This key expires in a month!'
    });
});


// Chapter 0

app.use(verifyKeyFor('tavern'));
app.get('/tavern', story.tavern.get);
app.post('/tavern', story.tavern.post);

// Chapter 1

app.use(verifyKeyFor('dungeon'));
app.get('/dungeon', story.dungeon.get);
app.post('/dungeon', story.dungeon.post);

// Chapter 2

app.use(verifyKeyFor('castle'));
app.get('/castle', story.castle.get);


// Start the server

app.listen(config.PORT, () => {
    console.log(`Server started on port ${config.PORT}`);    
});