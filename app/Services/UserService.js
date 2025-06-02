const {TConfUser, TConfGroup, Sequelize} = require('../../models');
const {Op} = require('sequelize');

class UserService {
    findUserByOpnameCode = async (opnameCode) => {
        let result = await TConfUser.findOne({
            attributes: ['userid', 'usernama'],
            where: {
                userid: {
                    [Op.eq]: Sequelize.literal(`(SELECT som_user_id FROM public.som_mstr WHERE som_code = '${opnameCode}')`)
                }
            }
        })

        return result.dataValues;
    }

    userProfile = async (userId) => {
        let result = await TConfUser.findOne({
			attributes: [
					'userid',
					'usernama',
					['usernama', 'username'],
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
				userid: userId
			},
		});

        return result;
    }

    findUserByUsername = async (username) => {
        let result = await TConfUser.findOne({
			attributes: ['usernama', 'password', 'userid', 'user_ptnr_id'],
			where: {
				usernama: username
			},
		})

        return result;
    }

	getDataUser = async () => {
		let result = await TConfUser.findAll({
			attributes: [
				['userid', 'id'],
				['usernama', 'username']
			],
			order: [
				['userid', 'ASC']
			]
		});

		return result;
	}
}

module.exports = new UserService();