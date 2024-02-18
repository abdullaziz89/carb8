-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuisine` (
    `id` VARCHAR(191) NOT NULL,
    `nameEng` VARCHAR(191) NOT NULL,
    `nameArb` VARCHAR(191) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cuisine_nameEng_key`(`nameEng`),
    UNIQUE INDEX `Cuisine_nameArb_key`(`nameArb`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FoodTruck` (
    `id` VARCHAR(191) NOT NULL,
    `nameEng` VARCHAR(191) NOT NULL,
    `nameArb` VARCHAR(191) NOT NULL,
    `descriptionEng` VARCHAR(500) NULL,
    `descriptionArb` VARCHAR(500) NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,
    `cuisineId` VARCHAR(191) NULL,

    UNIQUE INDEX `FoodTruck_nameEng_key`(`nameEng`),
    UNIQUE INDEX `FoodTruck_nameArb_key`(`nameArb`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FoodTruckInformation` (
    `id` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'BOTH') NOT NULL,
    `ageFrom` INTEGER NOT NULL,
    `ageTo` INTEGER NOT NULL,
    `daysInMonth` INTEGER NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `instagramAccount` VARCHAR(191) NULL,
    `foodTruckId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FoodTruckInformation_id_key`(`id`),
    UNIQUE INDEX `FoodTruckInformation_foodTruckId_key`(`foodTruckId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Governorate` (
    `id` VARCHAR(191) NOT NULL,
    `nameEng` VARCHAR(191) NOT NULL,
    `nameArb` VARCHAR(191) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Governorate_nameEng_key`(`nameEng`),
    UNIQUE INDEX `Governorate_nameArb_key`(`nameArb`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `googleLocation` VARCHAR(191) NULL,
    `googleLat` DOUBLE NULL,
    `googleLng` DOUBLE NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,
    `governorateId` VARCHAR(191) NULL,
    `foodTruckId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Address_foodTruckId_key`(`foodTruckId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FoodTruckView` (
    `id` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `foodTruckId` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FoodTruckView_foodTruckId_key`(`foodTruckId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CuisineView` (
    `id` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `cuisineId` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CuisineView_cuisineId_key`(`cuisineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeaderImage` (
    `id` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `linkType` ENUM('EXTERNAL', 'INTERNAL') NULL,
    `imageUrl` VARCHAR(191) NULL,
    `type` ENUM('ACADEMY', 'EVENT') NULL,
    `numberOfClicks` INTEGER NOT NULL DEFAULT 0,
    `order` INTEGER NOT NULL DEFAULT 0,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `nameEng` VARCHAR(191) NOT NULL,
    `nameArb` VARCHAR(191) NOT NULL,
    `descriptionEng` VARCHAR(191) NULL,
    `descriptionArb` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NULL,
    `enable` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_nameEng_key`(`nameEng`),
    UNIQUE INDEX `Event_nameArb_key`(`nameArb`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventView` (
    `id` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `eventId` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EventView_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodTruck` ADD CONSTRAINT `FoodTruck_cuisineId_fkey` FOREIGN KEY (`cuisineId`) REFERENCES `Cuisine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodTruckInformation` ADD CONSTRAINT `FoodTruckInformation_foodTruckId_fkey` FOREIGN KEY (`foodTruckId`) REFERENCES `FoodTruck`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_governorateId_fkey` FOREIGN KEY (`governorateId`) REFERENCES `Governorate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_foodTruckId_fkey` FOREIGN KEY (`foodTruckId`) REFERENCES `FoodTruck`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodTruckView` ADD CONSTRAINT `FoodTruckView_foodTruckId_fkey` FOREIGN KEY (`foodTruckId`) REFERENCES `FoodTruck`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CuisineView` ADD CONSTRAINT `CuisineView_cuisineId_fkey` FOREIGN KEY (`cuisineId`) REFERENCES `Cuisine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventView` ADD CONSTRAINT `EventView_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
