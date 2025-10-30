/*
  Warnings:

  - You are about to alter the column `latitude` on the `bus_stops` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Decimal(11,8)`.
  - You are about to alter the column `longitude` on the `bus_stops` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Decimal(11,8)`.

*/
-- AlterTable
ALTER TABLE `bus_stops` MODIFY `latitude` DECIMAL(11, 8) NULL,
    MODIFY `longitude` DECIMAL(11, 8) NULL;
