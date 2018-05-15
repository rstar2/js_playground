const dateUtils = require('../lib/date-utils');

describe("dateUtils suite", () => {
	test('should pass', () => {
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

	test('should fail', () => {
		const day = new Date(1543701600000).getDate();

		expect(dateUtils.isExpiredDay(day, -7)).toBe(true);
	});
});
