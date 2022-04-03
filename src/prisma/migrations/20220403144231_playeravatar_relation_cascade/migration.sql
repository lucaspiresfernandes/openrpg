-- DropForeignKey
ALTER TABLE `playeravatar` DROP FOREIGN KEY `PlayerAvatar_attribute_status_id_fkey`;

-- AddForeignKey
ALTER TABLE `PlayerAvatar` ADD CONSTRAINT `PlayerAvatar_attribute_status_id_fkey` FOREIGN KEY (`attribute_status_id`) REFERENCES `AttributeStatus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
