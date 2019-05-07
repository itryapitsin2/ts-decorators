import {deprecated} from "../deprecated";

describe("deprecated property decorator tests", () => {
    test("test warning in console on getting and setting ", () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn((message?: any, ...optionalParams: any[]): void => {
            actualMessage = message;
            oldLog(message, optionalParams);
        });

        class TestClass {
            @deprecated()
            public testField: string;
        }

        const actualStr = "Test string";
        const testClass =  new TestClass();
        testClass.testField = actualStr;
        expect(console.log).toBeCalled();
        expect(actualMessage).toEqual('%c "testField" field is marked as 💩 (deprecated)');

        const testFieldValue = testClass.testField;
        expect(testFieldValue).toEqual(actualStr);
        expect(console.log).toBeCalled();
        expect(actualMessage).toEqual('%c "testField" field is marked as 💩 (deprecated)');
    });
});
