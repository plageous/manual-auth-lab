import { createUser, findUserByUsername, validatePass } from "../services/user.service.js";

const loginPage = (req, res) => {
    res.render("login", {
        title: "Login",
        errors: req.query.errors || null
    });
};

const registerPage = (req, res) => {
    res.render("register", {
        title: "Register",
        errors: req.query.errors || null
    });
};

const register = async (req, res) => {
    const { username, password, confirm, role } = req.body;

    if (!username || !password || password !== confirm) {
        return res.redirect("/register?errors=Invalid registration details");
    }

    await createUser(username, password, role);
    return res.redirect("/login");
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);

    const matchedPass = await validatePass(password, user.password);

    if (!user || !matchedPass) {
        return res.redirect("/login?errors=Invalid credentials");
    }

    req.session.user = {
        userid: user.userId,
        username: user.username,
        role: user.role
    }

    return res.redirect("/dashboard");
};

export default { loginPage, registerPage, register, login };