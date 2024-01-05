// package & helper
const {Auth, Query} = require('../../helper/helper')
const moment = require('moment')
const {v4: uuidv4} = require('uuid')
const {Op} = require('sequelize')

// models
const {
    sequelize,
    MvSublocHistory,
    InvcdDet,LocsMstr, Sequelize
} = require('../../models')

/*
* MoveLocationController only accomodate two methods, and only one method that used for API
*/

class MoveLocationController {
    moveToDestinationLocation = async (req, res) => {
        let transaction = await sequelize.transaction();

        try {
            // parse bulk requests into JSON
            let bulkRequests = JSON.parse(req.body.bulkData)
            // GET data username from user
            let {usernama} = await Auth(req.headers['authorization'])
            // empty array to accomodate data history move sublocation
            var arrayHistory = []

            for (let bulkRequest of bulkRequests) {
                // method to update or create data quantity sublocation
                bulkRequest['username'] = usernama
                await this.updateQtyProduct(bulkRequest)

                // push parsed bulk request into array to create history
                arrayHistory.push({
                            mvsubloc_oid: uuidv4(),
                            mvsubloc_add_by: usernama,
                            mvsubloc_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                            mvsubloc_summary: bulkRequest['summary'],
                            mvsubloc_desc: bulkRequest['desc'],
                            mvsubloc_use_git: bulkRequest['useGit'],
                            mvsubloc_pt_id: bulkRequest['ptId'],
                            mvsubloc_qty: bulkRequest['qtyToMove'],
                            mvsubloc_locs_from: bulkRequest['startingSublocation'],
                            mvsubloc_locs_git: (bulkRequest['useGit'] == 'Y') ? bulkRequest['idGit'] : null,
                            mvsubloc_locs_to: bulkRequest['destinationSublocation']
                        });
            }

            let CREATE_HISTORY_MOVE_SUBLOCATION = await MvSublocHistory.bulkCreate(arrayHistory, {
                logging: (sql) => {
                    Query.queryBulkCreate(sql)
                }
            })

            await transaction.commit()

            res.status(200)
                .json({
                    status: 'success',
                    data: CREATE_HISTORY_MOVE_SUBLOCATION,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            res.status(400)
                .json({
                    status: 'failed',
                    data: null,
                    error: error.message
                })
        }
    }

    /*
    * the method below is used for helper
    */

    updateQtyProduct = async (objectParameter) => {
        // get previous qty in sublocation destination
        let dataSublocationDestination = await this.#GET_DATA_SUBLOCATION_DESTINATION(objectParameter)
        let {qty_after_substraction, qty_after_addition} = this.#getQty(objectParameter, dataSublocationDestination)

        // promise to run all query
        await Promise.all([
            this.#UPDATE_DATA_STARTING_SUBLOCATION({
                sublocation_object_parameter: objectParameter,
                sublocation_quantity_substraction: qty_after_substraction,
            }), 
            this.#UPDATE_DATA_SUBLOCATION_DESTINATION({
                sublocation_quantity: qty_after_addition,
                sublocation_object_parameter: objectParameter,
                sublocation_destination: dataSublocationDestination,
            })
        ])

        return
    }

    #getQty (objectParameter, DATA_START_SUBLOCATION) {
        let QTY_AFTER_SUBSTRACTION = parseInt(objectParameter['prevQty']) - parseInt(objectParameter['qtyToMove'])
        let QTY_AFTER_ADDITION = (DATA_START_SUBLOCATION) 
                            ? parseInt(DATA_START_SUBLOCATION['dataValues']['preminilaryQty']) + parseInt(objectParameter['qtyToMove']) 
                            : parseInt(objectParameter['qtyToMove'])

        return {
            qty_after_substraction: QTY_AFTER_SUBSTRACTION,
            qty_after_addition: QTY_AFTER_ADDITION
        }
    }

    async #UPDATE_DATA_STARTING_SUBLOCATION (parameter) {
        await InvcdDet.update({
            invcd_qty: parameter['sublocation_quantity_substraction'],
            invcd_upd_by: parameter['sublocation_object_parameter']['username'],
            invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                invcd_pt_id: parameter['sublocation_object_parameter']['ptId'],
                invcd_locs_id: parameter['sublocation_object_parameter']['startingSublocation']
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
    }

    async #UPDATE_DATA_SUBLOCATION_DESTINATION (parameter) {
        if (parameter['sublocation_destination'] == null) {
            await InvcdDet.create({
                    invcd_oid: uuidv4(),
                    invcd_en_id: parameter['sublocation_object_parameter']['enId'],
                    invcd_pt_id: parameter['sublocation_object_parameter']['ptId'],
                    invcd_qty: parameter['sublocation_quantity'],
                    invcd_locs_id: parameter['sublocation_object_parameter']['destinationSublocation'],
                    invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    invcd_add_by: parameter['sublocation_object_parameter']['username']
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
                invcd_qty: parameter['sublocation_quantity'],
                invcd_upd_by: parameter['sublocation_object_parameter']['username'],
                invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    invcd_oid: parameter['sublocation_destination']['dataValues']['invcdOid']
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
    }

    async #GET_DATA_SUBLOCATION_DESTINATION (PTID_AND_SUBLOCATION_DESTINATION) {
        let startSublocation = await InvcdDet.findOne({
            attributes: [
                ['invcd_oid', 'invcdOid'], 
                ['invcd_qty', 'preminilaryQty']
            ], 
            where: {
                invcd_pt_id: PTID_AND_SUBLOCATION_DESTINATION['ptId'],
                invcd_locs_id: PTID_AND_SUBLOCATION_DESTINATION['destinationSublocation']
            }
        })

        return startSublocation
    }
}

module.exports = new MoveLocationController()