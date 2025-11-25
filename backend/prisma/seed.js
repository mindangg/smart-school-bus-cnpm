// seed.js (FINAL MERGED VERSION)

const bcrypt = require('bcrypt');
const users = require("./data/UserData");
const busStopsData = require("./data/BusStopData");
const busData = require("./data/BusData");
const routesData = require("./data/RouteStopsData");

// Danh sách tên học sinh đẹp chuẩn Việt Nam
const boyNames = [
    "Minh Khang", "Bảo Nam", "Phúc Lâm", "Gia Huy", "Trọng Hiếu",
    "Minh Quân", "Đức Anh", "Hoàng Nam", "Phong Đạt", "Tuấn Kiệt",
    "Bảo Long", "Trí Đức", "Nhật Minh", "Quang Vinh", "Hải Đăng",
    "Thiên Phúc", "Anh Tuấn", "Khánh Hòa", "Đình Nguyên", "Vũ Phong",
    "Tùng Lâm", "Quang Trường", "Hạo Nhiên", "Phú Quý", "Thành Đạt"
];

const girlNames = [
    "Ngọc Ánh", "Thảo Linh", "Mai Anh", "Hồng Nhung", "Kim Ngân",
    "Bích Ngọc", "Diễm My", "Thùy Linh", "Yến Nhi", "Phương Anh",
    "Hương Ly", "Minh Thư", "Tú Anh", "Khánh Linh", "Lan Anh",
    "Hồng Ngọc", "Thanh Thảo", "Nguyệt Ánh", "Bảo Trân", "Huyền My",
    "Cát Tường", "Xuân Lan", "Tâm Như", "Hạnh Phúc", "Thiên Kim"
];

// Hàm random từ mảng
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const profilePhotoUrl =
    "http://res.cloudinary.com/dunovasag/image/upload/v1761980382/khjzek0vqcokb8vslzon.jpg";

// ==========================================================
// 1. CREATE USERS (Dùng UPSERT để tránh crash)
// ==========================================================
const createUsers = async () => {
    console.log("Creating users (upsert)...");

    for (const u of users) {
        const hashedPassword = await bcrypt.hash(u.password, 10);

        await prisma.users.upsert({
            where: { email: u.email },
            update: {
                full_name: u.full_name,
                role: u.role,
                password: hashedPassword,
                is_active: true,
                address: u.address,
                phone_number: u.phone_number,
            },
            create: {
                email: u.email,
                full_name: u.full_name,
                role: u.role,
                password: hashedPassword,
                is_active: true,
                address: u.address,
                phone_number: u.phone_number,
            },
        });
    }

    console.log("Users created successfully!");
};

// ==========================================================
// 2. CREATE STUDENTS
// ==========================================================
// const createStudents = async () => {
//     console.log("Creating students...");
//
//     const parents = await prisma.users.findMany({ where: { role: "PARENT" } });
//
//     for (const [index, parent] of parents.entries()) {
//         const studentData = [];
//
//         if (index === 0) {
//             studentData.push(
//                 { full_name: "Trần Minh Khang", parent_id: parent.user_id, profile_photo_url: profilePhotoUrl },
//                 { full_name: "Trần Minh Phúc", parent_id: parent.user_id, profile_photo_url: profilePhotoUrl }
//             );
//         } else {
//             studentData.push({
//                 full_name:
//                     index === 1
//                         ? "Trần An Nhiên"
//                         : index === 2
//                             ? "Phạm Gia Hân"
//                             : "Lê Ngọc Trâm",
//                 parent_id: parent.user_id,
//                 profile_photo_url: profilePhotoUrl,
//             });
//         }
//
//         await prisma.students.createMany({
//             data: studentData.map(s => ({ ...s, is_active: true })),
//             skipDuplicates: true,
//         });
//     }
//
//     console.log("Students created successfully!");
// };

// ==========================================================
// 2. CREATE STUDENTS → chỉ tạo 3 con/phụ huynh, KHÔNG dùng stop_id
// ==========================================================
const createStudents = async () => {
    console.log("Creating students (3 per parent)...");

    const parents = await prisma.users.findMany({
        where: { role: "PARENT", is_active: true },
        select: { user_id: true }
    });

    let boyIdx = 0, girlIdx = 0;

    for (const parent of parents) {
        const data = [];

        for (let i = 0; i < 3; i++) {
            const isBoy = Math.random() > 0.5;
            const firstName = isBoy
                ? boyNames[boyIdx++ % boyNames.length]
                : girlNames[girlIdx++ % girlNames.length];

            data.push({
                full_name: firstName + " Trần",
                parent_id: parent.user_id,
                profile_photo_url: profilePhotoUrl,
                is_active: true,
                // Không có stop_id → hợp lệ 100% với schema hiện tại
            });
        }

        await prisma.students.createMany({ data, skipDuplicates: true });
    }

    console.log(`Created ${parents.length * 3} students (3 per parent)!`);
};

