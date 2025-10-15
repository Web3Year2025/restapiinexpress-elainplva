import {createUserSchema} from '../../src/models/user';

const validUser = {
    "name": "Una",
    "phonenumber": "0871234567",
    "email": "john.doe@mymail.ie",
    "dob": "2001/01/12"
}

describe('Date of Birth Validation', () => {
    it('should pass for the following valid data', () => {

        expect(() => createUserSchema.parse(
            validUser)).not.toThrow();
    });

    it('should fail for the un parasable date 45/12/2023', () => {

        expect(() => createUserSchema.parse(
            { ...validUser, "dob": '45/12/2023' })).toThrow();
    });
});
