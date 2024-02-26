import {JwtService} from "@nestjs/jwt";

/**
 * clean object from null and undefined values
 * @param obj - the object to clean
 * @return object - the cleaned object
 */
export const cleanObj = (obj) => {
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj;
};

/**
 * Get user from header
 * @param req - the request
 * @param jwtService - the jwt service
 * @return object - the user
 */
export const getUserFromHeader = (req: any, jwtService: JwtService) => {
    const {
        createdDate,
        modifyDate,
        iat,
        exp,
        ...result
    } = jwtService.decode(req.headers.authorization.split(" ")[1]) as any;
    return result;
};

/**
 * Check if a record exists
 * @param model - the model to check
 * @param args - the arguments to pass to the count function
 * @return Promise<boolean>
 */
export async function existsRecord<Model extends { count: any }>(model: Model, args: Parameters<Model['count']>[0]) {
    const count = await model.count(args)
    return Boolean(count);
}

/**
 * Exclude passwords from an array of objects
 * @param arr - the array of objects
 * @param keys - the keys to exclude
 * @return array - the array of objects without the excluded keys
 */
export const excludePasswords = (arr, keys) => {
    for (let i of arr) {
        for (let key of keys) {
            delete i[key];
        }
    }
    return arr;
};

/**
 * Exclude passwords from an object
 * @param obj - the object
 * @param keys - the keys to exclude
 * @return object - the object without the excluded keys
 */
export const exclude = (obj, keys) => {
    for (let key of keys) {
        delete obj[key];
    }
    return obj;
};

export const generateOTP = () => {
    // generate opt code from 6 digits
    return Math.floor(100000 + Math.random() * 900000).toString();
}