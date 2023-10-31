require('dotenv').config()
// package
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')
const {Op} = require('sequelize')
// model
const {TConfUser, TokenStorage, TConfGroup, Sequelize} = require('../../models')

class UserController {
	login = async (req, res) => {
		try {
			let getUserAccount = await TConfUser.findOne({
				attributes: ['usernama', 'password', 'userid', 'user_ptnr_id'],
				where: {
					usernama: req.body.usernama
				}
			})

			if (req.body.password != getUserAccount['password']) {
				res.status(300)
					.json({
						status: 'failed',
						data: null,
						error: 'wrong username or password!'
					})
				return
			}

			let token = await jwt.sign(getUserAccount['dataValues'], process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'})
			
			this.deleteOldToken(token, getUserAccount['dataValues']['userid'])

			res.status(200)
				.json({
					token: token
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					pesan: 'gagal untuk masuk',
					galat: error.message
				})
		}
	}

	profile = (req, res) => {
		let token = req.headers['authorization'].split(' ')[1]

		TConfUser.findOne({
			attributes: [
					'userid',
					'usernama',
					'groupid',
					[Sequelize.col('tconfgroup.groupnama'), 'groupnama'],
				],
			include: [
					{
						model: TConfGroup,
						as: 'tconfgroup',
						attributes: []
					}
				],
			where: {
				userid: {
					[Op.eq]: Sequelize.literal(`(SELECT token_user_id FROM public.token_storage WHERE token_token = '${token}')`)
				}
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get profile',
					profile: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get profile',
					error: err.message
				})
		})
	}

	deleteOldToken = async (token, userid) => {
		let currentToken = await TokenStorage.findOne({
			where: {
				token_user_id: userid
			}
		})

		if (currentToken) {
			await TokenStorage.destroy({
				where: {
					token_user_id: userid,
				}
			})
		}

		await TokenStorage.create({
			token_user_id: userid,
			token_token: token,
			token_oid: uuidv4()
		})
	}
}

module.exports = new UserController()