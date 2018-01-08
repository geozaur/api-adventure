window.onload = () => {
    /* Game variables */
    const apiURL = 'http://127.0.0.1:1234/';
    let currentEndpoint = apiURL;
    let data = {};
    let text = ['Loading...'];
    let currentIndex = 0;
    let visited = {};

    /* UI variables */

    // welcome screen
    let welcomeScreen = document.getElementById('welcome-screen');

    document.getElementById('start-game-btn').onclick = () => {
        let playerName = document.getElementById('player-name-input').value;
        fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: playerName })
        })
            .then(res => res.json())
            .then(json => {
                resetStoryView(json);
                renderText();
                changeScreenTo(storyScreen);

            })
            .catch(err => {
                errorMessage.innerHTML = 'An error occured while starting the adventure :(';
                changeScreenTo(errorScreen);
            });

    }

    // story screen
    let storyScreen = document.getElementById('story-screen');

    let leftBtn = document.getElementById('left-btn');
    leftBtn.onclick = () => {
        if (currentIndex > 0) {
            rightBtn.disabled = false;
            currentIndex--;
            renderText();

            if (currentIndex == 0) {
                leftBtn.disabled = true;
            }

            if (currentIndex == text.length - 2) {
                placeholderContainer.style.display = 'none';
                choiceContainer.style.display = 'none';
                choiceContainer.innerHTML = '';
            }
        }
    }

    let rightBtn = document.getElementById('right-btn');
    rightBtn.onclick = () => {
        if (currentIndex < text.length - 1) {
            leftBtn.disabled = false;
            currentIndex++;
            renderText();

            if (currentIndex == text.length - 1) {
                rightBtn.disabled = true;
                lastPageTrigger();
            }
        }
    }

    document.onkeydown = (event) => {
        if (activeScreen == storyScreen) {
            switch (event.keyCode) {
                case 37:
                    leftBtn.onclick();
                    break;
                case 39:
                    rightBtn.onclick();
                    break;
            }
        }
    }

    let textArea = document.getElementById('text-area');

    function resetStoryView(json, visited) {
        data = json || {};
        text = data.text || text;
        currentIndex = visited ? (text.length - 1) : 0;

        leftBtn.disabled = true;
        rightBtn.disabled = true;

        placeholderContainer.style.display = 'none';

        if (currentIndex == text.length - 1) {
            if (text.length > 1) {
                leftBtn.disabled = false;
            }
            lastPageTrigger();
        } else {
            rightBtn.disabled = false;
        }
    }

    let activeScreen = welcomeScreen;

    // error screen
    let errorScreen = document.getElementById('error-screen');
    let errorMessage = document.getElementById('error-message');

    // location control
    let currentKey = document.getElementById('current-key');
    let locationSelect = document.getElementById('location-select');
    locationSelect.onchange = () => {
        let endpoint = locationSelect.value;

        choiceContainer.innerHTML = '';

        if (endpoint == "intro") {
            changeScreenTo(welcomeScreen);
            currentEndpoint = apiURL;
            return;
        }

        fetch(apiURL + endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'key': currentKey.value
            }
        })
            .then(res => res.json())
            .then(json => {
                currentEndpoint = apiURL + endpoint;
                resetStoryView(json);
                renderText();
                changeScreenTo(storyScreen);
            })
            .catch(err => {
                errorMessage.innerHTML = `An error occured while getting to the ${endpoint} :(`;
                changeScreenTo(errorScreen);
            })
    }

    // placeholders
    let placeholderContainer = document.getElementById('placeholder-container');
    let key = document.getElementById('key');
    let hint = document.getElementById('hint');
    let warning = document.getElementById('warning');

    let choiceContainer = document.getElementById('choice-container');


    /* Rendering functions */

    function lastPageTrigger() {
        if (data.key) {
            key.innerHTML = `KEY: ${data.key}`;
        } else {
            key.innerHTML = ``;
        }

        if (data.hint) {
            hint.innerHTML = `HINT: ${data.hint}`;
        } else {
            hint.innerHTML = ``;
        }

        if (data.warning) {
            warning.innerHTML = `WARNING: ${data.warning}`;
        } else {
            warning.innerHTML = ``;
        }

        placeholderContainer.style.display = 'inline';

        if (data.choices) {
            data.choices.forEach(choice => {
                let button = document.createElement("button");
                button.innerHTML = choice;
                button.className = 'choice';

                button.onclick = () => {
                    fetch(currentEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'key': currentKey.value
                        },
                        body: JSON.stringify({ choice })
                    })
                        .then(res => res.json())
                        .then(json => {
                            choiceContainer.innerHTML = '';
                            if (visited[currentEndpoint] && visited[currentEndpoint].indexOf(choice) != -1) {
                                resetStoryView(json, true);
                            } else {
                                if (!visited[currentEndpoint]) {
                                    visited[currentEndpoint] = [];
                                }
                                visited[currentEndpoint].push(choice);
                                resetStoryView(json);
                            }
                            renderText();
                            changeScreenTo(storyScreen);
                        })
                        .catch(err => {
                            errorMessage.innerHTML = `An error occured while making the choice :(`;
                            changeScreenTo(errorScreen);
                        })
                }

                choiceContainer.appendChild(button);
            });
        }

        choiceContainer.style.display = 'inline';
    }

    function changeScreenTo(other) {
        activeScreen.style.display = 'none';
        other.style.display = 'inline';
        activeScreen = other;
    }

    function renderText() {
        textArea.innerHTML = text[currentIndex];
    }


    /* Init state */

    resetStoryView();
    renderText();
    activeScreen.style.display = 'inline';
}