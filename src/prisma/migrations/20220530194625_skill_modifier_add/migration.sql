/*
  Warnings:

  - You are about to alter the column `modifier` on the `playercharacteristic` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `playercharacteristic` MODIFY `modifier` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `playerskill` ADD COLUMN `modifier` INTEGER NOT NULL DEFAULT 0;
