const jwt = require('jsonwebtoken')
const {config} = require('../../config/environment');
const {set} = require('express-http-context');

const authenticate = async (req, res, next) => {
	let authHeader = req.headers['authorization']
	let token = authHeader && authHeader.split(" ")[1]

	if (!token) {
		res.status(300)
			.json({
				status: 'error',
                message: 'Authorization Token not found',
                data: null,
                error: null
			})

		return
	}

    set('token', token);

    jwt.verify(token, config.parsed.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(400)
                .json({
                    code: 400,
                    status: 'failed',
                    error: err.message
                })

            return
        }

        next()
    })	
}

module.exports = authenticate