import { logMethod, logParameter } from '../../';

describe('logProperty decorators test', () => {
    test('Check full method logging', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @logMethod()
            public testMethod(param1: string) {
                console.log(`%c testMethod invoke with param ${param1}`);
            }
        }

        const testClass = new TestClass();
        testClass.testMethod('not null string');
        expect(console.log).toHaveBeenCalled();
        expect(actualMessage).toEqual('%c ℹ️ Call: testMethod("not null string") => undefined');
    });

    test('Skip method logging when disabled by lambda', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @logMethod(() => false)
            public testMethod(param1: string) {
            }
        }

        const testClass = new TestClass();
        testClass.testMethod('not null string');
        expect(console.log).not.toHaveBeenCalled();
    });

    test('Skip method logging when disabled by boolean', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = message;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @logMethod(false)
            public testMethod(param1: string) {
            }
        }

        const testClass = new TestClass();
        testClass.testMethod('not null string');
        expect(console.log).not.toHaveBeenCalled();
    });

    test('Check only one parameter logging', () => {
        const oldLog = console.log;
        let actualMessage = '';
        console.log = jest.fn(
            (message?: any, ...optionalParams: any[]): void => {
                actualMessage = !actualMessage ? message : actualMessage;
                oldLog(message, optionalParams);
            },
        );

        class TestClass {
            @logMethod()
            public testMethod(
                param1: string,
                @logParameter
                param2: string,
            ) {
                console.log(`%c testMethod invoke with params ${param1}, ${param2}`);
            }
        }

        const testClass = new TestClass();
        testClass.testMethod('not null string 1', 'not null string 2');
        expect(console.log).toHaveBeenCalled();
        expect(actualMessage).toEqual('%c ℹ️ testMethod arg[1]: "not null string 2"');
    });
});
