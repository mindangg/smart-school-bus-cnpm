const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();
const profilePhotoUrl =
    'http://res.cloudinary.com/dunovasag/image/upload/v1761980382/khjzek0vqcokb8vslzon.jpg'

const users = [
    // PARENTS

    {
        email: 'mindang1@gmail.com',
        password: 'mindang1',
        full_name: 'Trần Minh Đăng 1',
        phone_number: '0901234567',
        address: '123 Đ. Lê Lợi, Q1, Ho Chi Minh City',
        role: 'PARENT',
        is_active: true,
    },
    {
        email: 'parent1@gmail.com',
        password: 'parent1',
        full_name: 'Trần Văn An',
        phone_number: '0123000002',
        address: '45 Nguyễn Thị Minh Khai, Q1, Ho Chi Minh City',
        role: 'PARENT',
        is_active: true,
    },
    {
        email: 'parent2@gmail.com',
        password: 'parent2',
        full_name: 'Phạm Thị Linh',
        phone_number: '0123000003',
        address: '67 Lê Duẩn, Q3, Ho Chi Minh City',
        role: 'PARENT',
        is_active: true,
    },
    {
        email: 'parent3@gmail.com',
        password: 'parent3',
        full_name: 'Lê Thị Hương',
        phone_number: '0123000004',
        address: '89 Nguyễn Huệ, Q1, Ho Chi Minh City',
        role: 'PARENT',
        is_active: true,
    },

    // DRIVERS
    {
        email: 'mindang2@gmail.com',
        password: 'mindang2',
        full_name: 'Trần Minh Đăng 2',
        phone_number: '0901234568',
        address: '12 Phan Văn Trị, Gò Vấp, Ho Chi Minh City',
        role: 'DRIVER',
        is_active: true,
    },
    {
        email: 'driver1@gmail.com',
        password: 'driver1',
        full_name: 'Trần Minh Hoàng',
        phone_number: '0133000002',
        address: '34 Đinh Tiên Hoàng, Q1, Ho Chi Minh City',
        role: 'DRIVER',
        is_active: true,
    },
    {
        email: 'driver2@gmail.com',
        password: 'driver2',
        full_name: 'Phạm Đức Long',
        phone_number: '0133000003',
        address: '56 Cách Mạng Tháng 8, Q3, Ho Chi Minh City',
        role: 'DRIVER',
        is_active: true,
    },
    {
        email: 'driver3@gmail.com',
        password: 'driver3',
        full_name: 'Lê Văn Dũng',
        phone_number: '0133000004',
        address: '78 Huỳnh Văn Bánh, Phú Nhuận, Ho Chi Minh City',
        role: 'DRIVER',
        is_active: true,
    },

    // ADMINS
    {
        email: 'mindang3@gmail.com',
        password: 'mindang3',
        full_name: 'Trần Minh Đăng 3',
        phone_number: '0901234569',
        address: '9 Hai Bà Trưng, Q1, Ho Chi Minh City',
        role: 'ADMIN',
        is_active: true,
    },
    {
        email: 'admin1@gmail.com',
        password: 'admin1',
        full_name: 'Trần Quang Huy',
        phone_number: '0143000002',
        address: '21 Võ Văn Tần, Q3, Ho Chi Minh City',
        role: 'ADMIN',
        is_active: true,
    },
    {
        email: 'admin2@gmail.com',
        password: 'admin2',
        full_name: 'Phạm Thị Hồng',
        phone_number: '0143000003',
        address: '33 Nguyễn Văn Cừ, Q5, Ho Chi Minh City',
        role: 'ADMIN',
        is_active: true,
    },
    {
        email: 'admin3@gmail.com',
        password: 'admin3',
        full_name: 'Lê Thị Thanh',
        phone_number: '0143000004',
        address: '55 Lý Tự Trọng, Q1, Ho Chi Minh City',
        role: 'ADMIN',
        is_active: true,
    },
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
                address: u.address,
                phone_number: u.phone_number,
            },
        })
    }

    console.log('Seeded users successfully!')

    const parents = await prisma.users.findMany({
        where: { role: 'PARENT' },
    })

    for (const [index, parent] of parents.entries()) {
        const studentData = []

        if (index === 0) {
            studentData.push(
                {
                    full_name: 'Trần Minh Khang',
                    parent_id: parent.user_id,
                    profile_photo_url: profilePhotoUrl,
                },
                {
                    full_name: 'Trần Minh Phúc',
                    parent_id: parent.user_id,
                    profile_photo_url: profilePhotoUrl,
                }
            )
        } else {
            // Other parents: 1 student each
            studentData.push({
                full_name:
                    index === 1
                        ? 'Trần An Nhiên'
                        : index === 2
                            ? 'Phạm Gia Hân'
                            : 'Lê Ngọc Trâm',
                parent_id: parent.user_id,
                profile_photo_url: profilePhotoUrl,
            })
        }

        for (const student of studentData) {
            await prisma.students.create({
                data: {
                    full_name: student.full_name,
                    parent_id: student.parent_id,
                    profile_photo_url: student.profile_photo_url,
                    is_active: true,
                },
            })
        }
    }

    console.log('✅ Seeded students successfully!')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
