import { tryCatch, validate } from '../validator';

describe('@validator decorator test', () => {
    test('Check literal value', () => {
        const logger = jest.fn((e: Error) => {
            console.log(e.message);
        });

        class TestClass {
            @validate
            public testMethod(
                @validate.notNull
                @validate.maxLength(10)
                param1: string,
            ) {
                console.log('testMethod invoke');
            }

            @tryCatch(logger)
            public throwError() {
                throw new Error('Test error');
            }
        }

        const testClass = new TestClass();
        expect(() => testClass.testMethod(null)).toThrow(
            'Missing required argument at testMethod 0',
        );
        testClass.testMethod('1234567');
        expect(() => testClass.testMethod('12345678901234567890')).toThrow(
            'Incorrect string length',
        );

        testClass.throwError();
        expect(logger).toBeCalled();
    });
});
