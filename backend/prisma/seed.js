// const bcrypt = require('bcrypt');
// const users = require("./data/UserData");
// const busStopsData = require("./data/BusStopData");
// const busData = require("./data/BusData");
// const routesData = require("./data/RouteStopsData");

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const profilePhotoUrl =
//     'http://res.cloudinary.com/dunovasag/image/upload/v1761980382/khjzek0vqcokb8vslzon.jpg'

// // ========== 1. CREATE USERS ==========
// const createUsers = async () => {
//     console.log('Creating users...');

//     for (const u of users) {
//         const hashedPassword = await bcrypt.hash(u.password, 10);
//         await prisma.users.create({
//             data: {
//                 email: u.email,
//                 full_name: u.full_name,
//                 role: u.role,
//                 password: hashedPassword,
//                 is_active: true,
//                 address: u.address,
//                 phone_number: u.phone_number,
//             },
//         });
//     }

//     console.log('Users created successfully!');
// }

// // ========== 2. CREATE STUDENTS ==========
// const createStudents = async () => {
//     console.log('Creating students...');
//     const parents = await prisma.users.findMany({ where: { role: 'PARENT' } });

//     for (const [index, parent] of parents.entries()) {
//         const studentData = [];

//         if (index === 0) {
//             studentData.push(
//                 { full_name: 'Trần Minh Khang', parent_id: parent.user_id, profile_photo_url: profilePhotoUrl },
//                 { full_name: 'Trần Minh Phúc', parent_id: parent.user_id, profile_photo_url: profilePhotoUrl }
//             );
//         } else {
//             studentData.push({
//                 full_name:
//                     index === 1
//                         ? 'Trần An Nhiên'
//                         : index === 2
//                             ? 'Phạm Gia Hân'
//                             : 'Lê Ngọc Trâm',
//                 parent_id: parent.user_id,
//                 profile_photo_url: profilePhotoUrl,
//             });
//         }

//         await prisma.students.createMany({
//             data: studentData.map(s => ({ ...s, is_active: true })),
//             skipDuplicates: true,
//         });
//     }

//     console.log('Students created successfully!');
// }

// // ========== 3. CREATE BUS STOPS ==========
// const createBusStops = async () => {
//     console.log('Creating bus stops...');
//     await prisma.bus_stops.createMany({ data: busStopsData, skipDuplicates: true });
//     console.log('Bus stops created.');
// };

// // ========== 4. CREATE BUSES ==========
// const createBuses = async () => {
//     console.log('Creating buses...');
//     await prisma.buses.createMany({ data: busData, skipDuplicates: true });
//     console.log('Buses created.');
// };

// // === Hàm tạo routes ===
// const createRoutes = async () => {
//     console.log('Creating routes...');
//     const routesData = Array.from({ length: 7 }, (_, i) => ({
//         route_type: 'MORNING',
//         start_time: `0${6 + i}:00:00`,
//         bus_id: i + 1,
//     }));

//     await prisma.routes.createMany({ data: routesData, skipDuplicates: true });
//     console.log('Routes created.');
// };

// // === Hàm tạo routes và gắn route_stops ===
// const createRoutesAndAssignRouteStops = async () => {
//     console.log('🚍 Seeding routes and route_stops...');

//     for (const routeEntry of routesData) {
//         const { route, stops } = routeEntry;

//         // Tạo route
//         const createdRoute = await prisma.routes.create({
//             data: {
//                 route_type: route.route_type,
//                 bus_id: route.bus_id,
//                 start_time: route.start_time,
//                 is_active: true,
//             },
//         });

//         // Thêm các route_stops tương ứng
//         const routeStopsData = stops.map((stop) => ({
//             route_id: createdRoute.route_id,
//             stop_id: stop.stop_id,
//             stop_order: stop.stop_order,
//         }));

//         await prisma.route_stops.createMany({
//             data: routeStopsData,
//         });

//         console.log(
//             `✅ Created route ${createdRoute.route_id} (${route.route_type}) with ${stops.length} stops`
//         );
//     }

//     console.log('🎉 All routes and route_stops seeded successfully!');
// };


