import { cached } from '../../';

describe('cached decorators test', () => {
    test('Check cached/uncached case', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @cached()
            public testMethod(param: number): number {
                console.log('TestClass.testMethod called');
                return param + 1;
            }
        }

        let testClass = new TestClass();
        testClass.testMethod(1); // Called
        testClass.testMethod(1); // Not called. Return value from cache
        testClass.testMethod(2); // Called

        expect(console.log).toHaveBeenCalledTimes(2);
    });
});
