const { Octokit } = require("@octokit/core");
const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

router.get('/token', async (req, res, next) => {
    try {
        const code = req.query.code;
        const tokenCall = await axios.get(
            `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
        );
        const tokens = new URLSearchParams(tokenCall.data);
        if (tokens.get('access_token')) {
            res.status(200).json({ token: tokens.get('access_token') });
            return;
        }
        res.status(404).json({ message: 'Incorrect code' });
    } catch (error) {
        res.status(404).json({ message: 'Incorrect code' });
    }
});

router.get('/user', async (req, res, next) => {
    const token = req.query.token;
    const octokit = new Octokit({ auth: token });
    try {
        const result = await octokit.request('GET /user');
        res.status(200).json({ user: result });
    } catch (error) {
        res.status(404).json({ message: 'Cannot get the user' });
    }
});

router.post('/gist', async (req, res, next) => {
    const token = req.query.token;
    const gist = req.body;
    const octokit = new Octokit({ auth: token });
    const body = {
        description: gist.description,
        public: gist.private === 'public',
        files: {
            [gist.filename]: {
                content: gist.code,
            },
        },
    };
    try {
        const result = await octokit.request('POST /gists', body);
        if (result.status === 201) {
            res.status(201).json({ result });
            return;
        }
        res.status(result.status).json({ message: 'Could not create gist' });
    } catch (error) {
        // TODO: improve return
        return res.status(403).json({ message: '' });
    }
});

module.exports = router;