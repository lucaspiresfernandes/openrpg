/*
  Warnings:

  - You are about to drop the column `default` on the `info` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `info` DROP COLUMN `default`;

-- AlterTable
ALTER TABLE `player` ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `showName` BOOLEAN NOT NULL DEFAULT true;
