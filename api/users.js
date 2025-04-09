const fs = require("fs").promises;
const path = require("path");

module.exports = async (req, res) => {
    const filePath = path.join(process.cwd(), "data", "users.json");
    let users = {};

    try {
        const data = await fs.readFile(filePath, "utf8");
        users = JSON.parse(data);
    } catch (e) {
        // Arquivo não existe ainda
    }

    if (req.method === "POST") {
        const { username, password, action } = req.body;

        if (action === "register") {
            if (users[username]) {
                return res.status(400).json({ error: "Username already exists" });
            }
            users[username] = password;
            await fs.writeFile(filePath, JSON.stringify(users, null, 2));
            return res.status(200).json({ message: "Registration successful" });
        } else if (action === "login") {
            if (users[username] && users[username] === password) {
                return res.status(200).json({ username });
            }
            return res.status(401).json({ error: "Invalid credentials" });
        }
    }

    res.status(405).json({ error: "Method not allowed" });
};