-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_foodTruckId_fkey`;

-- DropForeignKey
ALTER TABLE `foodtruckinformation` DROP FOREIGN KEY `FoodTruckInformation_foodTruckId_fkey`;

-- DropForeignKey
ALTER TABLE `foodtruckview` DROP FOREIGN KEY `FoodTruckView_foodTruckId_fkey`;

-- AddForeignKey
ALTER TABLE `FoodTruckInformation` ADD CONSTRAINT `FoodTruckInformation_foodTruckId_fkey` FOREIGN KEY (`foodTruckId`) REFERENCES `FoodTruck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_foodTruckId_fkey` FOREIGN KEY (`foodTruckId`) REFERENCES `FoodTruck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodTruckView` ADD CONSTRAINT `FoodTruckView_foodTruckId_fkey` FOREIGN KEY (`foodTruckId`) REFERENCES `FoodTruck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
