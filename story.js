module.exports = {
    chapters: [
        'tavern',
        'dungeon',
        'castle'
    ],
    tavern: {
        get: (req, res) => {
            res.json({
                text: [
                    'Welcome adventurer! said an old man as you entered the tavern.',
                    'I have a quest for you!',
                    'Would you be interested in it?'
                ],
                choices: [
                    'accept',
                    'decline'
                ],
                hint: 'You should POST your CHOICE to this endpoint'
            });
        },
        post: (req, res) => {
            let choice = req.body.choice;
            if (choice) {
                choice = choice.toLowerCase();
            }

            switch (choice) {
                case 'restart':
                    res.json({
                        text: [
                            'Welcome adventurer! said an old man as you entered the tavern.',
                            'I have a quest for you!',
                            'Would you be interested in it?'
                        ],
                        choices: [
                            'accept',
                            'decline'
                        ],
                        hint: 'You should POST your CHOICE to this endpoint'
                    });
                    break;
                case 'accept':
                    res.json({
                        text: [
                            'Heh heh heh! A spirited adventurer!',
                            'I have a secret key which opens the dungeon underneath this fortress.',
                            'It is said that it hides many great treasures as well as horrible, terrifying monsters.',
                            'So, before giving you the key, you must answer 3 questions!',
                            'Are you still interested?'
                        ],
                        choices: [
                            'begin',
                            'decline'
                        ]
                    });
                    break;
                case 'begin':
                case 'retry first question':
                    res.json({
                        text: [
                            'I really admire your enthusiasm!',
                            'So, lets begin:',
                            '1 + 1 = ?'
                        ],
                        choices: [
                            '0', '1', '2'
                        ]
                    })
                    break;
                case 'decline':
                    res.json({
                        text: [
                            'Well, I was not expecting this, but anyway it\'s your choice...',
                            'Have a nice day though!'
                        ],
                        choices: [
                            'restart'
                        ],
                        game: 'over'
                    });
                    break;
                case '0':
                case '1':
                    res.json({
                        text: [
                            'Erm...',
                            (Math.random() > 0.5) ?
                                'I am afraid you should sharpen your math skills before venturing into the dungeon...' :
                                'You were almost right!'
                        ],
                        choices: [
                            'retry first question'
                        ]
                    })
                    break;
                case '2':
                    res.json({
                        text: [
                            'Very good!',
                            'Now, for the second question.',
                            'How much wood could a woodchuck chuck if a woodchuck could chuck wood?'
                        ],
                        choices: [
                            'not much',
                            'pretty much'
                        ]
                    })
                    break;
                case 'not much':
                case 'pretty much':
                case 'retry last question':
                    res.json({
                        text: [
                            'You are probably correct either way!',
                            'Now, in your journey, you will also need a tiny bit of luck.',
                            'So, in which hand do I have the key?'
                        ],
                        choices: [
                            'left', 'right'
                        ]
                    })
                    break;
                case 'left':
                case 'right':
                    let hand = Math.random() > 0.5 ? 'right' : 'left';
                    if (choice == hand) {
                        res.json({
                            text: [
                                'Sir, you are ready!',
                                'You may now enter the dungeon!',
                                'Here is your well deserved key:'
                            ],
                            key: jwt.sign({ chapter: 1 }, config.SECRET, { expiresIn: config.TOKEN_REFRESH }),
                        });
                    } else {
                        res.json({
                            text: [
                                'It seems like you are not lucky enough...',
                                'I cannot send you in there like that.'
                            ],
                            choices: [
                                'retry last question'
                            ]
                        });
                    }
                    break;
                default:
                    res.json({
                        text: [
                            'Are you trying to be funny?',
                            'This choice doesn\'t exist'
                        ]
                    });
                    break;
            }
        }
    },
    dungeon: {
        get: (req, res) => {
            res.json({
                text: [
                    'The dungeon door opened with a creaking noise.',
                    'You light the torch that you always carry with you, just in case, you know...',
                    'You notice that there are two paths,',
                    'one to the left, from which you can hear some mumbling,',
                    'and the other on the right which has a shiny little point at the end.',
                    'Which way do you go?'
                ],
                choices: [
                    'left',
                    'right'
                ]
            });
        },
        post: (req, res) => {
            let choice = req.body.choice;
            if (choice) {
                choice = choice.toLowerCase();
            }

            switch (choice) {
                case 'restart':
                case 'go back to the entrance':
                    res.json({
                        text: [
                            'The dungeon door opened with a creaking noise.',
                            'You light the torch that you always carry with you, just in case, you know...',
                            'You notice that there are two paths,',
                            'one to the left, from which you can hear some mumbling,',
                            'and the other on the right which has a shiny little point at the end.',
                            'Which way do you go?'
                        ],
                        choices: [
                            'left',
                            'right'
                        ]
                    });
                    break;
                case 'left':
                    let userKey = req.headers.key;
                    let userChoices = ['try to get the key'];

                    if (inventory[userKey] && inventory[userKey].distraction) {
                        userChoices.push('distract the troll with the shiny stone');
                    } else {
                        userChoices.push('go back to the entrance');
                    }

                    res.json({
                        text: [
                            'As you get closer, you notice there\'s a creature sleeping',
                            'It\'s a troll.',
                            'You also notice that it seems he has a key beside him.'
                        ],
                        choices: userChoices
                    });
                    break;
                case 'try to get the key':
                    res.json({
                        text: [
                            'You might say that trolls are heavy sleepers,',
                            'that they hear nothing when they sleep.',
                            'But it was not the case this time...',
                            'It ended quite badly for you...',
                            'You should try again.'
                        ],
                        choices: [
                            'restart'
                        ]
                    });
                    break;
                case 'right':
                    res.json({
                        text: [
                            'You walk through a muddy tunnel, hearing whispers all around you.',
                            'But your effort is not in vain!',
                            'As you reach the end of the tunnel you find a shiny stone.'
                        ],
                        choices: [
                            'take it', 'go back to the entrance'
                        ]
                    });
                    break;
                case 'take it':
                    inventory[req.headers.key] = {};
                    inventory[req.headers.key].distraction = true;

                    res.json({
                        text: [
                            'You have a feeling that something bad is going to happen.',
                            'But you decide there\'s no going back now',
                            'You take the stone...',
                            'AND...',
                            'Nothing happens, we\'re not in that kind of adventure',
                            'Enjoy your shiny stone!'
                        ],
                        choices: [
                            'go back to the entrance'
                        ]
                    });
                    break;
                case 'distract the troll with the shiny stone':
                    inventory[req.headers.key].distraction = undefined;
                    res.json({
                        text: [
                            'You throw the shiny stone on one of the dungeon\'s walls.',
                            'The troll wakes up and goes to see what happened.',
                            'You manage to take the key while the troll is distracted by the shiny stone.',
                            'On one side of the key is engraved: castle'
                        ],
                        key: jwt.sign({ chapter: 2 }, config.SECRET, { expiresIn: config.TOKEN_REFRESH })
                    })
                    break;
                default:
                    res.json({
                        text: [
                            'Are you trying to be funny?',
                            'This choice doesn\'t exist'
                        ]
                    });
                    break;
            }
        }
    },
    castle: {
        get: (req, res) => {
            res.json({
                text: [
                    'TO BE CONTINUED...',
                    'some day.',
                    'I\'m not sure...',
                    'Anyway',
                    'I hope you liked it :D'
                ],
                hint: 'Check out some of my other stuff here: https://github.com/y0rg1'
            });
        }
    }
}