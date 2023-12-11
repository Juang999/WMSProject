class Helper {
	constructor () {
		return {
			Auth: require('./auth'),
			Query: require('./Query'),
			Page: require('./page')
		}
	}
}

module.exports = new Helper()