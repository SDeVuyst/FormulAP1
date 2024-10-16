-- CreateTable
CREATE TABLE `places` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL,

    UNIQUE INDEX `idx_circuit_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `races` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `laps` INTEGER NOT NULL,
    `circuit_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `results` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `position` MEDIUMINT UNSIGNED NOT NULL,
    `points` MEDIUMINT NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `race_id` INTEGER UNSIGNED NOT NULL,
    `driver_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drivers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `races` ADD CONSTRAINT `fk_race_circuit` FOREIGN KEY (`circuit_id`) REFERENCES `places`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `fk_result_race` FOREIGN KEY (`race_id`) REFERENCES `races`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `fk_result_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
