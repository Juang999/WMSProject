const {config} = require('../config/environment');
const httpContext = require('express-http-context');
const {verify} = require('jsonwebtoken');

class Auth {
    user = (token) => {
        let {userid, usernama, password, groupid, user_ptnr_id, ptnrg_id} = verify(token, config.parsed.ACCESS_TOKEN_SECRET);
        return {userid, usernama, password, groupid, user_ptnr_id, ptnrg_id};
    }
}

module.exports = new Auth();