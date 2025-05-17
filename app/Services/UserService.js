const {TConfUser, Sequelize} = require('../../models');
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
                ['usernama', 'username']
            ],
            where: {
                userid: userId
            }
        })

        return result;
    }
}

module.exports = new UserService();