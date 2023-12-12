// package & helper
const {Auth, Query} = require('../../helper/helper')
const moment = require('moment')
const {v4: uuidv4} = require('uuid')

// models
const {
    MvSublocHistory,
    InvcdDet,LocsMstr 
} = require('../../models')

class MoveLocationController {
    moveToDestinationLocation = async (req, res) => {
        try {
            // console.log(JSON.parse(req.body.bulkData))
            let bulkRequests = JSON.parse(req.body.bulkData)

            let {usernama} = await Auth(req.headers['authorization'])

            var arrayHistory = []

            for (let bulkRequest of bulkRequests) {
                // create new object to update or create data
                let objectParameterUpdate = {
                    prevQty: bulkRequest['prevQty'],
                    qtyToMove: bulkRequest['qtyToMove'],
                    username: usernama,
                    ptId: bulkRequest['ptId'],
                    enId: bulkRequest['enId'],
                    startSublocation: bulkRequest['startingSublocation'],
                    sublocationDestination: bulkRequest['destinationSublocation']
                }

                await this.updateQtyProduct(objectParameterUpdate)

                // push parsed bulk request into array to create history
                arrayHistory.push({
                            mvsubloc_oid: uuidv4(),
                            mvsubloc_add_by: usernama,
                            mvsubloc_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                            mvsubloc_summary: bulkRequest['summary'],
                            mvsubloc_desc: bulkRequest['desc'],
                            mvsubloc_use_git: bulkRequest['isGit'],
                            mvsubloc_pt_id: bulkRequest['ptId'],
                            mvsubloc_qty: bulkRequest['qtyToMove'],
                            mvsubloc_locs_from: bulkRequest['startingSublocation'],
                            mvsubloc_locs_git: (bulkRequest['isGit'] == 'Y') ? bulkRequest['idGit'] : null,
                            mvsubloc_locs_to: bulkRequest['destinationSublocation']
                        })
            }

            let result = await MvSublocHistory.bulkCreate(arrayHistory, {
                logging: (sql) => {
                    Query.queryBulkCreate(sql)
                }
            })

            res.status(200)
                .json({
                    status: 'success',
                    data: result,
                    error: null
                })
        } catch (error) {
            res.status(200)
                .json({
                    status: 'failed',
                    data: null,
                    error: error.message
                })
        }
    }

    updateQtyProduct = async (objectParameter) => {
        // get previous qty in sublocation destination
        let {invcd_oid: invcdOid, invcd_qty: preminilaryQty} = await InvcdDet.findOne({attributes: ['invcd_oid', 'invcd_qty'], where: {invcd_pt_id: objectParameter['ptId'], invcd_locs_id: objectParameter['sublocationDestination']}})

        // update qty in invcd_det table 
        // update qty in previous sublocation
        let qtyAfterReduced = parseInt(objectParameter['prevQty']) - parseInt(objectParameter['qtyToMove'])
        let updateQtyPrevSubloc = await InvcdDet.update({
            invcd_qty: qtyAfterReduced,
            invcd_upd_by: objectParameter['username'],
            invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                invcd_pt_id: objectParameter['ptId'],
                invcd_locs_id: objectParameter['startSublocation']
            },
            logging: (sql, queryCommand) => {
                let bind = queryCommand.bind

                Query.insert(sql, {
                    bind: {
                        $1: bind[0],
                        $2: bind[1],
                        $3: bind[2],
                        $4: bind[3],
                        $5: bind[4],
                    }
                })
            }
        })

        // update qty in sublocation after
        let AdditionQty = (preminilaryQty) ? parseInt(preminilaryQty) + parseInt(objectParameter['qtyToMove']) : parseInt(objectParameter['qtyToMove'])

        if (invcdOid == null) {
            await InvcdDet.create({
                invcd_oid: uuidv4(),
                invcd_en_id: objectParameter['enId'],
                invcd_pt_id: objectParameter['ptId'],
                invcd_qty: AdditionQty,
                invcd_locs_id: objectParameter['destinationSublocation'],
                invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                invcd_add_by: objectParameter['username']
            }, {
                logging: (sql, queryCommand) => {
                let bind = queryCommand.bind

                Query.insert(sql, {
                    bind: {
                        $1: bind[0],
                        $2: bind[1],
                        $3: bind[2],
                        $4: bind[3],
                        $5: bind[4],
                        $6: bind[5],
                        $7: bind[6],
                    }
                })
            }
            })
        } else {
            await InvcdDet.update({
                invcd_qty: AdditionQty,
                invcd_upd_by: objectParameter['username'],
                invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    invcd_oid: invcdOid
                },
                logging: (sql, queryCommand) => {
                    let bind = queryCommand.bind

                    Query.insert(sql, {
                        bind: {
                            $1: bind[0],
                            $2: bind[1],
                            $3: bind[2],
                            $4: bind[3]
                        }
                    })
                }
            })
        }

        return
    }
}

module.exports = new MoveLocationController()