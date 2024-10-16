/*
  Warnings:

  - You are about to drop the `places` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `races` DROP FOREIGN KEY `fk_race_circuit`;

-- DropTable
DROP TABLE `places`;

-- CreateTable
CREATE TABLE `circuits` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL,

    UNIQUE INDEX `idx_circuit_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `races` ADD CONSTRAINT `fk_race_circuit` FOREIGN KEY (`circuit_id`) REFERENCES `circuits`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
