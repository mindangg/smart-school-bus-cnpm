// seed.js (FINAL MERGED VERSION)

const bcrypt = require('bcrypt');
const users = require("./data/UserData");
const busStopsData = require("./data/BusStopData");
const busData = require("./data/BusData");
const routesData = require("./data/RouteStopsData");

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
const createStudents = async () => {
    console.log("Creating students...");

    const parents = await prisma.users.findMany({ where: { role: "PARENT" } });

    for (const [index, parent] of parents.entries()) {
        const studentData = [];

        if (index === 0) {
            studentData.push(
                { full_name: "Trần Minh Khang", parent_id: parent.user_id, profile_photo_url: profilePhotoUrl },
                { full_name: "Trần Minh Phúc", parent_id: parent.user_id, profile_photo_url: profilePhotoUrl }
            );
        } else {
            studentData.push({
                full_name:
                    index === 1
                        ? "Trần An Nhiên"
                        : index === 2
                            ? "Phạm Gia Hân"
                            : "Lê Ngọc Trâm",
                parent_id: parent.user_id,
                profile_photo_url: profilePhotoUrl,
            });
        }

        await prisma.students.createMany({
            data: studentData.map(s => ({ ...s, is_active: true })),
            skipDuplicates: true,
        });
    }

    console.log("Students created successfully!");
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
// 5. CREATE ROUTES + ROUTE_STOPS (UPSET đúng composite key)
// ==========================================================
const createRoutesAndAssignRouteStops = async () => {
    console.log("🚍 Seeding routes and route_stops...");

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

    console.log("🎉 All routes and route_stops seeded successfully!");
};

// ==========================================================
// 6. CREATE ROUTE ASSIGNMENTS
// ==========================================================
const createRouteAssignments = async () => {
    console.log("Creating route assignments...");

    const assignments = [];

    for (let i = 0; i < 5; i++) {
        const routeEntry = routesData[i];
        const route = routeEntry.route;
        let busId = i + 1
        const driverId = i + 1;

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
// MAIN
// ==========================================================
const main = async () => {
    try {
        await createUsers();
        await createStudents();
        await createBusStops();
        await createBuses();
        await createRoutesAndAssignRouteStops();
        await createRouteAssignments();

        console.log("All seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
};

main();
