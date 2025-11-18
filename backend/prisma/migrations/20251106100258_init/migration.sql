/*
  Warnings:

  - You are about to drop the `chatMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `chatMessage` DROP FOREIGN KEY `chatMessage_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `chatMessage` DROP FOREIGN KEY `chatMessage_sender_id_fkey`;

-- DropTable
DROP TABLE `chatMessage`;

-- CreateTable
CREATE TABLE `route_stop_students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `route_stop_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,

    UNIQUE INDEX `route_stop_students_route_stop_id_student_id_key`(`route_stop_id`, `student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `message_id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_id` INTEGER NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `message_type` VARCHAR(191) NOT NULL DEFAULT 'text',
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chatMessage_chat_id_fkey`(`chat_id`),
    INDEX `chatMessage_sender_id_fkey`(`sender_id`),
    PRIMARY KEY (`message_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `route_stop_students` ADD CONSTRAINT `route_stop_students_route_stop_id_fkey` FOREIGN KEY (`route_stop_id`) REFERENCES `route_stops`(`route_stop_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `route_stop_students` ADD CONSTRAINT `route_stop_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chat`(`chat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
