-- AlterTable
ALTER TABLE `player` MODIFY `username` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `role` ENUM('PLAYER', 'NPC', 'ADMIN') NOT NULL;
