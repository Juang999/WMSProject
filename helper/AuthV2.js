const { get } = require('express-http-context');

class Auth {
    static async user (token) {
        let dataProfile = get('user');

        return dataProfile;
    }
}

module.exports = new Auth()