const dateUtils = require('../lib/date-utils');

describe("dateUtils suite", () => {
	test('expiration', () => {
		const today = Date.now();
		const dateBefore3Days = today - 1000 * 60 * 60 * 24 * 3;

		expect(dateUtils.isExpired(today + 3242)).toBe(false);
		expect(dateUtils.isExpired(dateBefore3Days)).toBe(true);
		expect(dateUtils.isExpiredDay(dateBefore3Days)).toBe(true);
		expect(dateUtils.isExpiredDay(dateBefore3Days, -1)).toBe(true);
		expect(dateUtils.isExpiredDay(dateBefore3Days, -2)).toBe(true);
		expect(dateUtils.isExpiredDay(dateBefore3Days, -3)).toBe(true);
		expect(dateUtils.isExpiredDay(dateBefore3Days, -4)).toBe(false);
	});
});
