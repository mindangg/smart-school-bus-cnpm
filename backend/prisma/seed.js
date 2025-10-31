const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Dữ liệu users (đặt ở ngoài là đúng)
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

// Hàm main chứa TOÀN BỘ logic seed
async function main() {
    console.log('Start seeding ...');

    // 0. XÓA DỮ LIỆU CŨ (theo thứ tự ngược lại để không lỗi khóa ngoại)
    console.log('Deleting old data...');
    // Xóa các bảng phụ thuộc trước
    await prisma.route_stops.deleteMany();
    await prisma.student_events.deleteMany();
    await prisma.route_assignments.deleteMany();
    await prisma.notifications.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chat.deleteMany();
    // Xóa các bảng chính
    await prisma.routes.deleteMany();
    await prisma.students.deleteMany();
    await prisma.bus_stops.deleteMany();
    await prisma.buses.deleteMany();
    await prisma.users.deleteMany();
    console.log('Old data deleted.');

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
            },
        });
    }
    console.log('Users created.');

    // 2. TẠO CÁC TRẠM DỪNG (bus_stops)
    console.log("Creating Bus Stops...");
    const stop1 = await prisma.bus_stops.create({
      data: {
        address: "Đại học Sài Gòn (Cổng 1)",
        latitude: 10.759948,
        longitude: 106.682330,
      },
    });
    const stop2 = await prisma.bus_stops.create({
      data: {
        address: "Trần Hưng Đạo - Nguyễn Văn Cừ",
        latitude: 10.762145,
        longitude: 106.686036,
      },
    });
    const stop3 = await prisma.bus_stops.create({
      data: {
        address: "Công viên 23/9 (Trạm điều hành)",
        latitude: 10.769498,
        longitude: 106.692290,
      },
    });
    const stop4 = await prisma.bus_stops.create({
      data: {
        address: "Chợ Bến Thành",
        latitude: 10.772583,
        longitude: 106.697967,
      },
    });
    console.log("Bus Stops created.");

    // 3. TẠO XE BUÝT (buses)
    console.log("Creating Buses...");
    const bus1 = await prisma.buses.create({
      data: {
        bus_number: "SGU-001",
        license_plate: "51B-12345",
        capacity: 30,
        model: "Mercedes-Benz Sprinter",
        status: "ACTIVE",
      },
    });
    const bus2 = await prisma.buses.create({
      data: {
        bus_number: "SGU-002",
        license_plate: "51B-67890",
        capacity: 30,
        model: "Ford Transit",
        status: "MAINTENANCE",
      },
    });
    console.log("Buses created.");

    // 4. TẠO TUYẾN ĐƯỜNG (routes)
    console.log("Creating Routes...");
    const morningRoute = await prisma.routes.create({
      data: {
        route_type: "MORNING",
        start_time: "06:30:00",
        bus_id: bus1.bus_id, // Gán xe SGU-001
      },
    });
    const eveningRoute = await prisma.routes.create({
      data: {
        route_type: "EVENING",
        start_time: "16:30:00",
        bus_id: bus1.bus_id, // Gán xe SGU-001
      },
    });
    console.log("Routes created.");

    // 5. GÁN TRẠM DỪNG VÀO TUYẾN (route_stops)
    console.log("Assigning stops to routes...");
    // Gán trạm cho tuyến Sáng
    await prisma.route_stops.createMany({
      data: [
        { route_id: morningRoute.route_id, stop_id: stop1.stop_id, stop_order: 1 },
        { route_id: morningRoute.route_id, stop_id: stop2.stop_id, stop_order: 2 },
        { route_id: morningRoute.route_id, stop_id: stop3.stop_id, stop_order: 3 },
        { route_id: morningRoute.route_id, stop_id: stop4.stop_id, stop_order: 4 },
      ],
    });
    // Gán trạm cho tuyến Chiều (Thứ tự ngược lại)
    await prisma.route_stops.createMany({
      data: [
        { route_id: eveningRoute.route_id, stop_id: stop4.stop_id, stop_order: 1 },
        { route_id: eveningRoute.route_id, stop_id: stop3.stop_id, stop_order: 2 },
        { route_id: eveningRoute.route_id, stop_id: stop2.stop_id, stop_order: 3 },
        { route_id: eveningRoute.route_id, stop_id: stop1.stop_id, stop_order: 4 },
      ],
    });
    console.log("Stops assigned to routes.");

    // 6. TẠO PHÂN CÔNG LỊCH TRÌNH (route_assignments)
    console.log("Creating Route Assignments...");

    // 6a. Lấy ID của tài xế và xe buýt mà chúng ta đã tạo
    // (Chúng ta đã có sẵn bus1, morningRoute, eveningRoute từ các bước trên)
    
    // Tìm tài xế chúng ta đã tạo ở đầu file seed
    const driver1 = await prisma.users.findUnique({
        where: { email: 'driver1@gmail.com' }
    });
    const driver2 = await prisma.users.findUnique({
        where: { email: 'driver2@gmail.com' }
    });

    if (!driver1 || !driver2) {
        console.error("Không thể tìm thấy driver1@gmail.com hoặc driver2@gmail.com. Vui lòng kiểm tra lại seed data users.");
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
                route_id: morningRoute.route_id, // Tuyến sáng
                driver_id: driver1.user_id,      // Tài xế 1
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: today,          // Ngày hôm nay
                is_active: true
            },
            {
                route_id: eveningRoute.route_id, // Tuyến chiều
                driver_id: driver1.user_id,      // Tài xế 1
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: today,          // Ngày hôm nay
                is_active: true
            },

            // --- Lịch trình ngày mai ---
            {
                route_id: morningRoute.route_id, // Tuyến sáng
                driver_id: driver2.user_id,      // Tài xế 2
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: tomorrow,       // Ngày mai
                is_active: true
            },
            {
                route_id: eveningRoute.route_id, // Tuyến chiều
                driver_id: driver2.user_id,      // Tài xế 2
                bus_id: bus1.bus_id,             // Xe 1
                assignment_date: tomorrow,       // Ngày mai
                is_active: true
            }
        ]
    });
    
    console.log("Route Assignments created.");

    console.log('Seeding finished.');
}

// Gọi hàm main để thực thi
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });