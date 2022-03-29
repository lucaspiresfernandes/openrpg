/*
  Warnings:

  - The primary key for the `config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `key` on the `config` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `config` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - Added the required column `name` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `config` DROP PRIMARY KEY,
    DROP COLUMN `key`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `value` JSON NOT NULL,
    ADD PRIMARY KEY (`name`);
