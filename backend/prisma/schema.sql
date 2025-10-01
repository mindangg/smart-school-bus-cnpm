CREATE TABLE users
(
    user_id      integer PRIMARY KEY,
    email        varchar(255) UNIQUE NOT NULL,
    password     varchar(255)        NOT NULL,
    full_name    varchar(255),
    phone_number varchar(20),
    address      varchar(255),
    role         varchar(20)         NOT NULL,
    is_active    boolean                     DEFAULT TRUE,
    created_at   timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bus_stops
(
    stop_id   integer PRIMARY KEY,
    latitude  numeric(10, 8),
    longitude numeric(10, 8),
    address   varchar(255),
    is_active boolean DEFAULT TRUE
);

CREATE TABLE students
(
    student_id        integer PRIMARY KEY,
    parent_id         integer,
    full_name         varchar(255) NOT NULL,
    profile_photo_url varchar(255),
    is_active         boolean                     DEFAULT TRUE,
    created_at        timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    stop_id           integer,

    FOREIGN KEY (parent_id) REFERENCES users (user_id) ON DELETE SET NULL,
    FOREIGN KEY (stop_id) REFERENCES bus_stops (stop_id) ON DELETE SET NULL
);

CREATE TABLE buses
(
    bus_id                integer PRIMARY KEY,
    bus_number            varchar(50) UNIQUE NOT NULL,
    license_plate         varchar(50) UNIQUE NOT NULL,
    capacity              integer,
    model                 varchar(100),
    year                  integer,
    status                varchar(20),
    last_maintenance_date date
);

CREATE TABLE routes
(
    route_id   integer PRIMARY KEY,
    route_type varchar(20),
    bus_id     integer,
    start_time time WITHOUT TIME ZONE,
    is_active  boolean                     DEFAULT TRUE,
    created_at timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (bus_id) REFERENCES buses (bus_id) ON DELETE SET NULL
);


CREATE TABLE route_assignments
(
    assignment_id   integer PRIMARY KEY,
    route_id        integer NOT NULL,
    driver_id       integer NOT NULL,
    bus_id          integer NOT NULL,
    assignment_date date    NOT NULL,
    is_active       boolean                     DEFAULT TRUE,
    created_at      timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users (user_id) ON DELETE RESTRICT,
    FOREIGN KEY (bus_id) REFERENCES buses (bus_id) ON DELETE RESTRICT,

    UNIQUE (route_id, driver_id, assignment_date)
);


CREATE TABLE student_events
(
    event_id            integer PRIMARY KEY,
    student_id          integer                     NOT NULL,
    route_assignment_id integer,
    event_type          varchar(20)                 NOT NULL,
    event_time          timestamp WITHOUT TIME ZONE NOT NULL,
    notes               text,

    FOREIGN KEY (student_id) REFERENCES students (student_id) ON DELETE CASCADE,
    FOREIGN KEY (route_assignment_id) REFERENCES route_assignments (assignment_id) ON DELETE SET NULL
);

CREATE TABLE notifications
(
    notification_id   integer PRIMARY KEY,
    user_id           integer      NOT NULL,
    notification_type varchar(20),
    title             varchar(255) NOT NULL,
    message           text,
    event_id          integer,
    is_read           boolean                     DEFAULT FALSE,
    created_at        timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

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

CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE
    ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE
    ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();