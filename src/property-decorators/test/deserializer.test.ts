import {deserialize, jsonProperty, serialize} from '../..';

describe('deprecated property decorator tests', () => {
    test('test warning in console on getting and setting ', () => {
        class Address {
            @jsonProperty('first_line')
            public firstLine: string;

            @jsonProperty('second_line')
            public secondLine: string;

            @jsonProperty()
            public city: string;

            // // Default constructor will be called by mapper
            // public constructor() {
            //     this.firstLine = undefined;
            //     this.secondLine = undefined;
            //     this.city = undefined;
            // }
        }

        class Person {
            @jsonProperty('full_name')
            public fullName: string;

            @jsonProperty({ clazz: Address })
            public addresses: Address[];
        }

        const json = {
            'first_line': 'Some where',
            'second_line': 'Over Here',
            'city': 'In This City'
        };

        const address = deserialize(Address, json);

        const person = new Person();
        person.fullName = "Test name";
        const json1 = serialize(person);
    });
});
