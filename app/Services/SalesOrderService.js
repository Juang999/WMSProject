const {
    SodasAssembly,
    PiMstr, BkMstr,
    CcMstr, CuMstr,
    AcMstr, SbMstr, 
    EnMstr, SiMstr,
    PtnrMstr, PtMstr, 
    TranMstr, SoaAttr,
    SodDet, Sequelize,
    LocMstr, CodeMstr,
    SokpPiutang, PtnrgGrp,
    SoMstr, SoShipdsSerial,
    TransStatus, SodsSerial,
} = require('../../models');
const {v4: uuidv4} = require("uuid");
const moment = require('moment');
const {Op, SequelizeScopeError, where} = require('sequelize');

class SalesOrderService {
    getHeaderSalesOrder = async (salesOrderCode, buyerName, salesName, status, year) => {
        let result = await SoMstr.findAll({
            attributes: [
                'so_oid',
                'so_code',
                [Sequelize.col(`"buyer"."ptnr_name"`), 'partner_name'],
                [Sequelize.col(`"sales"."ptnr_name"`), 'sales_person'],
                ['so_trans_id', 'status_code'],
                [Sequelize.col(`"status_so"."trans_desc"`), 'status'],
                ['so_add_date', 'created_at'],
            ],
            include: [
                {
                    model: PtnrMstr,
                    as: 'buyer',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'sales',
                    attributes: []
                }, {
                    model: TransStatus,
                    as: 'status_so',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col(`"buyer"."ptnr_name"`), {
                        [Op.iLike]: `%${buyerName}%`
                    }),
                    Sequelize.where(Sequelize.col(`"sales"."ptnr_name"`), {
                        [Op.iLike]: `%${salesName}%`
                    }),
                    Sequelize.where(Sequelize.col(`so_code`), {
                        [Op.iLike]: `%${salesOrderCode}`
                    }),
                    Sequelize.where(Sequelize.col(`so_trans_id`), {
                        [Op.iLike]: `%${status}%`
                    }),
                    Sequelize.where(Sequelize.literal(`year(so_add_date)`), {
                        [Op.eq]: year
                    }),
                ]
            },
            order: [
                ['so_trans_id', 'DESC'],
                ['created_at', 'DESC'],
            ]
        });

