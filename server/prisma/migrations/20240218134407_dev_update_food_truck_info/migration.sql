/*
  Warnings:

  - You are about to drop the column `ageFrom` on the `foodtruckinformation` table. All the data in the column will be lost.
  - You are about to drop the column `ageTo` on the `foodtruckinformation` table. All the data in the column will be lost.
  - You are about to drop the column `daysInMonth` on the `foodtruckinformation` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `foodtruckinformation` table. All the data in the column will be lost.
  - Added the required column `workingFrom` to the `FoodTruckInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingTo` to the `FoodTruckInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `foodtruckinformation` DROP COLUMN `ageFrom`,
    DROP COLUMN `ageTo`,
    DROP COLUMN `daysInMonth`,
    DROP COLUMN `gender`,
    ADD COLUMN `workingFrom` VARCHAR(191) NOT NULL,
    ADD COLUMN `workingTo` VARCHAR(191) NOT NULL;
