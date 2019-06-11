import {
    maxValue,
    minValue,
    notNull,
    minLength,
    maxLength,
    notEmptyString,
    isEmail,
    MinLengthError,
    MaxValueError,
    MinValueError,
    NullReferenceError,
    MaxLengthError,
    RegExError,
} from '../..';

describe('@validator decorator test', () => {
    test('Check minValue decorator', () => {
        class TestClass {
            @minValue(10)
            public testField: number;
        }

        const testClass = new TestClass();
        expect(() => (testClass.testField = 9)).toThrow(MinValueError);

        testClass.testField = 11;
        expect(testClass.testField).toBeDefined();
    });

    test('Check maxValue decorator', () => {
        class TestClass {
            @maxValue(10)
            public testField: number;
        }

        const testClass = new TestClass();
        expect(() => (testClass.testField = 11)).toThrow(MaxValueError);

        testClass.testField = 9;
        expect(testClass.testField).toBeDefined();
    });

    test('Check notNull decorator', () => {
        class TestClass {
            @notNull
            public testField: any;
        }

        const testClass = new TestClass();
        expect(() => (testClass.testField = null)).toThrow(NullReferenceError);

        testClass.testField = {};
        expect(testClass.testField).toBeDefined();
    });

    test('Check minLength decorator', () => {
        class TestClass {
            @minLength(10)
            public testField: string;
        }

        const testClass = new TestClass();
        expect(() => (testClass.testField = '123')).toThrow(MinLengthError);

        testClass.testField = '1234567890123';
        expect(testClass.testField).toBeDefined();
    });

    test('Check maxLength decorator', () => {
        class TestClass {
            @maxLength(5)
            public testField: string;
        }

        const testClass = new TestClass();
        expect(() => (testClass.testField = '1234567890123')).toThrow(MaxLengthError);

        testClass.testField = '123';
        expect(testClass.testField).toBeDefined();
    });

    test('Check notEmptyString decorator', () => {
        class TestClass {
            @notEmptyString()
            public testField: string;
        }

        const testClass = new TestClass();
        expect(() => (testClass.testField = '')).toThrow(MinLengthError);

        testClass.testField = '123';
        expect(testClass.testField).toBeDefined();
    });

    test('Check isEmail decorator', () => {
        class TestClass {
            @isEmail()
            public testField: string;
        }

        const testClass = new TestClass();
        expect(() => (testClass.testField = 'test.com')).toThrow(RegExError);

        testClass.testField = 'test@example.com';
        expect(testClass.testField).toBeDefined();
    });
});