// // // ========== 5. CREATE ROUTES ==========
// // const createRoutes = async () => {
// //     console.log('Creating routes...');
// //     const routes = Array.from({ length: 10 }, (_, i) => [
// //         { route_type: 'MORNING', start_time: '06:30', bus_id: i + 1 },
// //         { route_type: 'EVENING', start_time: '17:30', bus_id: i + 1 },
// //     ]).flat();
// //
// //     await prisma.routes.createMany({ data: routes, skipDuplicates: true });
// //     console.log('Routes created.');
// // };
// //
// // // ========== 6. ASSIGN STOPS TO ROUTES ==========
// // const assignStopsToRoutes = async () => {
// //     console.log('Assigning stops to routes...');
// //     const totalBuses = 10;
// //     const stopsPerRoute = 4;
// //     const totalStops = 40;
// //     let routeId = 1;
// //
// //     for (let bus_id = 1; bus_id <= totalBuses; bus_id++) {
// //         const startStop = (bus_id - 1) * (stopsPerRoute - 1) + 1;
// //         const stopIds = Array.from(
// //             { length: stopsPerRoute },
// //             (_, i) => (startStop + i) % totalStops || totalStops
// //         );
// //
// //         const morningStops = stopIds.map((stopId, index) => ({
// //             route_id: routeId,
// //             stop_id: stopId,
// //             stop_order: index + 1,
// //         }));
// //
// //         const eveningStops = [...stopIds].reverse().map((stopId, index) => ({
// //             route_id: routeId + 1,
// //             stop_id: stopId,
// //             stop_order: index + 1,
// //         }));
// //
// //         await prisma.route_stops.createMany({ data: [...morningStops, ...eveningStops] });
// //         console.log(`Assigned stops for bus ${bus_id}`);
// //         routeId += 2;
// //     }
// //
// //     console.log('Stops assigned to routes.');
// // };



// // ========== 7. CREATE ROUTE ASSIGNMENTS ==========
// const createRouteAssignments = async () => {
//     console.log('Creating route assignments...');
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const totalBuses = 7;
//     const assignments = [];

//     for (let busId = 1; busId <= totalBuses; busId++) {
//         const driverId = busId + 5;
//         const morningRouteId = (busId - 1) * 2 + 1;
//         const eveningRouteId = (busId - 1) * 2 + 2;

//         assignments.push(
//             {
//                 route_id: morningRouteId,
//                 driver_id: driverId,
//                 bus_id: busId,
//                 assignment_date: today,
//                 is_active: true,
//             },
//             {
//                 route_id: eveningRouteId,
//                 driver_id: driverId,
//                 bus_id: busId,
//                 assignment_date: today,
//                 is_active: true,
//             }
//         );
//     }

//     await prisma.route_assignments.createMany({ data: assignments, skipDuplicates: true });
//     console.log('Route assignments created.');
// };

// // ========== 8. (OPTIONAL) MOCK STUDENT EVENTS ==========
// //     const createMockStudentEvents = async () => {
// //         console.log('🎓 Creating mock student events...');
// //         const today = new Date();
// //         const students = await prisma.students.findMany();
// //
// //         for (const student of students) {
// //             const eventType = "PICKUP";
// //             const eventTime = new Date(today);
// //             eventTime.setHours(6 + Math.floor(Math.random() * 2)); // 6–8 AM
// //             eventTime.setMinutes(Math.floor(Math.random() * 60));
// //
// //             await prisma.student_events.create({
// //                 data: {
// //                     student_id: student.student_id,
// //                     route_assignment_id: 1,
// //                     event_type: eventType,
// //                     event_time: eventTime,
// //                     notes: `Mock note for ${eventType.toLowerCase()}`,
// //                 },
// //             });
// //         }
// //
// //         console.log('✅ Mock student events created.');
// //     };

// // ========== MAIN EXECUTION FLOW ==========
// const main = async () => {
//     try {
//         await createUsers();
//         await createStudents();
//         await createBusStops();
//         await createBuses();
//         // await createRoutes();
//         await createRoutesAndAssignRouteStops();
//         await createRouteAssignments();
//         // await createMockStudentEvents(); // uncomment if needed
//         console.log('All seeding completed successfully!');
//     }
//     catch (error) {
//         console.error('Error during seeding:', error);
//     }
//     finally {
//         await prisma.$disconnect();
//     }
// };

// main();

// seed.js (ĐÃ SỬA LỖI CRASH)
const bcrypt = require('bcrypt');
const users = require("./data/UserData");
const busStopsData = require("./data/BusStopData");
const busData = require("./data/BusData");
const routesData = require("./data/RouteStopsData"); 

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const profilePhotoUrl =
    'http://res.cloudinary.com/dunovasag/image/upload/v1761980382/khjzek0vqcokb8vslzon.jpg'

