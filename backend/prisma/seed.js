const bcrypt = require('bcrypt');
const users = require("./data/UserData");
const busStopsData = require("./data/BusStopData");
const busData = require("./data/BusData");
const routesData = require("./data/RouteStopsData");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const profilePhotoUrl =
    'http://res.cloudinary.com/dunovasag/image/upload/v1761980382/khjzek0vqcokb8vslzon.jpg'

// ========== 1. CREATE USERS ==========
const createUsers = async () => {
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
        });
    }

    console.log('Users created successfully!');
}

// ========== 2. CREATE STUDENTS ==========
const createStudents = async () => {
    console.log('Creating students...');
    const parents = await prisma.users.findMany({ where: { role: 'PARENT' } });

    for (const [index, parent] of parents.entries()) {
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

// ========== 3. CREATE BUS STOPS ==========
const createBusStops = async () => {
    console.log('Creating bus stops...');
    await prisma.bus_stops.createMany({ data: busStopsData, skipDuplicates: true });
    console.log('Bus stops created.');
};

// ========== 4. CREATE BUSES ==========
const createBuses = async () => {
    console.log('Creating buses...');
    await prisma.buses.createMany({ data: busData, skipDuplicates: true });
    console.log('Buses created.');
};

// === Hàm tạo routes ===
const createRoutes = async () => {
    console.log('Creating routes...');
    const routesData = Array.from({ length: 7 }, (_, i) => ({
        route_type: 'MORNING',
        start_time: `0${6 + i}:00:00`,
        bus_id: i + 1,
    }));

    await prisma.routes.createMany({ data: routesData, skipDuplicates: true });
    console.log('Routes created.');
};

// === Hàm tạo routes và gắn route_stops ===
const createRoutesAndAssignRouteStops = async () => {
    console.log('🚍 Seeding routes and route_stops...');

    for (const routeEntry of routesData) {
        const { route, stops } = routeEntry;

        // Tạo route
        const createdRoute = await prisma.routes.create({
            data: {
                route_type: route.route_type,
                bus_id: route.bus_id,
                start_time: route.start_time,
                is_active: true,
            },
        });

        // Thêm các route_stops tương ứng
        const routeStopsData = stops.map((stop) => ({
            route_id: createdRoute.route_id,
            stop_id: stop.stop_id,
            stop_order: stop.stop_order,
        }));

        await prisma.route_stops.createMany({
            data: routeStopsData,
        });

        console.log(
            `✅ Created route ${createdRoute.route_id} (${route.route_type}) with ${stops.length} stops`
        );
    }

    console.log('🎉 All routes and route_stops seeded successfully!');
};

// ========== 7. CREATE ROUTE ASSIGNMENTS ==========
const createRouteAssignments = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalBuses = 7;
    const assignments = [];

    for (let busId = 1; busId <= totalBuses; busId++) {
        const driverId = busId + 5;
        const morningRouteId = (busId - 1) * 2 + 1;
        const eveningRouteId = (busId - 1) * 2 + 2;

        assignments.push(
            {
                route_id: morningRouteId,
                driver_id: driverId,
                bus_id: busId,
                assignment_date: today,
                is_active: true,
            },
            {
                route_id: eveningRouteId,
                driver_id: driverId,
                bus_id: busId,
                assignment_date: today,
                is_active: true,
            }
        );
    }

    await prisma.route_assignments.createMany({ data: assignments, skipDuplicates: true });
    console.log('Route assignments created.');
};

const createStudentInRoutes = async () => {

}

// ========== 8. (OPTIONAL) MOCK STUDENT EVENTS ==========
//     const createMockStudentEvents = async () => {
//         console.log('🎓 Creating mock student events...');
//         const today = new Date();
//         const students = await prisma.students.findMany();
//
//         for (const student of students) {
//             const eventType = "PICKUP";
//             const eventTime = new Date(today);
//             eventTime.setHours(6 + Math.floor(Math.random() * 2)); // 6–8 AM
//             eventTime.setMinutes(Math.floor(Math.random() * 60));
//
//             await prisma.student_events.create({
//                 data: {
//                     student_id: student.student_id,
//                     route_assignment_id: 1,
//                     event_type: eventType,
//                     event_time: eventTime,
//                     notes: `Mock note for ${eventType.toLowerCase()}`,
//                 },
//             });
//         }
//
//         console.log('✅ Mock student events created.');
//     };

// ========== MAIN EXECUTION FLOW ==========
const main = async () => {
    try {
        await createUsers();
        await createStudents();
        await createBusStops();
        await createBuses();
        // await createRoutes();
        await createRoutesAndAssignRouteStops();
        await createRouteAssignments();
        // await createMockStudentEvents(); // uncomment if needed
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