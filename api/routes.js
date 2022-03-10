const { Octokit } = require("@octokit/core");
const express = require('express');
const router = express.Router();

const { getToken, getUser, postGist } = require("../services/github");

require('dotenv').config();

router.get('/token', async (req, res, next) => {
    try {
        const code = req.query.code;
        const token = await getToken(code);
        if (token !== '') {
            res.status(200).json({ token });
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
        const result = await getUser(octokit);
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
        const result = await postGist(body, octokit);
        if (result.status === 201) {
            res.status(201).json({ result });
            return;
        }
        res.status(result.status).json({ message: 'Could not create gist' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;