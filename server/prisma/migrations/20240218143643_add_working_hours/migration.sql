-- CreateTable
CREATE TABLE `FoodTruckWorkingDay` (
    `id` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `workingFrom` VARCHAR(191) NOT NULL,
    `workingTo` VARCHAR(191) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,
    `foodTruckInfoId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FoodTruckWorkingDay_foodTruckInfoId_key`(`foodTruckInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoodTruckWorkingDay` ADD CONSTRAINT `FoodTruckWorkingDay_foodTruckInfoId_fkey` FOREIGN KEY (`foodTruckInfoId`) REFERENCES `FoodTruckInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