// ==========================================================
// 3. CREATE BUS STOPS
// ==========================================================
const createBusStops = async () => {
    console.log("Creating bus stops...");

    const activeBusStops = busStopsData.map(stop => ({
        ...stop,
        is_active: true,
    }));

    await prisma.bus_stops.createMany({
        data: activeBusStops,
        skipDuplicates: true,
    });

    console.log("Bus stops created.");
};

// ==========================================================
// 4. CREATE BUSES
// ==========================================================
const createBuses = async () => {
    console.log("Creating buses...");
    await prisma.buses.createMany({ data: busData, skipDuplicates: true });
    console.log("Buses created.");
};

// ==========================================================
// 5. CREATE ROUTES + ROUTE_STOPS
// ==========================================================
const createRoutesAndAssignRouteStops = async () => {
    console.log("Seeding routes and route_stops...");

    for (const routeEntry of routesData) {
        const { route, stops } = routeEntry;

        const createdRoute = await prisma.routes.upsert({
            where: { route_id: route.route_id },
            update: {
                route_type: route.route_type,
                start_time: route.start_time,
                is_active: true,
                generated_from: route.generated_from,
            },
            create: {
                route_id: route.route_id,
                route_type: route.route_type,
                start_time: route.start_time,
                is_active: true,
                generated_from: route.generated_from,
            },
        });

        for (const stop of stops) {
            await prisma.route_stops.upsert({
                where: {
                    route_id_stop_id: {
                        route_id: createdRoute.route_id,
                        stop_id: stop.stop_id,
                    },
                },
                update: { stop_order: stop.stop_order },
                create: {
                    route_id: createdRoute.route_id,
                    stop_id: stop.stop_id,
                    stop_order: stop.stop_order,
                },
            });
        }
    }

    console.log("All routes and route_stops seeded successfully!");
};

// ==========================================================
// 6. CREATE ROUTE ASSIGNMENTS
// ==========================================================
const createRouteAssignments = async () => {
    console.log("Creating route assignments...");

    const assignments = [];

    for (let i = 0; i < 10; i++) {
        const routeEntry = routesData[i];
        const route = routeEntry.route;
        let busId = i + 1
        const driverId = i + 6;

        assignments.push({
            route_id: route.route_id,
            driver_id: driverId,
            bus_id: busId,
            is_active: true,
        });
        busId += 1;
    }

    await prisma.route_assignments.createMany({
        data: assignments,
        skipDuplicates: true,
    });

    console.log("Route assignments created.");
};

// ==========================================================
// 7. GAN HOC SINH CHI VAO TRAM GIUA TUYEN (thu tu 4, 5, 6)
// ==========================================================
const assignStudentsToRouteStops = async () => {
    console.log("Assigning students to middle stops (order 4-6)...");

    const students = await prisma.students.findMany({
        where: { is_active: true },
        select: { student_id: true }
    });

    const allRouteStops = await prisma.route_stops.findMany({
        orderBy: { route_id: "asc" }
    });

    if (allRouteStops.length === 0) {
        console.log("No route_stops found, skipping...");
        return;
    }

    // Group by route_id
    const routeMap = {};
    allRouteStops.forEach(rs => {
        if (!routeMap[rs.route_id]) routeMap[rs.route_id] = [];
        routeMap[rs.route_id].push(rs);
    });

    // Only pick stops with order 4, 5, 6
    const middleStops = [];
    Object.values(routeMap).forEach(stops => {
        const sorted = stops.sort((a, b) => a.stop_order - b.stop_order);
        for (let i = 3; i <= 5 && i < sorted.length; i++) { // i=3 → order 4
            middleStops.push(sorted[i]);
        }
    });

    if (middleStops.length === 0) {
        console.log("No middle stops found, using all stops as fallback");
        middleStops.push(...allRouteStops);
    }

    const assignments = [];
    for (const student of students) {
        const chosen = middleStops[Math.floor(Math.random() * middleStops.length)];
        assignments.push({
            route_stop_id: chosen.route_stop_id,
            student_id: student.student_id,
        });
    }

    await prisma.route_stop_students.createMany({
        data: assignments,
        skipDuplicates: true,
    });

    console.log(`Assigned ${assignments.length} students to middle stops (order 4-6)`);
};

// ==========================================================
// MAIN
// ==========================================================
const main = async () => {
    try {
        await createUsers();
        await createStudents();
        await createBusStops();
        await createBuses();
        await createRoutesAndAssignRouteStops();
        await assignStudentsToRouteStops();
        await createRouteAssignments();

        console.log("All seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
};

main();
