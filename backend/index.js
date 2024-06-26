const express = require('express');
const path = require('path');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');
const fs = require('fs');

const api = require('./api');
const config = require('./config');
const User = require('../db/user');
const { AppExtensionsSDK, Command} = require('@pipedrive/app-extensions-sdk'); 
User.createTable();

const app = express();
const port = 3000;

passport.use(
    'pipedrive',
    new OAuth2Strategy({
            authorizationURL: 'https://oauth.pipedrive.com/oauth/authorize',
            tokenURL: 'https://oauth.pipedrive.com/oauth/token',
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userInfo = await api.getUser(accessToken);
                const user = await User.add(
                    userInfo.data.name,
                    accessToken,
                    refreshToken
                );
                done(null, { user });
            } catch (error) {
                done(error);
            }
        }
    )
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(async (req, res, next) => {
    req.user = await User.getById(1);
    next();
});

app.get('/auth/pipedrive', passport.authenticate('pipedrive'));

app.get('/auth/pipedrive/callback', (req, res, next) => {
    const authCode = req.query.code;
    const authHeader = Buffer.from(`${config.clientID}:${config.clientSecret}`).toString('base64');

    request.post({
        url: 'https://oauth.pipedrive.com/oauth/token',
        form: {
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: config.callbackURL
        },
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        strictSSL: false 
    }, async (error, response, body) => {
        if (error) {
            console.error('Error during token exchange:', error);
            return res.send(`Error: ${error.message}`);
        }

        const tokens = JSON.parse(body);
        if (tokens.error) {
            console.error('Error response from token exchange:', tokens.error);
            return res.send(`Error: ${tokens.error}`);
        }

        try {
            const userInfo = await api.getUser(tokens.access_token);
            const user = await User.add(
                userInfo.data.name,
                tokens.access_token,
                tokens.refresh_token
            );
            req.user = user;
            res.redirect('/');
        } catch (err) {
            console.error('Error during user data retrieval:', err);
            return res.send(`Error: ${err.message}`);
        }
    });
});

app.get('/', async (req, res) => {
    if (!req.user || req.user.length < 1) {
        return res.redirect('/auth/pipedrive');
    }

    try {
        const deals = await api.getDeals(req.user[0].access_token);

        res.render('deals', {
            name: req.user[0].username,
            deals: deals.data
        });
    } catch (error) {
        return res.send(error.message);
    }
});

app.get('/deals/:id', async (req, res) => {
    const randomBoolean = Math.random() >= 0.5;
    const outcome = randomBoolean === true ? 'won' : 'lost';

    try {
        await api.updateDeal(req.params.id, outcome, req.user[0].access_token);

        res.render('outcome', { outcome });
    } catch (error) {
        return res.send(error.message);
    }
});


app.get('/handle_action', (req, res) => {
    try {
        res.json({
            success: { 
                status: true, 
                message: 'It is work!' 
            },
            data: {}
        });
    } catch (error) {
        res.status(500).json({
           success: { 
                status: false,
                message: 'An error occurred'
            },
            error: error.message
        });
    }
});

const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(express.static(frontendPath));

app.get('/show-modal', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});




app.listen(port, () => console.log(`🟢 App has started. \n`));
