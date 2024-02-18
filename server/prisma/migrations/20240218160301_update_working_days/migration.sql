/*
  Warnings:

  - You are about to drop the column `workingFrom` on the `foodtruckinformation` table. All the data in the column will be lost.
  - You are about to drop the column `workingTo` on the `foodtruckinformation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `foodtruckinformation` DROP COLUMN `workingFrom`,
    DROP COLUMN `workingTo`;
