class Helper {
	constructor () {
		return {
			Auth: require('./auth'),
			Query: require('./Query')
		}
	}
}

module.exports = new Helper()