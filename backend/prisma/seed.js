const bcrypt = require('bcrypt');
const users = require("./data/UserData");
const busStopsData = require("./data/BusStopData");
const busData = require("./data/BusData");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const profilePhotoUrl =
    'http://res.cloudinary.com/dunovasag/image/upload/v1761980382/khjzek0vqcokb8vslzon.jpg'

async function main() {
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
    console.log('Creating Bus Stops...')
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
    const [bus1, bus2, bus3, bus4] = await Promise.all(
        busData.map(bus => prisma.buses.create({ data: bus }))
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
    const routeData = [
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
        routeData.map(stop => prisma.routes.create({ data: stop }))
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
    const driver1 = await prisma.users.findUnique({
        where: { email: 'mindang2@gmail.com' }
    })
    const driver2 = await prisma.users.findUnique({
        where: { email: 'driver1@gmail.com' }
    })

    if (!driver1 || !driver2) {
        console.error('Không thể tìm thấy driver1@gmail.com hoặc driver2@gmail.com. Vui lòng kiểm tra lại seed data users.');
        return
    }

    // 6b. Tạo các ngày demo
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
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

    const students = await prisma.students.findMany()
    for (const student of students) {
        const eventType = "PICKUP";

        // Random time for the event today
        const eventTime = new Date(today);
        eventTime.setHours(6 + Math.floor(Math.random() * 12))
        eventTime.setMinutes(Math.floor(Math.random() * 60))

        await prisma.student_events.create({
            data: {
                student_id: student.student_id,
                route_assignment_id: 1,
                event_type: eventType,
                event_time: eventTime,
                notes: `Mock note for ${eventType.toLowerCase()}`,
            },
        });
    }

    console.log('Mock student events seeded successfully!')

    console.log('Seeding finished.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })