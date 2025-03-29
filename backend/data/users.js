import bcrypt from 'bcryptjs';

const users=[
    {
        name: "Admin User",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true
    },
    {
        name: "Ram Kumar",
        email: "ram@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false
    },
    {
        name: "Sita Kumari",
        email: "sita@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false
    },
]

export default users;