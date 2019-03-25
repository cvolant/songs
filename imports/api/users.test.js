import expect from 'expect';
import { validateNewUser } from './users';
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
    describe('users', function () {
        it('should allow valid email address', function () {
            const testUser = {
                emails: [
                    {
                        address: 'test@example.com'
                    }
                ]
            };
            const res = validateNewUser(testUser);

            expect(res).toBe(true);
        });

        it('should reject invalid email', function () {
            const testUser = {
                emails: [
                    {
                        address: 'testexample.com'
                    }
                ]
            };

            expect(() => { validateNewUser(testUser) }).toThrow();
        });
    });
}
// const add = (a, b) => {
//    return  a + b;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
// };
// const square = c => c * c;

// describe('maths functions', function() {
//     it('should add two numbers', function () {
//         const res = add(11, 9);

//         expect(res).toBe(20);
//     });

//     it('should square the number', function () {
//         const res = square(11);

//         expect(res).toBe(121);
//     });
// });