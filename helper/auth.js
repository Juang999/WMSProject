require('dotenv').config()

const {TConfUser, TConfGroup, PtnrMstr, EnMstr} = require('../models')
const jwt = require('jsonwebtoken')
const {Op} = require("sequelize")


const auth = async (token) => {
    let splittedToken = token && token.split(" ")[1]

    if (!splittedToken) {
        return
    }

    let dataProfile = await jwt.verify(splittedToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return
        }

        let decryptedUser = await TConfUser.findOne({
            attributes: [
                'userid', 
                'groupid', 'en_id', 
                'usernama','password', 
                'usernik','userpidgin', 
                'user_ptnr_id','nik_id',
                'useractive','useremail', 
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity',
                    attributes: ['en_desc']
                },{
                    model: TConfGroup,
                    as: "tconfgroup",
                    attributes: ["groupnama"]
                },{
                    model: PtnrMstr,
                    as: 'detail_partner',
                    attributes: ['ptnr_id', 'ptnr_dom_id', 'ptnr_en_id', 'ptnr_code', 'ptnr_name', 'ptnr_ptnrg_id']
                }
            ],
            where: {
                [Op.and]: [
                    {usernama: user['usernama']},
                    {password: user['password']}
                ]
            },
            raw: true,
            nest: true
        })

        return decryptedUser
    })

    return dataProfile
}

module.exports = auth