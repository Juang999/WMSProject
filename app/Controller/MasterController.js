// model
const {AcMstr, EnMstr, LocMstr, PtnrMstr} = require('../../models')

class MasterController {
	getLocation = (req, res) => {
		LocMstr.findAll({
			attributes: ['loc_id', 'loc_desc']	
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: ''
				})
		})
	}
}