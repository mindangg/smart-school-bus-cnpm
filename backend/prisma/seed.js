const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();

const users = [
    // PARENT
    { email: 'parent1@gmail.com', full_name: 'Nguyễn Thị Mai', role: 'PARENT', password: 'parent1' },
    { email: 'parent2@gmail.com', full_name: 'Trần Văn An', role: 'PARENT', password: 'parent2' },
    { email: 'parent3@gmail.com', full_name: 'Phạm Thị Linh', role: 'PARENT', password: 'parent3' },
    { email: 'parent4@gmail.com', full_name: 'Lê Thị Hương', role: 'PARENT', password: 'parent4' },
    // DRIVER
    { email: 'driver1@gmail.com', full_name: 'Nguyễn Văn Tùng', role: 'DRIVER', password: 'driver1' },
    { email: 'driver2@gmail.com', full_name: 'Trần Minh Hoàng', role: 'DRIVER', password: 'driver2' },
    { email: 'driver3@gmail.com', full_name: 'Phạm Đức Long', role: 'DRIVER', password: 'driver3' },
    { email: 'driver4@gmail.com', full_name: 'Lê Văn Dũng', role: 'DRIVER', password: 'driver4' },
    // ADMIN
    { email: 'admin1@gmail.com', full_name: 'Nguyễn Thùy Dương', role: 'ADMIN', password: 'admin1' },
    { email: 'admin2@gmail.com', full_name: 'Trần Quang Huy', role: 'ADMIN', password: 'admin2' },
    { email: 'admin3@gmail.com', full_name: 'Phạm Thị Hồng', role: 'ADMIN', password: 'admin3' },
    { email: 'admin4@gmail.com', full_name: 'Lê Thị Thanh', role: 'ADMIN', password: 'admin4' },
];

async function main() {
    for (const u of users) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await prisma.users.create({
            data: {
                email: u.email,
                full_name: u.full_name,
                role: u.role,
                password: hashedPassword,
                is_active: true,
            },
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
