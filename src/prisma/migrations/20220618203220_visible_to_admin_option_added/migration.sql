-- AlterTable
ALTER TABLE `attribute` ADD COLUMN `visibleToAdmin` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `characteristic` ADD COLUMN `visibleToAdmin` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `currency` ADD COLUMN `visibleToAdmin` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `info` ADD COLUMN `visibleToAdmin` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `skill` ADD COLUMN `visibleToAdmin` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `spec` ADD COLUMN `visibleToAdmin` BOOLEAN NOT NULL DEFAULT true;
