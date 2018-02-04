const PersonWithEmail = require('../../../src/superstruct/PersonWithEmail');

describe("PersonWithEmail suite", () => {
    const data = {
        name: 'Rumen Neshev',
        age: 40
    };

    test('should fail - no email', () => {
        expect(() => {
            const rumen = PersonWithEmail(data);
        }).toThrow();
    });

    test('should fail - invalid email', () => {
        expect(() => {
            const rumen = PersonWithEmail({ ...data, email: 123 });
        }).toThrow();
    });

    test('should validate', () => {
        const rumen = PersonWithEmail({ ...data, email: 'rstar2@abv.bg' });
        expect(rumen).toBeTruthy();
    });
});