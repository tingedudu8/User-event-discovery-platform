const mongoose = require('mongoose');

const profileSchema = require('./schema/profileSchema');
const Profiles = mongoose.model('profile', profileSchema);

const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})

const getHeadLines = async  (req, res) => {
    // req.username = "Bret"
    let user = req.params.user ? req.params.user : req.username;
    await (connector.then(() => {
        Profiles.findOne(
            {username: user},
            null,
            null,
            function(err, profile){
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                return  res.status(200).send({username: user, headline: profile.headline})
            })
    }));
}


const putHeadLines = async (req, res) => {
    // req.username = "Bret"
    await (connector.then(() => {
        Profiles.findOneAndUpdate(
            {username: req.username},
            {$set: {headline: req.body.headline}},
            {new: true},
            function(err, profile) {
                if(err){
                    console.log(err);
                    return res.send(err);
                }
                return res.status(200).send({username: profile.username, headline: profile.headline})
            }
        )
    }));
}


const getEmail = async (req, res) => {
    // req.username = "Bret"
    let user = req.params.user ? req.params.user : req.username;

    await (connector.then(() => {
        Profiles.findOne(
            {username: user},
            null,
            null,
            function(err, profile){
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                if (profile) {
                    return res.status(200).send({username: user, email: profile.email})
                } else {
                    return res.status(404).send("User not exits!")
                }
            })
    }));
}


const validateEmail = {
    validate: (email) => {
        return (/\w+@\w+[.]\w+$/).test(email)
    },
    errorMsg: "Invalid email address!"
}


const putEmail = async (req, res) => {
    // req.username = "Bret"
    let email = req.body.email
    if (!validateEmail.validate(email)) {
        return res.status(400).send(validateEmail.errorMsg)
    }

    await (connector.then(() => {
        Profiles.findOneAndUpdate(
            {username: req.username},
            {$set: {email: email}},
            {new: true},
            function(err, profile) {
                if(err){
                    console.log(err);
                    return res.send(err);
                }
                return res.status(200).send({username: profile.username, email: profile.email})
            }
        )
    }));
}


const getZipcode = async (req, res) => {
    // req.username = "Bret"
    let user = req.params.user ? req.params.user : req.username;
    await (connector.then(() => {
        Profiles.findOne(
            {username: user},
            null,
            null,
            function(err, profile){
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                if (profile) {
                    return res.status(200).send({username: user, zipcode: profile.zipcode})
                } else {
                    return res.status(404).send("User not exits!")
                }
            })
    }));
}


const validateZipcode = {
    validate: (zipcode) => {
        return (/^\d{5}$/).test(zipcode)
    },
    errorMsg: "Invalid zipcode!"
}


const putZipcode = async (req, res) => {
    // req.username = "Bret"
    let zipcode = req.body.zipcode
    if (!validateZipcode.validate(zipcode)) {
        return res.status(400).send(validateZipcode.errorMsg)
    }
    await (connector.then(() => {
        Profiles.findOneAndUpdate(
            {username: req.username},
            {$set: {zipcode: zipcode}},
            {new: true},
            function(err, profile) {
                if(err){
                    console.log(err);
                    return res.send(err);
                }
                return res.status(200).send({username: profile.username, zipcode: profile.zipcode})
            }
        )
    }));
}


const getDob = async (req, res) => {
    // req.username = "Bret"
    let user = req.username;
    await (connector.then(() => {
        Profiles.findOne(
            {username: user},
            null,
            null,
            function(err, profile){
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                if (profile) {
                    return res.status(200).send({username: user, dob: profile.dob})
                } else {
                    return res.status(404).send("User not exits!")
                }
            })
    }));
}


const getAvatar = async (req, res) => {
    // req.username = "Bret"
    let user = req.params.user ? req.params.user : req.username;
    await (connector.then(() => {
        Profiles.findOne(
            {username: user},
            null,
            null,
            function(err, profile){
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                if (profile) {
                    return res.status(200).send({username: user, avatar: profile.avatar})
                } else {
                    return res.status(404).send("User not exits!")
                }
            })
    }));
}


const putAvatar = async (req, res) => {
    // req.username = "Bret"
    let avatar = req.body.avatar
    await (connector.then(() => {
        Profiles.findOneAndUpdate(
            {username: req.username},
            {$set: {avatar: avatar}},
            {new: true},
            function(err, profile) {
                if(err){
                    console.log(err);
                    return res.send(err);
                }
                return res.status(200).send({username: profile.username, avatar: profile.avatar})
            }
        )
    }));
}


module.exports = app => {
    app.get('/headline/:user?', getHeadLines)
    app.put('/headline', putHeadLines)

    app.get('/email/:user?', getEmail)
    app.put('/email', putEmail)

    app.get('/zipcode/:user?', getZipcode)
    app.put('/zipcode', putZipcode)

    app.get('/avatar/:user?', getAvatar)
    app.put('/avatar', putAvatar)

    app.get('/dob', getDob)
}
