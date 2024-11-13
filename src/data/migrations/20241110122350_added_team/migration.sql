-- AlterTable
ALTER TABLE `drivers` ADD COLUMN `team_id` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NULL,
    `join_date` DATETIME(0) NOT NULL,

    UNIQUE INDEX `idx_team_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `drivers` ADD CONSTRAINT `fk_driver_team` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
