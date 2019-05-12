import {maxValue, MaxValueError, minValue, MinValueError} from '../validator';

describe('@validator decorator test', () => {
    test('Check minValue decorator', () => {
        class TestClass {
            @minValue(10)
            public testField: number;
        }

        const testClass = new TestClass();
        expect(() => testClass.testField = 9).toThrow(
            MinValueError
        );

        testClass.testField = 11;
        expect(testClass.testField).toBeDefined();
    });

    test('Check maxValue decorator', () => {
        class TestClass {
            @maxValue(10)
            public testField: number;
        }

        const testClass = new TestClass();
        expect(() => testClass.testField = 11).toThrow(
            MaxValueError
        );

        testClass.testField = 9;
        expect(testClass.testField).toBeDefined();
    });

    //
    // test('Check maxLength decorator', () => {
    //     class TestClass {
    //         @validate
    //         public testMethod(
    //             @validate.maxLength(10)
    //                 param1: string,
    //         ) {
    //             console.log('testMethod invoke');
    //         }
    //     }
    //
    //     const testClass = new TestClass();
    //     testClass.testMethod('1234567');
    //     expect(() => testClass.testMethod('12345678901234567890')).toThrow(
    //         'Incorrect string length',
    //     );
    // });
    //
    // test('Check minLength decorator', () => {
    //     class TestClass {
    //         @validate
    //         public testMethod(
    //             @validate.minLength(10)
    //                 param1: string,
    //         ) {
    //             console.log('testMethod invoke');
    //         }
    //     }
    //
    //     const testClass = new TestClass();
    //     testClass.testMethod('12345678901234567890');
    //     expect(() => testClass.testMethod('1234567')).toThrow(
    //         'String is short',
    //     );
    // });
    //
    // test('Check notEmptyString decorator', () => {
    //     class TestClass {
    //         @validate
    //         public testMethod(
    //             @validate.notEmptyString()
    //                 param1: string,
    //         ) {
    //             console.log('testMethod invoke');
    //         }
    //     }
    //
    //     const testClass = new TestClass();
    //     testClass.testMethod('12345678901234567890');
    //     expect(() => testClass.testMethod('')).toThrow(
    //         'String is short',
    //     );
    // });
    //
    // test('Check tryCatch decorator', () => {
    //     const logger = jest.fn((e: Error) => {
    //         console.log(e.message);
    //     });
    //
    //     class TestClass {
    //
    //         @tryCatch(logger)
    //         public throwError() {
    //             throw new Error('Test error');
    //         }
    //     }
    //
    //     const testClass = new TestClass();
    //     testClass.throwError();
    //     expect(logger).toHaveBeenCalled();
    // });
    //
    // test('Check isEmail decorator', () => {
    //     class TestClass {
    //         @validate
    //         public testMethod(
    //             @validate.isEmail()
    //                 param1: string,
    //         ) {
    //             console.log('testMethod invoke');
    //         }
    //     }
    //
    //     const testClass = new TestClass();
    //     testClass.testMethod('user@example.com');
    //     expect(() => testClass.testMethod('www.google.com')).toThrow(
    //         'Failed regex at argument',
    //     );
    // });
    //
    // test('Check max & minLength together decorator', () => {
    //     class TestClass {
    //         @validate
    //         public testMethod(
    //             @validate.minLength(5)
    //             @validate.maxLength(10)
    //                 param1: string,
    //         ) {
    //             console.log('testMethod invoke');
    //         }
    //     }
    //
    //     const testClass = new TestClass();
    //     testClass.testMethod('123456');
    //     expect(() => testClass.testMethod('123')).toThrow(
    //         'String is short',
    //     );
    //
    //     expect(() => testClass.testMethod('1234567890123')).toThrow(
    //         'Incorrect string length',
    //     );
    // });
});
