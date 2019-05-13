import { deprecated } from '../';

describe('deprecated property decorator tests', () => {
    test('test warning in console on getting and setting ', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @deprecated()
            public testField: string;
        }

        const actualString = 'Test string';
        const testClass = new TestClass();
        testClass.testField = actualString;
        expect(console.log).toHaveBeenCalled();
        expect(actualMessage).toEqual('%c "testField" field is marked as 💩 (deprecated)');

        const testFieldValue = testClass.testField;
        expect(testFieldValue).toEqual(actualString);
        expect(console.log).toHaveBeenCalled();
        expect(actualMessage).toEqual('%c "testField" field is marked as 💩 (deprecated)');
    });

    test('test skip warning for prod mode', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @deprecated(() => { return false; })
            public testField: string;
        }

        const actualString = 'Test string';
        const testClass = new TestClass();
        testClass.testField = actualString;
        expect(console.log).not.toHaveBeenCalled();
    });
});
