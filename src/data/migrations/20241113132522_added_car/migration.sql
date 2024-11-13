/*
  Warnings:

  - Added the required column `car_id` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `results` ADD COLUMN `car_id` INTEGER UNSIGNED NOT NULL;

-- CreateTable
CREATE TABLE `cars` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(255) NOT NULL,
    `weight` FLOAT NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,
    `team_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `fk_result_car` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `fk_car_team` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
