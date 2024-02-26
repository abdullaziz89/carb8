/*
  Warnings:

  - A unique constraint covering the columns `[foodTruckId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `foodTruckId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_foodTruckId_key` ON `User`(`foodTruckId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_foodTruckId_fkey` FOREIGN KEY (`foodTruckId`) REFERENCES `FoodTruck`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
