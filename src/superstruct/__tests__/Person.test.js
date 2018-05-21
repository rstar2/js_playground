const Person = require('../Person');

describe("Person suite", () => {
    test('should fail - invalid age', () => {
        const data = {
            name: 'Rumen Neshev',
            age: '40'
        };

        expect(() => {
            const rumen = Person(data);
        }).toThrow();
    });

    test('should validate', () => {
        const data = {
            name: 'Rumen Neshev',
            age: 40
        };

        const rumen = Person(data);
        expect(rumen).toBeTruthy();
    });

    test('should validate', () => {
        const data = {
            name: 'Rumen Neshev',
            age: 40,
            married: true
        };

        const rumen = Person(data);
        expect(rumen).toBeTruthy();
    });
});