// import modules
var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var cors = require("cors");
var path = require("path");
const checkJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// setup express
const app = express();
const port = process.env.PORT || 8080;
const appName = "Suggestion-box";

//implement middleware
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cors());
app.use(express.static('../client/build'));


const Db = require('./suggestion_db')(mongoose);


let openPaths = [
    {url: '/api/users/authenticate', methods: ['POST'],
    },
    { url: '/api/suggestions' , methods: ['GET'],
    },
    { url: '/api/suggestions/:id' , methods: ['POST'],
    }
];

const secret = process.env.SECRET || "brolly";
app.use(checkJwt({ secret: secret }).unless({ path : openPaths }));

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { // If the user didn't authorize correctly
        res.status(401).json({error: err.message}); // Return 401 with error message.
    } else {
        next(); // If no errors, forward request to next middleware or route
    }
});

Db.userModel.find({}, function(err, user) {
    user.forEach(async user => {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) reject(err); else resolve(hash);

            });
        });

        delete user.password;
        this.password = hashedPassword; // The hash has been made, and is stored on the user object.
        // Let's remove the clear text password (it shouldn't be there in the first place)
        console.log(`Hash generated for ${user.password}:`, user); // Logging for debugging purposes
    });

});



//routes
app.post('/api/users/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        let msg = "Username or password missing!";
        console.error(msg);
        res.status(401).json({msg: msg});
        return;
    }

    Db.userModel.findOne({username:username }, function (error , user) {
        if(user) { bcrypt.compare(password, this.password, (err, result) => {
            if (result) { // If the password matched
                const payload = {username: username};
                const token = jwt.sign(payload, secret, {expiresIn: '1h'});
                res.json({
                    msg: `User '${username}' authenticated successfully`,
                    token: token
                });
            } else res.status(401).json({msg: `Password mismatch!`})
        });
    }
        else {
            res.status(404).json({msg: "User not found!"});
        }
    });

});

app.get('/api/suggestions/' , async (req,res) => {
    const suggestions = await Db.getSuggestions();
    console.log(suggestions);
    res.json(suggestions)
});


app.get('/api/suggestions/:id' , async (req,res) => {
    let id = req.params.id;
    const suggestion = await Db.getSuggestions(id);
     res.json(suggestion);
});

app.post('/api/suggestions/:id', async (req,res) => {
    let id = req.params.id;
    let username = req.body.username;
    const newSignature = await Db.postSignature(id, username);
    console.log(newSignature);
    res.json(newSignature);


});

app.post('/api/new/:user', async (req, res) => {
    let suggestion = req.body.suggestion;
    let desc = req.body.desc;
    let user = req.params.user;

    let theSuggestion = {
        suggestion: suggestion,
        desc:desc,
        submitted: Date.now(),
        fullname:user,
        signature: [{username: "Initial" , time:Date.now()}]
    };
    const newSuggestion = await Db.createSuggestion(theSuggestion);
    res.json(newSuggestion);
});

app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);


const url = process.env.MONGO_URL ;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(async () => {
     //   await Db.populateDb();
     // await Db.populateDb2();
        await app.listen(port); // Start the API
        console.log(`Question API running on port ${port}!`);
    })
    .catch(error => console.error(error));
