import {deprecated, logger} from '../';

describe('logger property decorator tests', () => {
    test('test info in console on getting and setting ', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @logger()
            public testField: string;
        }

        const actualString = 'Test string';
        const testClass = new TestClass();
        testClass.testField = actualString;
        expect(console.log).toHaveBeenCalled();
        expect(actualMessage).toEqual(`%c ℹ️ Setting value for field "testField": ${actualString}`);

        const testFieldValue = testClass.testField;
        expect(testFieldValue).toEqual(actualString);
        expect(console.log).toHaveBeenCalled();
        expect(actualMessage).toEqual(`%c ℹ️ Getting value for field "testField": ${actualString}`);
    });

    test('test skip info by lambda for prod mode', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @logger(() => { return false; })
            public testField: string;
        }

        const actualString = 'Test string';
        const testClass = new TestClass();
        testClass.testField = actualString;
        expect(console.log).not.toHaveBeenCalled();
    });

    test('test skip info by boolean for prod mode', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @logger(false)
            public testField: string;
        }

        const actualString = 'Test string';
        const testClass = new TestClass();
        testClass.testField = actualString;
        expect(console.log).not.toHaveBeenCalled();
    });
});
