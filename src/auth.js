const mongoose = require('mongoose');
const md5 = require('md5')


let sessionUser = {};
let cookieKey = "sid";

const userSchema = require('./schema/userSchema');
const profileSchema = require('./schema/profileSchema');
const Users = mongoose.model('user', userSchema);
const Profiles = mongoose.model('profile', profileSchema);


const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

let allSids = 0;

function isLoggedIn(req, res, next) {
    if (!req.cookies) {
        return res.sendStatus(401);
    }

    let sessionKey = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sessionKey) {
        return res.sendStatus(401);
    }

    let userObj = sessionUser[sessionKey];
    if (!userObj) {
        return res.sendStatus(401);
    }
    let username = userObj.username;

    // no username mapped to sid
    if (username) {
        req.username = username;
        next();
    } else {
        return res.sendStatus(401);
    }
}

async function getUser(username) {
    let resp = await Users.findOne({username});
    return resp;
}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let resp = await (connector.then(() => {
        return getUser(username);
    }));

    if (!resp) {
        return res.sendStatus(401).send("User not exists")
    }

    let hash = md5(resp.salt + password);
    if (hash === resp.hash) {
        let sid = allSids;
        allSids++;
        const sessionKey = md5(sid + new Date().getTime() + resp.username)
        sessionUser[sessionKey] = resp
        res.cookie(cookieKey, sessionKey, {maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true})
        let msg = {username: username, result: 'success'};
        res.send(msg);
    } else {
        res.sendStatus(401);
    }
}

async function createUser(username, salt, hash) {
    return new Users({
        username: username,
        salt: salt,
        hash: hash
    }).save();
}

async function createProfile(username, email, zipcode, dob) {
    return new Profiles({
        username: username,
        email: email,
        zipcode: zipcode,
        dob: dob,
        headline: "This is my headline."
    }).save();
}

async function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400).send("Username or Password is Empty!");
    }

    let email = req.body.email;
    let zipcode = req.body.zipcode;
    let dob = req.body.dob;

    if (!email || !zipcode || !dob) {
        return res.sendStatus(400).send("Invalid registration info!");
    }
    let salt = username + new Date().getTime();
    let hash = md5(salt + password).toString();


    let resp = await (connector.then(() => {
        return createUser(username, salt, hash);
    }));
    console.log(resp);


    resp = await (connector.then(() => {
        return createProfile(username, email, zipcode, dob);
    }));
    console.log(resp);

    let msg = {username: username, result: 'success'};
    res.send(msg);
}

const logout = (req, res) => {
    if (req.cookies && req.cookies[cookieKey]) {
        delete sessionUser[req.cookies[cookieKey]]
    }
    res.status(200).send('OK')
}

module.exports = (app) => {
    app.post('/login', login);
    app.post('/register', register);
    app.put('/logout', logout);
    app.use(isLoggedIn);
}
