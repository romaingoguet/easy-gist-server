const axios = require('axios');

/**
 * Get token from Github Oauth
 * @param {string} code 
 * @returns 
 */
async function getToken(code) {
    const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;
    const tokenCall = await axios.get(url);
    const tokens = new URLSearchParams(tokenCall.data);
    console.log(url);
    console.log(tokens);
    return tokens.get('access_token');
}

/**
 * Get user from Github
 * @param {Octokit} octokit 
 * @returns 
 */
async function getUser(octokit) {
    const user = await octokit.request('GET /user');
    return user;
}

/**
 * Post gist on Github Gist 
 * @param {object} gist 
 * @param {Octokit} octokit 
 * @returns 
 */
async function postGist(gist, octokit) {
    const result = await octokit.request('POST /gists', gist);
    return result;
}

module.exports = {
    getToken,
    getUser,
    postGist
}