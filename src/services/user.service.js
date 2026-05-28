import db from "../db/db.js";
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

export const hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(pass, salt);
}

export const validatePass = async (pass, passHash) => {
    return await bcrypt.compare(pass, passHash);
}

export const findUserByUsername = async (username) => {
    const [results] = await db.query(
        "SELECT userId, username, password, role FROM users WHERE username = ? LIMIT 1",
        [username]
    );
    return results[0];
};

export const createUser = async (username, password, role = "user") => {

    const hashPass = await hashPassword(password);

    const [result] = await db.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashPass, role]
    );

    return {
        userId: result.insertId,
        username,
        role
    };
};