const { get } = require('express-http-context');

class Auth {
    user = () => {
        let dataProfile = get('user');

        return dataProfile;
    }
}

module.exports = new Auth()