import {deserialize, jsonField, serialize} from '../deserializer';

describe('deprecated property decorator tests', () => {
    test('test warning in console on getting and setting ', () => {
        class Address {
            @jsonField('first_line')
            public firstLine: string;

            @jsonField('second_line')
            public secondLine: string;

            @jsonField()
            public city: string;

            // Default constructor will be called by mapper
            public constructor() {
                this.firstLine = undefined;
                this.secondLine = undefined;
                this.city = undefined;
            }
        }

        class Animal {
            @jsonField()
            public name: string;
        }

        class Dog extends Animal {
            @jsonField('birth-day')
            public birthDay: Date;
        }

        class Person {
            @jsonField('full_name')
            public fullName: string;

            @jsonField({clazz: Address})
            public addresses: Address[];

            @jsonField({
                clazz: Animal,
                toJson: (arg1: Animal): Record<string, unknown> =>
                    arg1 instanceof Dog
                        ? {"type": "Dog"}
                        : {"type": "unknown"},
                fromJson: (arg: Record<string, any>): Function => {
                    console.log(arg);
                    switch (arg['pet']['type']) {
                        case 'Dog':
                            return Dog;
                        default:
                            return null;
                    }
                }
            })
            public pet: Animal;
        }

        const json = {
            'first_line': 'Some where',
            'second_line': 'Over Here',
            'city': 'In This City'
        };

        const address = deserialize(Address, json);

        expect(address.firstLine).toEqual(json['first_line']);
        expect(address.secondLine).toEqual(json['second_line']);
        expect(address.city).toEqual(json['city']);

        const dog =  new Dog();
        dog.birthDay = new Date();

        const person = new Person();
        person.fullName = 'Test name';
        person.pet = dog;
        person.pet.name = 'My dog';
        person.addresses = [ address ];

        const jsonPerson = serialize(person);

        expect(jsonPerson['full_name']).toEqual(person.fullName);
        expect(jsonPerson['pet']['name']).toEqual(person.pet.name);

        const t = deserialize(Person, jsonPerson);

        expect(person.fullName).toEqual(jsonPerson['full_name']);
    });
});