        return result;
    }

    getDetailSalesOrder = async (salesOrderCode) => {
        let result = await SoMstr.findAll({
            attributes: [
                'so_oid',
                'so_sq_ref_oid',
                ['so_code', 'sales_order_code'],
                ['so_sq_ref_code', 'sales_quotation_code'],
                [Sequelize.literal(`"buyer"."ptnr_name"`), 'sold_to'],
                ['so_date', 'date'],
                ['so_booking', 'book'],
                ['so_cons', 'consigment'],
                ['so_trans_id', 'trans_id'],
                [Sequelize.literal(`"status_so"."trans_desc"`), 'status'],
                ['so_alocated', 'preorder'],
                ['so_add_by', 'created_by'],
                ['so_add_date', 'created_date']
            ],
            include: [
                {
                    model: TransStatus,
                    as: 'status_so',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'buyer',
                    attributes: []
                }, {
                    model: SodDet,
                    as: 'detail_sales_order',
                    attributes: [
                        'sod_oid',
                        'sod_sqd_oid',
                        ['sod_loc_id', 'location_id'],
                        ['sod_pt_id', 'product_id'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`), 'product_code'],
                        [Sequelize.literal(`CAST(sod_qty AS INTEGER)`), 'qty_open'],
                        [Sequelize.literal(`CASE WHEN SUM("detail_sales_order->singular_serial_sales_order"."sods_qty") IS NULL THEN 0 ELSE SUM("detail_sales_order->singular_serial_sales_order"."sods_qty") END`), 'qty_scanned']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: SodsSerial,
                            as: 'singular_serial_sales_order',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                so_code: salesOrderCode,
                // so_trans_id: 'W'
            },
            group: [
                'so_oid',
                'so_sq_ref_oid',
                'sales_order_code',
                'sales_quotation_code',
                'sold_to',
                'sod_oid',
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`),
                Sequelize.literal(`"status_so"."trans_desc"`)
            ],
            subQuery: false
        })

        return result[0];
    }

    checkDetailSalesOrder = async (so_oid, product_code) => {
        let result = await SodDet.findOne({
            attributes: ['sod_pt_id'],
            include: [
                {
                    model: PtMstr,
                    as: 'detail_product',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col(`"sod_so_oid"`), {
                        [Op.eq]: so_oid
                    }),
                    Sequelize.where(Sequelize.col(`"detail_product"."pt_code"`), {
                        [Op.eq]: product_code
                    })
                ]
            },
        });

        return result;
    }

    checkSerialSalesOrder = async (sod_oid, serial) => {
        let result = await SodsSerial.findOne({
            attributes: ['sods_oid', 'sods_qty', 'sods_serial'],
            where: {
                sods_sod_oid: sod_oid,
                sods_serial: serial
            },
        })

        return result;
    }

    countSerialSalesOrder = async (sod_oid) => {
        let result = await SodsSerial.count({
            where: {
                sods_sod_oid: sod_oid
            },
        })

        return result;
    }

    findDetailSalesOrder = async (sodOid) => {
        let {dataValues} = await SodDet.findOne({
            attributes: [
                'sod_pt_id',
                'sod_loc_id',
                'sod_invc_oid',
                'sod_so_oid',
                [Sequelize.col(`header_sales_order.so_trans_id`), 'transaction_id'],
                [Sequelize.literal('CAST(sod_qty AS INTEGER)'), 'sod_qty'],
            ],
            include: [
                {
                    model: SoMstr,
                    as: 'header_sales_order',
                    attributes: []
                }
            ],
            where: {
                sod_oid: sodOid
            }
        })

        return dataValues;
    }

    deleteDetailSalesOrder = async (sodOid, transaction) => {
        await SodDet.destroy({
            where: {
                sod_oid: sodOid
            },
            transaction
        });
    }

    retrieveTotalPrice = async ( headerSalesOrderOid ) => {
        let result = await SodDet.findAll({
            attributes: [
                [Sequelize.literal(`ROUND(SUM((sod_price * sod_qty) - (sod_price * sod_disc * sod_qty)), 2)`), 'total_price']
            ],
            where: {
                sod_so_oid: headerSalesOrderOid
            }
        });

        return result;
    }

    insertSerialSalesOrder = async (body, dataSerial, username, transaction) => {
        let sequence = await this.totalSerialBySodOid(body.sod_oid);

        let result = await SodsSerial.create({
            sods_oid: uuidv4(),
            sods_sod_oid: body.sod_oid,
            sods_qty: parseInt(dataSerial.qty),
            sods_loc_id: body.location_id,
            sods_si_id: 992,
            sods_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            sods_serial: body.serial,
            sods_seq: sequence,
            sods_add_by: username,
            sods_pt_id: dataSerial.invcd_pt_id,
            sods_locs_id: dataSerial.invcd_locs_id
        }, {
            transaction,
        })

        return result;
    }

    totalSerialBySodOid = async (sod_oid, transaction) => {
        let result = await SodsSerial.count({
            where: {
                sods_sod_oid: sod_oid
            },
            transaction
        })

        return result + 1;
    }

    getSerialProductSalesOrder = async (sodOid) => {
        let result = await SodDet.findOne({
            attributes: [
                [Sequelize.col(`"detail_product"."pt_id"`), 'product_id'],
                [Sequelize.col(`"detail_product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"detail_product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"header_sales_order"."so_code"`), 'salesorder_code']
            ],
            include: [
                {
                    model: SoMstr,
                    as: 'header_sales_order',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'detail_product',
                    attributes: []
                }, {
                    model: SodsSerial,
                    as: 'serial_sales_order',
                    attributes: [
                        'sods_oid',
                        ['sods_serial', 'serial']
                    ]
                }
            ],
            subQuery: false,
            where: {
                sod_oid: sodOid
            },
        })

        return result;
    }

    deleteSerialShipment = async (sodsOid, transaction) => {
        await SodsSerial.destroy({
            where: {
                sods_oid: sodsOid
            },
            transaction
        })
    }

    getSalesOrderOid = async (sodOid) => {
        let result = await SodDet.findOne({
            attributes: ['sod_so_oid'],
            where: {
                sod_oid: sodOid
            }
        })

        return result;
    }

    findDataHeaderSalesOrder = async (soOid) => {
        let result = await SoMstr.findOne({
            attributes: ['so_oid', 'so_code', 'so_trans_id'],
            where: {
                so_oid: soOid
            }
        })

        return result;
    }

    findHeaderSOBySerial = async (sodsOid) => {
        let result = await SoMstr.findOne({
            attributes: ['so_oid', 'so_code', 'so_trans_id'],
            where: {
                so_oid: {
                    [Op.eq]: Sequelize.literal(`( SELECT sod_so_oid FROM public.sod_det WHERE sod_oid = ( SELECT sods_sod_oid FROM public.sods_serial WHERE sods_oid = :sods_oid ) )`)
                }
            },
            replacements: {
                sods_oid: sodsOid
            }
        });

        return result;
    }

    retrieveSalesOrderNumber = async ( entityId, search, startDate, endDate ) => {
        let result = await SoMstr.findAll({
            attributes: [
                'so_oid',
                [Sequelize.col(`entity_relation.en_desc`), 'entity'],
                ['so_code', 'so_number'],
                'so_date',
                [Sequelize.col(`buyer.ptnr_name`), 'customer']
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'buyer',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.col(`so_en_id`), {
                    [Op.eq]: entityId
                }),
                Sequelize.where(Sequelize.col(`so_code`), {
                    [Op.iLike]: `%${search}%`
                }),
                Sequelize.where(Sequelize.literal(`DATE(so_add_date)`), {
                    [Op.between]: [startDate, endDate]
                })
            ],
            order: [
                ['so_add_date', 'DESC']
            ]
        });

        return result;
    }

    retrieveSalesOrderForShipment = async ( salesOrderOid ) => {
        let result = await SoMstr.findOne({
            attributes: [
                'so_oid',
                ['so_code', 'so_number'],
            ],
            include: [
                {
                    model: SodDet,
                    as: 'detail_sales_order',
                    attributes: [
                        'sod_oid',
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_id"`), 'pt_id'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`), 'partnumber'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`), 'description1'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc2"`), 'description2'],
                        [Sequelize.literal('CASE WHEN sod_serial IS NOT NULL THEN TRUE ELSE FALSE END'), 'lot_or_serial'],
                        [Sequelize.literal(`CASE WHEN COUNT("detail_sales_order->singular_serial_sales_order"."sods_oid") = 0 THEN 'N' ELSE 'Y' END`), 'has_unique'],
                        [Sequelize.literal(`"detail_sales_order->site_relation"."si_desc"`), 'site'],
                        [Sequelize.literal(`"detail_sales_order->location_relation"."loc_desc"`), 'location'],
                        [Sequelize.literal('ROUND(sod_qty_open, 2)'), 'qty_open'],
                        [Sequelize.literal('ROUND(sod_qty_booked, 2)'), 'qty_booked'],
                        [Sequelize.literal(`ROUND(sod_qty_allocated, 2)`), 'qty_allocated'],
                        [Sequelize.literal(`COUNT("detail_sales_order->singular_serial_sales_order"."sods_oid")`), 'qty_shipment'],
                        [Sequelize.literal(`"detail_sales_order->unitmeasure_relation"."code_name"`), 'um'],
                        ['sod_um_conv', 'um_conv'],
                        [Sequelize.literal('ROUND(sod_qty_real, 2)'), 'qty_real'],
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: SodsSerial,
                            as: 'singular_serial_sales_order',
                            attributes: []
                        }, {
                            model: SiMstr,
                            as: 'site_relation',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'location_relation',
                            attributes: []
                        }, {
                            model: CodeMstr,
                            as: 'unitmeasure_relation',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                so_oid: salesOrderOid
            },
            group: [
                'so_oid',
                Sequelize.literal(`"detail_sales_order"."sod_oid"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_id"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc2"`),
                Sequelize.literal(`"detail_sales_order->site_relation"."si_desc"`),
                Sequelize.literal(`"detail_sales_order->location_relation"."loc_desc"`),
                Sequelize.literal(`"detail_sales_order->unitmeasure_relation"."code_name"`),
            ]
        });

        return result;
    }

    retrieveSerialNumberSalesOrder = async ( salesOrderOid ) => {
        let result = await SodsSerial.findAll({
            attributes: [
                'sods_oid',
                'sods_sod_oid',
                'sods_loc_id',
                [Sequelize.col('detail_so.sod_si_id'), 'sod_si_id'],
                [Sequelize.col(`detail_so.sod_pt_id`), 'product_id'],
                [Sequelize.col(`detail_so->detail_product.pt_code`), 'partnumber'],
                [Sequelize.col(`detail_so->detail_product.pt_desc1`), 'description1'],
                [Sequelize.col(`detail_so->detail_product.pt_desc2`), 'description2'],
                [Sequelize.col(`detail_so->location_relation.loc_desc`), 'location'],
                ['sods_qty', 'qty'],
                ['sods_serial', 'qrbarcode']
            ],
            include: [
                {
                    model: SodDet,
                    as: 'detail_so',
                    attributes: [],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'location_relation',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                sods_sod_oid: {
                    [Op.in]: Sequelize.literal(`(SELECT sod_oid FROM public.sod_det WHERE sod_so_oid = (SELECT so_oid FROM public.so_mstr WHERE so_oid = :salesorder_oid))`)
                }
            },
            replacements: {
                salesorder_oid: salesOrderOid
            }
        });

        return result;
    }

    retrieveDetailSalesOrder = async (detailSalesOrderOid) => {
        let result = await SodDet.findAll({
            attributes: [
                'sod_oid', 
                'sod_sqd_oid', 
                'sod_um', 
                'sod_um_conv', 
                'sod_si_id', 
                'sod_loc_id', 
                'sod_qty_allocated', 
                'sod_cost', 
                'sod_price', 
                'sod_en_id', 
                'sod_dom_id',
                'sod_invc_oid',
                [Sequelize.col(`header_sales_order.so_cu_id`), 'currency_id'],
                [Sequelize.col(`header_sales_order.so_exc_rate`), 'exchange_rate'],
                [Sequelize.col(`detail_product.pt_pl_id`), 'productline_id']
            ],
            include: [
                {
                    model: SoMstr,
                    as: 'header_sales_order',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'detail_product',
                    attributes: []
                }
            ],
            where: {
                sod_oid: {
                    [Op.in]: detailSalesOrderOid
                }
            }
        });

        return result;
    }

    updateQtyShipmentSalesOrder = async (detailSalesOrderOid, qty, transaction) => {
        await SodDet.update({
            sod_qty_shipment: qty
        }, {
            where: {
                sod_oid: detailSalesOrderOid
            },
            transaction
        })
    }

    updateHeaderSalesOrder = async ( dataUpdate, headerSalesOrderOid, transaction ) => {
        await SoMstr.update({
            so_upd_by: (dataUpdate.username) ? dataUpdate.username : Sequelize.literal(`so_upd_by`),
            so_upd_date: (dataUpdate.updated_at) ? dataUpdate.updated_at : Sequelize.literal(`so_upd_date`),
            so_trans_id: (dataUpdate.transaction_id) ? dataUpdate.transaction_id : Sequelize.literal('so_trans_id'),
            so_close_date: (dataUpdate.close_date) ? dataUpdate.close_date : Sequelize.literal(`so_close_date`),
            so_total: (dataUpdate.total) ? dataUpdate.total : Sequelize.literal(`so_total`),
            so_total_final: (dataUpdate.total) ? dataUpdate.total : Sequelize.literal(`so_total_final`),
            so_terbilang: (dataUpdate.terbilang) ? dataUpdate.terbilang : Sequelize.literal(`so_terbilang`),
        }, {
            where: {
                so_oid: headerSalesOrderOid
            },
            transaction
        });
    }

    retrieveHeaderSalesOrder = async ( headerSalesOrderOid ) => {
        let result = await SoMstr.findOne({
            attributes: ['so_oid', 'so_si_id', 'so_dom_id', 'so_cu_id', 'so_booking', 'so_cons', 'so_trans_id', 'so_alocated'],
            where: {
                so_oid: headerSalesOrderOid
            }
        });
        
        return result;
    }

    retrieveAllSalesOrder = async ( conditions ) => {
        let result = await SoMstr.findAll({
            attributes: [
                ['so_oid', 'header_sales_order_oid'],
                [Sequelize.col(`entity_relation.en_desc`), 'entity'],
                ['so_code', 'so_number'],
                ['so_midtrans_inv_number', 'invoice_number'],
                ['so_date', 'effective_date'],
                'so_type',
                'so_indent',
                [Sequelize.col('sales.ptnr_name'), 'sales_person'],
                [Sequelize.col('site_relation.si_desc'), 'site'],
                [Sequelize.col(`buyer.ptnr_name`), 'sold_to'],
                [Sequelize.col(`buyer->group_partner.ptnrg_desc`), 'customer_group'],
                [Sequelize.literal(`CASE WHEN buyer.ptnr_is_ps = 'Y' THEN 'PS' ELSE 'NON-PS' END`), 'ps_status'],
                ['so_ptnr_id_sold', 'id_customer'],
                [Sequelize.col(`account_relation.ac_code`), 'account_code'],
                [Sequelize.col(`account_relation.ac_name`), 'account_name'],
                [Sequelize.col('subaccount_relation.sb_desc'), 'subaccount_name'],
                [Sequelize.col(`cost_center_relation.cc_desc`), 'cost_center'],
                ['so_taxable', 'taxable'],
                ['so_tax_inc', 'tax_include'],
                [Sequelize.col('tax_class_relation.code_name'), 'tax_class'],
                [Sequelize.literal(`CASE WHEN so_ppn_type = 'E' THEN 'PPN Bebas' ELSE 'PPN Bayar' END`), 'tax_type'],
                [Sequelize.col(`credit_terms_relation.code_name`), 'credit_terms'],
                [Sequelize.col(`currency_relation.cu_name`), 'currency'],
                [Sequelize.col(`bank_relation.bk_name`), 'bank'],
                [Sequelize.fn('ROUND', Sequelize.col('so_exc_rate'), '2'), 'exchange_rate'],
                [Sequelize.col('pricelist_relation.pi_desc'), 'pricelist'],
                [Sequelize.col(`payment_type_relation.code_name`), 'payment_type'],
                [Sequelize.col(`payment_method_relation.code_name`), 'payment_method'],
                ['so_cons', 'consigment'],
                ['so_ref_po_code', 'referensi_nomor_po'],
                ['so_booking', 'booking'],
                ['so_alocated', 'preorder'],
                ['so_sq_ref_code', 'referensi_nomor_sq'],
                [Sequelize.fn('ROUND', Sequelize.col("so_dp"), 2), 'prepayment'],
                [Sequelize.fn('ROUND', Sequelize.col('so_disc_header'), 2), 'discount'],
                [Sequelize.fn('ROUND', Sequelize.col('so_payment'), 2), 'payment'],
                ['so_payment_date', 'payment_date'],
                ['so_close_date', 'close_date'],
                [Sequelize.col(`approval_relation.tran_name`), 'approval_status'],
                ['so_trans_id', 'status'],
                ['so_return', 'is_return'],
                ['so_trans_rmks', 'remarks'],
                ['so_price', 'price'],
                [Sequelize.fn('ROUND', Sequelize.col('so_total'), 2), 'total'],
                [Sequelize.fn('ROUND', Sequelize.col(`so_shipping_charges`), 2), 'shipping_charges'],
                [Sequelize.fn('ROUND', Sequelize.col(`so_total_final`), 2), 'total_final'],
                [Sequelize.fn('ROUND', Sequelize.col(`so_total_ppn`), 2), 'ppn'],
                [Sequelize.fn('ROUND', Sequelize.col(`so_total_ppn`), 2), 'pph'],
                [Sequelize.literal(`ROUND(so_total + so_total_ppn + so_total_pph, 2)`), 'after_tax'],
                [Sequelize.literal(`ROUND(so_exc_rate * so_total, 2)`), 'ext_total'],
                [Sequelize.literal(`ROUND(so_exc_rate * so_total_ppn, 2)`), 'ext_ppn'],
                [Sequelize.literal(`ROUND(so_exc_rate * so_total_pph, 2)`), 'ext_pph'],
                [Sequelize.literal(`ROUND(so_exc_rate * (so_total + so_total_ppn + so_total_pph), 2)`), 'ext_after_tax'],
                ['so_indent', 'indent_status'],
                ['so_project', 'project_status'],
                ['so_add_by', 'user_create'],
                ['so_add_date', 'date_create'],
                ['so_print_dt', 'print_date'],
                ['so_upd_by', 'user_update'],
                ['so_upd_date', 'date_update']
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'sales',
                    attributes: []
                }, {
                    model: SiMstr,
                    as: 'site_relation',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'buyer',
                    attributes: [],
                    include: [
                        {
                            model: PtnrgGrp,
                            as: 'group_partner',
                            attributes: []
                        }
                    ]
                }, {
                    model: AcMstr,
                    as: 'account_relation',
                    attributes: []
                }, {
                    model: SbMstr,
                    as: 'subaccount_relation',
                    attributes: []
                }, {
                    model: CcMstr,
                    as: 'cost_center_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'tax_class_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'credit_terms_relation',
                    attributes: []
                }, {
                    model: CuMstr,
                    as: 'currency_relation',
                    attributes: []
                }, {
                    model: PiMstr,
                    as: 'pricelist_relation',
                    attributes: []
                }, {
                    model: BkMstr,
                    as: 'bank_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'payment_type_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'payment_method_relation',
                    attributes: []
                }, {
                    model: TranMstr,
                    as: 'approval_relation',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.literal(`DATE(so_add_date)`), {
                    [Op.between]: [conditions.start_date, conditions.end_date]
                }),
                Sequelize.where(Sequelize.col(`so_code`), {
                    [Op.iLike]: `%${conditions.so_code}%`
                })
            ],
            order: [
                ['so_add_date', 'DESC']
            ]
        });

        return result;
    }

    retrieveDetailProductSalesOrder = async ( headerSalesOrderOid ) => {
        let result = await SodDet.findAll({
            attributes: [
                ['sod_oid', 'detail_sales_order_oid'],
                [Sequelize.col(`entity_relation.en_desc`), 'entity'],
                [Sequelize.col(`site_relation.si_desc`), 'site'],
                ['sod_is_additional_charge', 'additional_charges'],
                [Sequelize.col(`detail_product.pt_code`), 'partnumber'],
                [Sequelize.col(`detail_product.pt_desc1`), 'description1'],
                [Sequelize.col(`detail_product.pt_desc2`), 'description2'],
                ['sod_rmks', 'remarks'],
                ['sod_qty_open', 'qty_open'],
                [Sequelize.fn('ROUND', Sequelize.col('sod_qty_shipment'), 2), 'qty_shipment'],
                [Sequelize.fn('ROUND', Sequelize.col('sod_qty_invoice'), 2), 'qty_invoice'],
                [Sequelize.col(`unitmeasure_relation.code_name`), 'um'],
                [Sequelize.col(`location_relation.loc_desc`), 'location'],
                [Sequelize.literal(`ROUND((sod_price * 1) - (sod_price * 1 * sod_disc), 2)`), 'price'],
                [Sequelize.fn(`ROUND`, Sequelize.col(`sod_disc`), 2), 'discount'],
                [Sequelize.col(`account_relation.ac_code`), 'account_code'],
                [Sequelize.col(`account_relation.ac_name`), 'account_name'],
                [Sequelize.col('subaccount_relation.sb_desc'), 'subaccount_name'],
                [Sequelize.col(`cost_center_relation.cc_desc`), 'cost_center'],
                [Sequelize.col(`account_disc_relation.ac_code`), 'account_disc_code'],
                [Sequelize.col(`account_disc_relation.ac_name`), 'account_disc_name'],
                [Sequelize.fn('ROUND', Sequelize.col('sod_um_conv'), 2), 'um_conversion'],
                [Sequelize.fn('ROUND', Sequelize.col('sod_qty_real'), 2), 'qty_real'],
                ['sod_taxable', 'taxable'],
                ['sod_tax_inc', 'tax_include'],
                [Sequelize.col(`tax_class_relation.code_name`), 'tax_class'],
                ['sod_ppn_type', 'ppn_type'],
                ['sod_loc_id', 'location_id'],
                ['sod_pt_id', 'product_id'],
                [Sequelize.literal('CAST(sod_qty AS INTEGER)'), 'quantity'],
                ['sod_invc_oid', 'inventory_oid']
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: SiMstr,
                    as: 'site_relation',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'detail_product',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'unitmeasure_relation',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location_relation',
                    attributes: []
                }, {
                    model: AcMstr,
                    as: 'account_relation',
                    attributes: []
                }, {
                    model: SbMstr,
                    as: 'subaccount_relation',
                    attributes: []
                }, {
                    model: CcMstr,
                    as: 'cost_center_relation',
                    attributes: []
                }, {
                    model: AcMstr,
                    as: 'account_disc_relation',
                    attributes: []
                }, {
                    model: CodeMstr, 
                    as: 'tax_class_relation',
                    attributes: []
                }
            ],
            where: {
                sod_so_oid: headerSalesOrderOid
            }
        });

        return result;
    }

    retrieveDataCustomer = async ( headerSalesOrderOid ) => {
        let result = await SoaAttr.findAll({
            attributes: [
                ['soa_kjb_code', 'kjb_number'],
                ['soa_bekerja_pada', 'tempat_kerja'],
                ['soa_jabatan_bagian', 'jabatan'],
                ['soa_kantor_alamat_1', 'kantor_alamat1'],
                ['soa_kantor_alamat_2', 'kantor_alamat2'],
                ['soa_kantor_lantai', 'lantai_bekerja'],
                ['soa_kantor_telp', 'kantor_telephone'],
                ['soa_ktp', 'ktp'],
                ['soa_email', 'email'],
                ['soa_rumah_alamat_1', 'rumah_alamat_1'],
                ['soa_rumah_alamat_2', 'rumah_alamat_2'],
                ['soa_rumah_kode_pos', 'rumah_kode_pos'],
                ['soa_rumah_telp', 'rumah_telephone'],
                ['soa_rumah_hp', 'telephone_hp'],
                ['soa_status_alamat_kirim', 'status_alamat_kirim'],
                ['soa_status_alamat_tagih', 'status_alamat_tagih'],
                ['soa_suami_nama', 'nama_suami_atau_istri'],
                ['soa_suami_bekerja', 'tempat_kerja_suami_atau_istri'],
                ['soa_suami_jabatan', 'jabatan_suami_atau_istri'],
                ['soa_suami_kantor_alamat_1', 'alamat_kantor_suami_atau_istri_1'],
                ['soa_suami_kantor_alamat_2', 'alamat_kantor_suami_atau_istri_2'],
                ['soa_suami_telp', 'nomor_telepon_suami_atau_istri'],
                ['soa_suami_hp', 'nomor_hp_suami_atau_istri'],
                ['soa_anak_nama_1', 'nama_anak_pertama'],
                ['soa_anak_tgl_lahir_1', 'tgl_lahir_anak_pertama'],
                ['soa_anak_sekolah_1', 'sekolah_anak_pertama'],
                ['soa_anak_nama_2', 'nama_anak_kedua'],
                ['soa_anak_tgl_lahir_2', 'tgl_lahir_anak_kedua'],
                ['soa_anak_sekolah_2', 'sekolah_anak_kedua'],
                ['soa_anak_nama_3', 'nama_anak_ketiga'],
                ['soa_anak_tgl_lahir_3', 'tgl_lahir_anak_ketiga'],
                ['soa_anak_sekolah_3', 'sekolah_anak_ketiga'],
                ['soa_keluarga_dekat_nama', 'nama_keluarga_dekat'],
                ['soa_keluarga_dekat_alamat_1', 'alamat_keluarga_dekat_1'],
                ['soa_keluarga_dekat_alamat_2', 'alamat_keluarga_dekat_2'],
                ['soa_keluarga_dekat_telp', 'nomor_telepon_keluarga_dekat'],
                ['soa_keluarga_dekat_hp', 'nomor_hp_keluarga_dekat'],
                ['soa_status_tempat_tinggal', 'status_tempat_tinggal'],
                ['soa_jenis_kartu_kredit', 'jenis_kartu_kredit'],
                ['soa_no_kartu_kredit', 'nomor_kartu_kredit'],
                ['soa_berlaku_sd', 'berlaku_sd'],
                [Sequelize.col(`bank_relation.bk_name`), 'bank']
            ],
            include: [
                {
                    model: BkMstr,
                    as: 'bank_relation',
                    attributes: []
                }
            ],
            where: {
                soa_so_oid: headerSalesOrderOid
            }
        });

        return result;
    }

    retrieveAccountReceivableLedger = async ( headerSalesOrderOid ) => {
        let result = SokpPiutang.findAll({
            attributes: [
                [Sequelize.fn('ROUND', Sequelize.col(`sokp_amount`), 2), 'amount'],
                ['sokp_due_date', 'due_date'],
                [Sequelize.fn('ROUND', Sequelize.col(`sokp_amount_pay`), 2), 'amount_pay'],
                ['sokp_date_payment', 'payment_date'],
                ['sokp_description', 'description']
            ],
            where: {
                sokp_so_oid: headerSalesOrderOid
            }
        });

        return result;
    }

    retrieveDetailAssembly = async ( headerSalesOrderOid ) => {
        let result = await SodasAssembly.findAll({
            attributes: [
                [Sequelize.col(`product_parent_relation.pt_code`), 'partnumber_parent'],
                [Sequelize.col(`product_parent_relation.pt_desc1`), 'parent_description_1'],
                [Sequelize.col(`product_parent_relation.pt_desc2`), 'parent_description_2'],
                [Sequelize.col(`product_children_relation.pt_code`), 'partnumber_child'],
                [Sequelize.col(`product_children_relation.pt_desc1`), 'child_description_1'],
                [Sequelize.col(`product_children_relation.pt_desc2`), 'child_description_2'],
                [Sequelize.fn('ROUND', Sequelize.col('sodas_qty'), 2), 'qty'],
                [Sequelize.fn('ROUND', Sequelize.col('sodas_qty_sold'), 2), 'qty_sold']
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product_parent_relation',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'product_children_relation',
                    attributes: []
                }
            ],
            where: {
                sodas_so_oid: headerSalesOrderOid
            }
        });

        return result;
    }

    retrieveTotalSalesOrderInAMonth = async () => {
        let startDate = moment().startOf('months').format('YYYY-MM-DD');
        let endDate = moment().endOf('months').format('YYYY-MM-DD');

        let result = await SoMstr.count({
            where: [
                Sequelize.where(Sequelize.literal(`DATE(so_add_date)`), {
                    [Op.between]: [startDate, endDate]
                })
            ]
        });

        return result;
    }

    inputHeaderSalesOrder = async ( bodyHeader, dataUser, transaction ) => {
        await SoMstr.create({
            so_oid: bodyHeader.sales_order_oid,
            so_dom_id: 1,
            so_en_id: bodyHeader.entity_id,
            so_add_by: dataUser.usernama,
            so_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            so_code: bodyHeader.so_code,
            so_ptnr_id_sold: bodyHeader.customer_id,
            so_ptnr_id_bill: bodyHeader.customer_id,
            so_date: bodyHeader.date,
            so_credit_term: bodyHeader.credit_term_id,
            so_taxable: 'N',
            so_tax_class: 9949,
            so_si_id: 992,
            so_type: 'R',
            so_sales_person: bodyHeader.sales_person_id,
            so_pi_id: bodyHeader.pricelist_id,
            so_pay_type: bodyHeader.payment_type_id,
            so_pay_method: bodyHeader.payment_method_id,
            so_ar_ac_id: bodyHeader.account_id,
            so_ar_sb_id: bodyHeader.subaccount_id,
            so_ar_cc_id: bodyHeader.cost_center_id,
            so_total: bodyHeader.total,
            so_payment_date: bodyHeader.payment_date,
            so_tran_id: 19,
            so_trans_id: 'D',
            so_trans_rmks: bodyHeader.remarks,
            so_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            so_cu_id: bodyHeader.currency_id,
            so_total_ppn: bodyHeader.total_ppn,
            so_total_pph: bodyHeader.total_pph,
            so_payment: bodyHeader.payment,
            so_exc_rate: bodyHeader.exchange_rate,
            so_tax_inc: 'N',
            so_cons: bodyHeader.is_consigment,
            so_terbilang: bodyHeader.terbilang,
            so_bk_id: bodyHeader.bank_id,
            so_interval: 1,
            so_ref_po_code: bodyHeader.preorder_code,
            so_ref_po_oid: bodyHeader.preorder_oid,
            so_ppn_type: 'E',
            so_is_package: bodyHeader.is_package,
            so_manufacture: 'N',
            so_project: 'N',
            so_shipping_charges: bodyHeader.shipping_charges,
            so_total_final: bodyHeader.total,
            so_booking: bodyHeader.is_booking,
            so_sq_ref_oid: bodyHeader.reference_sq_oid,
            so_sq_ref_code: bodyHeader.reference_sq_code,
            so_ptsfr_loc_id: bodyHeader.origin_location_id,
            so_ptsfr_loc_to_id: bodyHeader.destination_location_id,
            so_ptsfr_loc_git: bodyHeader.git_location_id,
            so_alocated: 'N',
            so_book_start_date: bodyHeader.book_start_date,
            so_book_end_date: bodyHeader.book_end_date,
            so_midtrans_inv_number: bodyHeader.midtrans_inv_number
        }, {
            transaction
        })
    }

    inputDetailSalesOrder = async ( bodyDetail, transaction ) => {
        await SodDet.bulkCreate(bodyDetail, {
            transaction
        })
    }
}

module.exports = new SalesOrderService();