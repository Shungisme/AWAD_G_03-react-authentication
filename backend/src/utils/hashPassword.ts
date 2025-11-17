import bcrypt from "bcryptjs";

// Generate hash for "password123"
const password = "password123";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("Password:", password);
console.log("Hashed:", hash);
console.log("\nUse this hash in your users.json file");
