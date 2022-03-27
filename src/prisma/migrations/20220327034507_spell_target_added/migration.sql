/*
  Warnings:

  - Added the required column `target` to the `Spell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `spell` ADD COLUMN `target` VARCHAR(191) NOT NULL;
