-- CreateTable
CREATE TABLE `Trade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` INTEGER NOT NULL,
    `sender_object_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `receiver_object_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trade` ADD CONSTRAINT `Trade_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trade` ADD CONSTRAINT `Trade_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
