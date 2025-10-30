-- CreateTable
CREATE TABLE `route_stops` (
    `route_stop_id` INTEGER NOT NULL AUTO_INCREMENT,
    `route_id` INTEGER NOT NULL,
    `stop_id` INTEGER NOT NULL,
    `stop_order` INTEGER NOT NULL,

    UNIQUE INDEX `route_stops_route_id_stop_id_key`(`route_id`, `stop_id`),
    UNIQUE INDEX `route_stops_route_id_stop_order_key`(`route_id`, `stop_order`),
    PRIMARY KEY (`route_stop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `route_stops` ADD CONSTRAINT `route_stops_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `route_stops` ADD CONSTRAINT `route_stops_stop_id_fkey` FOREIGN KEY (`stop_id`) REFERENCES `bus_stops`(`stop_id`) ON DELETE CASCADE ON UPDATE CASCADE;
