import {mixin} from '../mixin';

describe('mixin decorator tests', () => {
    test('check mixin', () => {
        const caller = jest.fn((message) => {
            console.log(message);
        });

        class A {
            public methodA(): void {
                caller('Called A.methodA');
            }
        }

        class B {
            public methodB(): void {
                caller('Called B.methodB');
            }
        }

        interface C extends A, B {}
        @mixin(A, B)
        class C {
            public fieldC: string;
        }

        const c = new C();

        expect(c.methodA).toBeDefined();
        expect(c.methodB).toBeDefined();

        c.methodA();
        c.methodB();

        expect(caller).toHaveBeenCalledTimes(2);
    });
});
