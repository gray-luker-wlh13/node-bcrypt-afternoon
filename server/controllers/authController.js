const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const {username, password, isAdmin} = req.body;
        const db = req.app.get('db');
        const {session} = req;
        let result = await db.get_user(username);
        existingUser = result[0];
        if(existingUser){
            return res.status(409).send('Username taken')
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let registeredUser = await db.register_user(isAdmin, username, hash);
        user = registeredUser[0];
        session.user = {isAdmin: user.is_admin, username: user.username, id: user.id};
        return res.status(201).send(session.user);
    },

    login: async (req, res) => {
        const {username, password} = req.body;
        const db = req.app.get('db');
        const {session} = req;
        const foundUser = await db.get_user(username);
        user = foundUser[0];
        if(!user){
            return res.status(401).send('User not found. Please register asa new user before logging in.')
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if(!isAuthenticated){
            return res.status(403).send('Incorrect password.')
        }
        session.user = {isAdmin: user.is_admin, username: user.username, id: user.id}
        return res.send(session.user);
    },

    logout: (req, res) => {
        req.session.destroy();
        return res.sendStatus(200);
    }
} 