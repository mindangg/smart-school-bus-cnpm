CREATE DATABASE IF NOT EXISTS smart_school_bus;
USE smart_school_bus;

CREATE TABLE users
(
    user_id      INT PRIMARY KEY AUTO_INCREMENT,
    email        varchar(255) UNIQUE NOT NULL,
    password     varchar(255)        NOT NULL,
    full_name    varchar(255),
    phone_number varchar(20),
    address      varchar(255),
    role         varchar(20)         NOT NULL,
    is_active    boolean             DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bus_stops
(
    stop_id   INT PRIMARY KEY AUTO_INCREMENT,
    latitude  DECIMAL(10, 8),
    longitude DECIMAL(10, 8),
    address   varchar(255),
    is_active boolean DEFAULT TRUE
);

CREATE TABLE students
(
    student_id        INT PRIMARY KEY AUTO_INCREMENT,
    parent_id         INT,
    full_name         varchar(255) NOT NULL,
    profile_photo_url varchar(255),
    is_active         boolean                     DEFAULT TRUE,
    created_at        timestamp DEFAULT CURRENT_TIMESTAMP,
    stop_id           INT,

    FOREIGN KEY (parent_id) REFERENCES users (user_id) ON DELETE SET NULL,
    FOREIGN KEY (stop_id) REFERENCES bus_stops (stop_id) ON DELETE SET NULL
);

CREATE TABLE buses
(
    bus_id                INT PRIMARY KEY AUTO_INCREMENT,
    bus_number            varchar(50) UNIQUE NOT NULL,
    license_plate         varchar(50) UNIQUE NOT NULL,
    capacity              INT,
    model                 varchar(100),
    year                  INT,
    status                varchar(20),
    last_maintenance_date date
);

CREATE TABLE routes
(
    route_id   INT PRIMARY KEY AUTO_INCREMENT,
    route_type varchar(20),
    bus_id     INT,
    start_time time,
    is_active  boolean                     DEFAULT TRUE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (bus_id) REFERENCES buses (bus_id) ON DELETE SET NULL
);


CREATE TABLE route_assignments
(
    assignment_id   INT PRIMARY KEY AUTO_INCREMENT,
    route_id        INT NOT NULL,
    driver_id       INT NOT NULL,
    bus_id          INT NOT NULL,
    assignment_date date    NOT NULL,
    is_active       boolean                     DEFAULT TRUE,
    created_at      timestamp DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users (user_id) ON DELETE RESTRICT,
    FOREIGN KEY (bus_id) REFERENCES buses (bus_id) ON DELETE RESTRICT,

    UNIQUE KEY uniq_route_driver_date (route_id, driver_id, assignment_date)
);


CREATE TABLE student_events
(
    event_id            INT PRIMARY KEY AUTO_INCREMENT,
    student_id          INT                     NOT NULL,
    route_assignment_id INT,
    event_type          varchar(20)                 NOT NULL,
    event_time          timestamp NOT NULL,
    notes               text,

    FOREIGN KEY (student_id) REFERENCES students (student_id) ON DELETE CASCADE,
    FOREIGN KEY (route_assignment_id) REFERENCES route_assignments (assignment_id) ON DELETE SET NULL
);

CREATE TABLE notifications
(
    notification_id   INT PRIMARY KEY AUTO_INCREMENT,
    user_id           INT      NOT NULL,
    notification_type varchar(20),
    title             varchar(255) NOT NULL,
    message           text,
    event_id          INT,
    is_read           boolean                     DEFAULT FALSE,
    created_at        timestamp DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES student_events (event_id) ON DELETE SET NULL
);

CREATE INDEX idx_students_parent_id ON students (parent_id);
CREATE INDEX idx_students_stop_id ON students (stop_id);
CREATE INDEX idx_routes_bus_id ON routes (bus_id);
CREATE INDEX idx_route_assignments_route_id ON route_assignments (route_id);
CREATE INDEX idx_route_assignments_driver_id ON route_assignments (driver_id);
CREATE INDEX idx_route_assignments_bus_id ON route_assignments (bus_id);
CREATE INDEX idx_student_events_student_id ON student_events (student_id);
CREATE INDEX idx_student_events_assignment_id ON student_events (route_assignment_id);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_event_id ON notifications (event_id);