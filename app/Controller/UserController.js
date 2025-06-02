const jwt = require('jsonwebtoken');
const { config } = require('../../config/environment');
const { UserService } = require('../Services/ServiceContainer');
const { Authentication, Logging } = require('../../helper/helper');

class UserController {
	login = (req, res) => {
		UserService.findUserByUsername(req.body.usernama)
		.then(result => {
			
			if (!result || req.body.password != result.dataValues.password) {
				res.status(300)
					.json({
						status: 'failed',
						message: 'wrong username or password',
						token: null,
						error: 'wrong username or password'
					})

				return;
			}

			let token = jwt.sign(result.dataValues, config.parsed.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});

			Logging.info('LOGIN', `user ${result.dataValues.usernama} logged in!`, result.dataValues);

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					token,
					error: null
				})
		})
		.catch(err => {
			Logging.error('LOGIN', err.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					token: null,
					error: err.message
				})
		})
	}

	profile = (req, res) => {
		UserService.userProfile(Authentication.user().userid)
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get profile',
					profile: result
				})
		})
		.catch(err => {
			Logging.error('PROFILE', err.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get profile',
					error: err.message
				})
		})
	}

	getDataUser = (req, res) => {
		UserService.getDataUser()
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: err.message
				})
		})
	}
}

module.exports = new UserController()