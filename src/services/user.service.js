import db from "../db/db.js";
import bcrypt from 'bcrypt';

export const hashPassword = async (pass) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
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
    if (!username) throw new Error("Username is required.");
    if (!password) throw new Error("Password is required.");
    if (role !== "user" && role !== "admin") throw new Error("Invalid role.");

    // hash password before inserting!
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