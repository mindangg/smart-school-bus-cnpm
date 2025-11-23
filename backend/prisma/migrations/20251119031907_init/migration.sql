-- CreateTable: users
CREATE TABLE `users`
(
    `user_id`      INTEGER      NOT NULL AUTO_INCREMENT,
    `email`        VARCHAR(255) NOT NULL,
    `password`     VARCHAR(255) NOT NULL,
    `full_name`    VARCHAR(255),
    `phone_number` VARCHAR(20),
    `address`      VARCHAR(255),
    `role`         VARCHAR(20)  NOT NULL,
    `is_active`    BOOLEAN      DEFAULT true,
    `created_at`   TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at`   TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    UNIQUE KEY `email` (`email`),
    PRIMARY KEY (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: buses
CREATE TABLE `buses`
(
    `bus_id`                INTEGER     NOT NULL AUTO_INCREMENT,
    `bus_number`            VARCHAR(50) NOT NULL,
    `capacity`              INTEGER,
    `model`                 VARCHAR(100),
    `status`                VARCHAR(20),
    UNIQUE KEY `bus_number` (`bus_number`),
    PRIMARY KEY (`bus_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: bus_stops
CREATE TABLE `bus_stops`
(
    `stop_id`   INTEGER NOT NULL AUTO_INCREMENT,
    `latitude`  DECIMAL(11, 8),
    `longitude` DECIMAL(11, 8),
    `address`   VARCHAR(255),
    `is_active` BOOLEAN DEFAULT true,
    PRIMARY KEY (`stop_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: routes
CREATE TABLE `routes`
(
    `route_id`       INTEGER NOT NULL AUTO_INCREMENT,
    `route_type`     VARCHAR(20),
    `start_time`     VARCHAR(8),
    `is_active`      BOOLEAN      DEFAULT true,
    `created_at`     TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at`     TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    `generated_from` INTEGER      DEFAULT -1,
    PRIMARY KEY (`route_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: route_assignments
CREATE TABLE `route_assignments`
(
    `assignment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `route_id`      INTEGER NOT NULL,
    `driver_id`     INTEGER NOT NULL,
    `bus_id`        INTEGER NOT NULL,
    `is_active`     BOOLEAN      DEFAULT true,
    `created_at`    TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    KEY `idx_route_assignments_route_id` (`route_id`),
    KEY `idx_route_assignments_driver_id` (`driver_id`),
    KEY `idx_route_assignments_bus_id` (`bus_id`),
    PRIMARY KEY (`assignment_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: route_stops
CREATE TABLE `route_stops`
(
    `route_stop_id` INTEGER NOT NULL AUTO_INCREMENT,
    `route_id`      INTEGER NOT NULL,
    `stop_id`       INTEGER NOT NULL,
    `stop_order`    INTEGER NOT NULL,
    UNIQUE KEY `route_id_stop_id` (`route_id`, `stop_id`),
    UNIQUE KEY `route_id_stop_order` (`route_id`, `stop_order`),
    PRIMARY KEY (`route_stop_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: students
CREATE TABLE `students`
(
    `student_id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `parent_id`         INTEGER,
    `full_name`         VARCHAR(255) NOT NULL,
    `profile_photo_url` VARCHAR(255),
    `is_active`         BOOLEAN      DEFAULT true,
    `created_at`        TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    KEY `idx_students_parent_id` (`parent_id`),
    PRIMARY KEY (`student_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: student_events
CREATE TABLE `student_events`
(
    `event_id`            INTEGER      NOT NULL AUTO_INCREMENT,
    `student_id`          INTEGER      NOT NULL,
    `route_assignment_id` INTEGER,
    `event_type`          VARCHAR(20)  NOT NULL,
    `event_time`          TIMESTAMP(0) NOT NULL,
    `notes`               TEXT,
    KEY `idx_student_events_student_id` (`student_id`),
    KEY `idx_student_events_assignment_id` (`route_assignment_id`),
    PRIMARY KEY (`event_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: route_stop_students
CREATE TABLE `route_stop_students`
(
    `id`            INTEGER NOT NULL AUTO_INCREMENT,
    `route_stop_id` INTEGER NOT NULL,
    `student_id`    INTEGER NOT NULL,
    UNIQUE KEY `route_stop_id_student_id` (`route_stop_id`, `student_id`),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- CreateTable: notifications
CREATE TABLE `notifications`
(
    `notification_id`   INTEGER      NOT NULL AUTO_INCREMENT,
    `user_id`           INTEGER      NOT NULL,
    `notification_type` VARCHAR(20),
    `title`             VARCHAR(255) NOT NULL,
    `message`           TEXT,
    `event_id`          INTEGER,
    `is_read`           BOOLEAN      DEFAULT false,
    `created_at`        TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    KEY `idx_notifications_user_id` (`user_id`),
    KEY `idx_notifications_event_id` (`event_id`),
    PRIMARY KEY (`notification_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- Foreign Keys
ALTER TABLE `route_assignments`
    ADD CONSTRAINT `fk_ra_route`
        FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`)
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `fk_ra_driver`
        FOREIGN KEY (`driver_id`) REFERENCES `users` (`user_id`)
            ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT `fk_ra_bus`
        FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`)
            ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `route_stops`
    ADD CONSTRAINT `fk_rs_route`
        FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`)
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `fk_rs_stop`
        FOREIGN KEY (`stop_id`) REFERENCES `bus_stops` (`stop_id`)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `students`
    ADD CONSTRAINT `fk_students_parent`
        FOREIGN KEY (`parent_id`) REFERENCES `users` (`user_id`)
            ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `student_events`
    ADD CONSTRAINT `fk_se_student`
        FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `fk_se_assignment`
        FOREIGN KEY (`route_assignment_id`) REFERENCES `route_assignments` (`assignment_id`)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `route_stop_students`
    ADD CONSTRAINT `fk_rss_stop`
        FOREIGN KEY (`route_stop_id`) REFERENCES `route_stops` (`route_stop_id`)
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `fk_rss_student`
        FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
            ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `notifications`
    ADD CONSTRAINT `fk_notif_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
            ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `fk_notif_event`
        FOREIGN KEY (`event_id`) REFERENCES `student_events` (`event_id`)
            ON DELETE CASCADE ON UPDATE CASCADE;
