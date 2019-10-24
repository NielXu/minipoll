const express = require('express');
const path = require('path');
const shortid = require('shortid');
const { init, get, insert, default_dbname } = require('./database');
const app = express();

CREATE_REQUIRED = {
    "title": "string",
    "options": "object"
}
CREATE_OPTIONAL = {
    "description": "string",
    "password": "string"
}

app.use(express.static(path.join(__dirname, 'static/')));
app.use(express.json());
app.get('/status', async(req, res, next) => {
    let result = {status: 'Success'};
    try {
        await db.test();
    }
    catch(e) {
        result = {
            status: 'Failed',
            error: e.message
        }
    }
    res.json(result);
});

/**
 * Creating a new room, the room id will be randomly
 * generate and should not have duplicated. It contains
 * 5 letters. If creating a private room, a password
 * is also required in the request.
 * 
 * request body
 * ------------
 * title: Title of the poll
 * description: Descroption of the poll (optional)
 * options: List of options (At least 2)
 * password: Password of this room (optional, only required in private room)
 * 
 * response body (Success)
 * ------------
 * rid: Room ID
 * message: 'Success'
 * 
 * response body (Failed)
 * ------------
 * message: Error message
 */
app.post('/create', (req, res, next) => {
    res.header('Content-Type', 'application/json');
    const result = checkRequest(req.body, CREATE_REQUIRED, CREATE_OPTIONAL);
    if(!result.valid) {
        return res.status(400).json({message: result.message});
    }
    if(!checkOptions(req.body.options)) {
        return res.status(400).json({message: 'Invalid options'});
    }
    const doc = {
        options: processOptions(req.body.options),
        rid: shortid.generate(),
        title: req.body.title,
        description: req.body.description? req.body.description: "",
        password: req.body.password? req.body.password: "",
    }
    insert(default_dbname, "polls", [doc], function(err, result) {
        if(err) {
            return res.status(500).json({message: 'Server side error', error: err});
        }
        return res.json({message: 'Success', rid: doc.rid});
    })
})

app.get('/:rid', (req, res, next) => {
    res.header('Content-Type', 'application/json');
    const rid = req.params.rid;
    get(default_dbname, 'polls', {rid: rid}, function(err, result) {
        if(err) {
            return res.status(500).json({message: 'Server side error', error: err});
        }
        if(result.length === 0) {
            return res.json({message: 'Room not found with given id'});
        }
        else if(result.length > 1) {
            console.log(`Collision happened with room id: ${rid}`);
            return res.status(500).json({message: 'Server side error', error: 'Collision'});
        }
        else {
            return res.json({data: result[0]});
        }
    })
})

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

/**
 * Check if the request if valid.
 * 
 * @param {Object} body Body of request
 * @param {Array} required Array of required fields
 * @param {Array} optional Array of optional fields
 */
function checkRequest(body, required, optional) {
    if(!body) {
        return {valid: false, message: `Missing body`}
    }
    for(key in required) {
        if(!body.hasOwnProperty(key)) {
            return {valid: false, message: `Missing key: ${key}`}
        }
        if(typeof(body[key]) != required[key]) {
            return {valid: false, message: `Expect ${required[key]} for ${key}`}
        }
    }
    for(key in body) {
        if(!required.hasOwnProperty(key) && !optional.hasOwnProperty(key)) {
            return {valid: false, message: `Unknown key: ${key}`}
        }
        if(optional.hasOwnProperty(key) && typeof(body[key]) != optional[key]) {
            return {valid: false, message: `Expect ${optional[key]} for ${key}`}
        }
    }
    return {valid: true}
}

/**
 * Check number of options
 * 
 * @param {Array} options Check if there are at least two options
 */
function checkOptions(options) {
    return options.length >= 2
}

/**
 * Set default values to options
 * 
 * @param {Array} options Process the options, set default values
 */
function processOptions(options) {
    let proc = {};
    for(var i=0;i<options.length;i++) {
        proc[options[i]] = 0;
    }
    return proc
}

/**
 * Start listening to port 5000 after database initialization
 */
init(function() {
    console.log("Starting server");
    app.listen(5000);
})
