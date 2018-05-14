const dateUtils = require('../lib/date-utils');

describe("dateUtils suite", () => {
	test('should pass', () => {
		const today = Date.now();
		const dateBefore3Days = today - 1000 * 60 * 60 * 24 * 3;

		expect(dateUtils.isExpired(today + 3242)).toBe(true);
		expect(dateUtils.isExpired(dateBefore3Days)).toBe(false);
		expect(dateUtils.isExpiredDay(dateBefore3Days)).toBe(false);
		expect(dateUtils.isExpiredDay(dateBefore3Days, -2)).toBe(false);
		expect(dateUtils.isExpiredDay(dateBefore3Days, -3)).toBe(false);
		expect(dateUtils.isExpiredDay(dateBefore3Days, -4)).toBe(true);
	});
});



