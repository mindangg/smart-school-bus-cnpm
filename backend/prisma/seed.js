const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
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

// Hàm main chứa TOÀN BỘ logic seed
async function main() {
    // console.log('Start seeding ...');
    //
    // // 0. XÓA DỮ LIỆU CŨ (theo thứ tự ngược lại để không lỗi khóa ngoại)
    // console.log('Deleting old data...');
    // // Xóa các bảng phụ thuộc trước
    // await prisma.route_stops.deleteMany();
    // await prisma.student_events.deleteMany();
    // await prisma.route_assignments.deleteMany();
    // await prisma.notifications.deleteMany();
    // await prisma.chatMessage.deleteMany();
    // await prisma.chat.deleteMany();
    // // Xóa các bảng chính
    // await prisma.routes.deleteMany();
    // await prisma.students.deleteMany();
    // await prisma.bus_stops.deleteMany();
    // await prisma.buses.deleteMany();
    // await prisma.users.deleteMany();
    // console.log('Old data deleted.');

    // 1. TẠO USERS (với bcrypt)
    console.log('Creating users...');
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

    console.log('Seeded students successfully!')
    console.log('Users created.');

    // 2. TẠO CÁC TRẠM DỪNG (bus_stops)
    console.log('Creating Bus Stops...');

    const busStopsData = [
        { address: 'Trần Hưng Đạo - Nguyễn Văn Cừ', longitude: 106.686036, latitude: 10.762145 },
        { address: 'Đại học Sài Gòn (Cổng 1)', longitude: 106.682330, latitude: 10.759948 },
        { address: 'Chợ Bến Thành', longitude: 106.697967, latitude: 10.772583 },
        { address: 'Công viên 23/9 (Trạm điều hành)', longitude: 106.692290, latitude: 10.769498 },

    ]
    const [stop1, stop2, stop3, stop4] = await Promise.all(
        busStopsData.map(stop => prisma.bus_stops.create({ data: stop }))
    )

    console.log('Bus Stops created.')
    // Dynamically assign to variables stop1, stop2, etc.
    // const createdStops = await Promise.all(
    //     busStopsData.map(stop => prisma.bus_stops.create({ data: stop }))
    // )
    // const stops = {};
    // createdStops.forEach((stop, index) => {
    //     stops[`stop${index + 1}`] = stop;
    // })

    // 3. TẠO XE BUÝT (buses)
    console.log('Creating Buses...');

    const busesData = [
        {
            bus_number: 'SGU-001',
            license_plate: '51B-12345',
            capacity: 30,
            model: 'Mercedes-Benz Sprinter',
            status: 'ACTIVE',
        },
        {
            bus_number: 'SGU-002',
            license_plate: '51B-67890',
            capacity: 30,
            model: 'Ford Transit',
            status: 'MAINTENANCE',
        },
        {
            bus_number: 'SGU-003',
            license_plate: '51B-54321',
            capacity: 35,
            model: 'Mercedes-Benz Sprinter',
            status: 'ACTIVE',
        },
        {
            bus_number: 'SGU-004',
            license_plate: '51B-98765',
            capacity: 25,
            model: 'Toyota Coaster',
            status: 'ACTIVE',
        },
    ]
    const [bus1, bus2, bus3, bus4] = await Promise.all(
        busesData.map(bus => prisma.buses.create({ data: bus }))
    )

    console.log('Buses created.')

    // const createdBuses = await Promise.all(
    //     busesData.map(bus => prisma.buses.create({ data: bus }))
    // )
    // const buses = {};
    // createdBuses.forEach((bus, index) => {
    //     buses[`bus${index + 1}`] = bus;
    // })

    // 4. TẠO TUYẾN ĐƯỜNG (routes)
    console.log('Creating Routes...')
    const routesData = [
        {
            route_type: 'MORNING',
            start_time: '06:30',
            bus_id: bus1.bus_id,
        },
        {
            route_type: 'EVENING',
            start_time: '17:00',
            bus_id: bus1.bus_id,
        },
    ]
    const [morningRoute1, eveningRoute1] = await Promise.all(
        routesData.map(stop => prisma.routes.create({ data: stop }))
    )
    // const createdRoutes = await Promise.all(
    //     routesData.map(route => prisma.routes.create({ data: route }))
    // )

    console.log('Routes created.');

    // 5. GÁN TRẠM DỪNG VÀO TUYẾN (route_stops)
    console.log('Assigning stops to routes...')
    // Sáng
    await prisma.route_stops.createMany({
      data: [
        { route_id: morningRoute1.route_id, stop_id: stop1.stop_id, stop_order: 1 },
        { route_id: morningRoute1.route_id, stop_id: stop2.stop_id, stop_order: 2 },
      ],
    })
    // Chiều
    await prisma.route_stops.createMany({
      data: [
        { route_id: eveningRoute1.route_id, stop_id: stop2.stop_id, stop_order: 1 },
        { route_id: eveningRoute1.route_id, stop_id: stop1.stop_id, stop_order: 2 },
      ],
    })
    console.log('Stops assigned to routes.')

    // 6. TẠO PHÂN CÔNG LỊCH TRÌNH (route_assignments)
    console.log('Creating Route Assignments...')

    // 6a. Lấy ID của tài xế và xe buýt mà chúng ta đã tạo
    // (Chúng ta đã có sẵn bus1, morningRoute1, eveningRoute từ các bước trên)
    
    // Tìm tài xế chúng ta đã tạo ở đầu file seed
    const driver1 = await prisma.users.findUnique({
        where: { email: 'driver1@gmail.com' }
    });
    const driver2 = await prisma.users.findUnique({
        where: { email: 'driver2@gmail.com' }
    });

    if (!driver1 || !driver2) {
        console.error('Không thể tìm thấy driver1@gmail.com hoặc driver2@gmail.com. Vui lòng kiểm tra lại seed data users.');
        return; // Dừng seed nếu không có tài xế
    }

    // 6b. Tạo các ngày demo
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set giờ về 00:00:00 để đảm bảo tính đúng ngày
    today.setHours(0, 0, 0, 0); 
    tomorrow.setHours(0, 0, 0, 0);

    // 6c. Tạo dữ liệu phân công
    await prisma.route_assignments.createMany({
        data: [
            // --- Lịch trình hôm nay ---
            {
                route_id: morningRoute1.route_id, // Tuyến sáng
                driver_id: driver1.user_id,      // Tài xế 1
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: today,          // Ngày hôm nay
                is_active: true
            },
            {
                route_id: eveningRoute1.route_id, // Tuyến chiều
                driver_id: driver1.user_id,      // Tài xế 1
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: today,          // Ngày hôm nay
                is_active: true
            },

            // --- Lịch trình ngày mai ---
            {
                route_id: morningRoute1.route_id, // Tuyến sáng
                driver_id: driver2.user_id,      // Tài xế 2
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: tomorrow,       // Ngày mai
                is_active: true
            },
            {
                route_id: eveningRoute1.route_id, // Tuyến chiều
                driver_id: driver2.user_id,      // Tài xế 2
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: tomorrow,       // Ngày mai
                is_active: true
            }
        ]
    });
    
    console.log('Route Assignments created.');

    console.log('Seeding finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });