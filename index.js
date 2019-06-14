// Import express and request modules
let express = require('express');
let request = require('request');

// Store our app's ID and Secret. These we got from Step 1 (Your app's Basic Information page).
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to store them securely in environment variables.

let clientId = '<YOUR_CLIENT_ID>';
let clientSecret = '<YOUR_CLIENT_SECRET>';

// // Store your OAuth Access Token and Channel ID
let token = '<YOUR_OAUTH_TOKEN>';
let channel = '<YOUR_CHANNEL_ID>';

// Instantiates Express and assigns our app variable to it
let app = express();


// Again, we define a port we want to listen to
const PORT = 4390;

// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});


// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function (req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function (req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

// This route handles a post request to /history, which can be triggered by a slack command of your choice
// Slack command Request URL should point to http://7ed7110a.ngrok.io/history or your equivalent
app.post('/history', function (req, res) {
    let history;
    // Make a call to Slack API to get post history
    request({
        url: 'https://slack.com/api/channels.history',
        qs: {
            token: token,
            channel: channel
        },
        method: 'GET'
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            history = JSON.parse(body);
            console.log(history);
            res.status(200).send('History retrieved! :sunglasses:');
        }
    })
});

// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
app.post('/command', function (req, res) {
    res.send('Your ngrok tunnel is up and running!');
});