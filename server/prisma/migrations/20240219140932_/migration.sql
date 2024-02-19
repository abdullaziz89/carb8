-- DropForeignKey
ALTER TABLE `foodtruckworkingday` DROP FOREIGN KEY `FoodTruckWorkingDay_foodTruckInfoId_fkey`;

-- AddForeignKey
ALTER TABLE `FoodTruckWorkingDay` ADD CONSTRAINT `FoodTruckWorkingDay_foodTruckInfoId_fkey` FOREIGN KEY (`foodTruckInfoId`) REFERENCES `FoodTruckInformation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
