DROP TABLE IF EXISTS bus_stops, buses, notifications, route_assignments, routes, student_events, students, users;
-- CreateTable
CREATE TABLE `bus_stops` (
    `stop_id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(10, 8) NULL,
    `address` VARCHAR(255) NULL,
    `is_active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`stop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buses` (
    `bus_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bus_number` VARCHAR(50) NOT NULL,
    `license_plate` VARCHAR(50) NOT NULL,
    `capacity` INTEGER NULL,
    `model` VARCHAR(100) NULL,
    `year` INTEGER NULL,
    `status` VARCHAR(20) NULL,
    `last_maintenance_date` DATE NULL,

    UNIQUE INDEX `bus_number`(`bus_number`),
    UNIQUE INDEX `license_plate`(`license_plate`),
    PRIMARY KEY (`bus_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `notification_type` VARCHAR(20) NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NULL,
    `event_id` INTEGER NULL,
    `is_read` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_notifications_event_id`(`event_id`),
    INDEX `idx_notifications_user_id`(`user_id`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `route_assignments` (
    `assignment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `route_id` INTEGER NOT NULL,
    `driver_id` INTEGER NOT NULL,
    `bus_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_route_assignments_bus_id`(`bus_id`),
    INDEX `idx_route_assignments_driver_id`(`driver_id`),
    INDEX `idx_route_assignments_route_id`(`route_id`),
    UNIQUE INDEX `uniq_route_driver_date`(`route_id`, `driver_id`),
    PRIMARY KEY (`assignment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routes` (
    `route_id` INTEGER NOT NULL AUTO_INCREMENT,
    `route_type` VARCHAR(20) NULL,
    `start_time` TIME(0) NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`route_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_events` (
    `event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `route_assignment_id` INTEGER NULL,
    `event_type` VARCHAR(20) NOT NULL,
    `event_time` TIMESTAMP(0) NOT NULL,
    `notes` TEXT NULL,

    INDEX `idx_student_events_assignment_id`(`route_assignment_id`),
    INDEX `idx_student_events_student_id`(`student_id`),
    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `student_id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `profile_photo_url` VARCHAR(255) NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `stop_id` INTEGER NULL,

    INDEX `idx_students_parent_id`(`parent_id`),
    INDEX `idx_students_stop_id`(`stop_id`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `phone_number` VARCHAR(20) NULL,
    `address` VARCHAR(255) NULL,
    `role` VARCHAR(20) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat` (
    `chat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user1_id` INTEGER NOT NULL,
    `user2_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `chat_user1_id_user2_id_key`(`user1_id`, `user2_id`),
    PRIMARY KEY (`chat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatMessage` (
    `message_id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_id` INTEGER NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `message_type` VARCHAR(191) NOT NULL DEFAULT 'text',
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`message_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `student_events`(`event_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `route_assignments` ADD CONSTRAINT `route_assignments_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `route_assignments` ADD CONSTRAINT `route_assignments_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `route_assignments` ADD CONSTRAINT `route_assignments_ibfk_3` FOREIGN KEY (`bus_id`) REFERENCES `buses`(`bus_id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student_events` ADD CONSTRAINT `student_events_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student_events` ADD CONSTRAINT `student_events_ibfk_2` FOREIGN KEY (`route_assignment_id`) REFERENCES `route_assignments`(`assignment_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`stop_id`) REFERENCES `bus_stops`(`stop_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_user1_id_fkey` FOREIGN KEY (`user1_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_user2_id_fkey` FOREIGN KEY (`user2_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatMessage` ADD CONSTRAINT `chatMessage_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chat`(`chat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatMessage` ADD CONSTRAINT `chatMessage_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