// ==========================================================
// SỬA HÀM NÀY
// ==========================================================
const createUsers = async () => {
    console.log('Creating users (dùng upsert)...');
    for (const u of users) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        
        // Dùng UPSERT thay vì CREATE
        await prisma.users.upsert({
            where: { email: u.email }, // Tìm user bằng email
            update: { // Nếu đã tồn tại, cập nhật
                full_name: u.full_name,
                role: u.role,
                password: hashedPassword,
                is_active: true,
                address: u.address,
                phone_number: u.phone_number,
            },
            create: { // Nếu chưa, tạo mới
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
    console.log('Users created successfully!');
}
// ==========================================================

const createStudents = async () => {
    // ... (Hàm này của bạn đã đúng, dùng createMany + skipDuplicates)
    console.log('Creating students...');
    const parents = await prisma.users.findMany({ where: { role: 'PARENT' } });
    for (const [index, parent] of parents.entries()) {
        // ... (logic studentData)
        const studentData = [];
        if (index === 0) {
            studentData.push(
                { full_name: 'Trần Minh Khang', parent_id: parent.user_id, profile_photo_url: profilePhotoUrl },
                { full_name: 'Trần Minh Phúc', parent_id: parent.user_id, profile_photo_url: profilePhotoUrl }
            );
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
            });
        }
        await prisma.students.createMany({
            data: studentData.map(s => ({ ...s, is_active: true })),
            skipDuplicates: true,
        });
    }
    console.log('Students created successfully!');
}

const createBusStops = async () => {
    console.log('Creating bus stops (ĐANG SET is_active: true)...'); // <-- Log đã thay đổi

    // Thêm 'is_active: true' vào mọi trạm dừng
    const activeBusStopsData = busStopsData.map(stop => ({
        ...stop,
        is_active: true 
    }));

    await prisma.bus_stops.createMany({ 
        data: activeBusStopsData, // Dùng dữ liệu mới
        skipDuplicates: true 
    });
    console.log('Bus stops created (ĐÃ SET is_active: true).'); // <-- Log đã thay đổi
};

    

const createBuses = async () => {
    console.log('Creating buses...');
    await prisma.buses.createMany({ data: busData, skipDuplicates: true });
    console.log('Buses created.');
};

// ==========================================================
// CÁC HÀM NÀY ĐÃ ĐÚNG (TỪ LẦN TRƯỚC)
// ==========================================================
const createRoutesAndAssignRouteStops = async () => {
    console.log('🚍 Seeding routes and route_stops (dùng ID đã định nghĩa)...');
    for (const routeEntry of routesData) {
        const { route, stops } = routeEntry;
        const createdRoute = await prisma.routes.upsert({
            where: { route_id: route.route_id },
            update: {
                route_type: route.route_type,
                bus_id: route.bus_id,
                start_time: route.start_time,
                is_active: true, // <-- Dòng này vẫn rất quan trọng
            },
            create: {
                route_id: route.route_id,
                route_type: route.route_type,
                bus_id: route.bus_id,
                start_time: route.start_time,
                is_active: true, // <-- Dòng này vẫn rất quan trọng
            },
        });
        for (const stop of stops) {
            await prisma.route_stops.upsert({
                // Sửa 'where' để dùng key 'route_id_stop_id'
                where: {
                    route_id_stop_id: { // <-- Tên key đúng do Prisma tạo ra
                        route_id: createdRoute.route_id,
                        stop_id: stop.stop_id,
                    }
                },
                update: { stop_order: stop.stop_order },
                create: {
                    route_id: createdRoute.route_id,
                    stop_id: stop.stop_id,
                    stop_order: stop.stop_order,
                }
            });
        }
    }
    console.log('🎉 All routes and route_stops seeded successfully!');
};

const createRouteAssignments = async () => {
    console.log('Creating route assignments...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const assignments = [];
    for (const routeEntry of routesData) {
        const route = routeEntry.route;
        const driverId = route.bus_id + 5; 
        assignments.push({
            route_id: route.route_id,
            driver_id: driverId,
            bus_id: route.bus_id,
            assignment_date: today,
            is_active: true,
        });
    }
    await prisma.route_assignments.createMany({ 
        data: assignments, 
        skipDuplicates: true 
    });
    console.log('Route assignments created.');
};
// ==========================================================


// ========== MAIN EXECUTION FLOW ==========
const main = async () => {
    try {
        await createUsers();
        await createStudents();
        await createBusStops();
        await createBuses();
        await createRoutesAndAssignRouteStops(); 
        await createRouteAssignments();
        
        console.log('All seeding completed successfully!');
    }
    catch (error) {
        console.error('Error during seeding:', error);
    }
    finally {
        await prisma.$disconnect();
    }
};

main();