import {mixin} from "../mixin";

describe('mixin decorator tests', () => {
    test('check multiple inheritance', () => {
        const caller = jest.fn((msg: string) => {
            console.log(msg);
        });

        class A {
            public methodA(): void {
                caller("Called A.methodA");
            }
        }

        class B {
            public methodB(): void {
                caller("Called B.methodB");
            }
            public fieldB: boolean = true;
        }

        interface C extends A, B {
        }
        @mixin(A, B)
        class C {
        }

        const c = new C();
        c.methodA();
        c.methodB();

        expect(caller).toHaveBeenCalledTimes(2);
        expect(c.fieldB).toEqual(true);
    })
});
