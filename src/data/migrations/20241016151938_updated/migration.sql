-- DropForeignKey
ALTER TABLE `races` DROP FOREIGN KEY `fk_race_circuit`;

-- DropForeignKey
ALTER TABLE `results` DROP FOREIGN KEY `fk_result_driver`;

-- DropForeignKey
ALTER TABLE `results` DROP FOREIGN KEY `fk_result_race`;

-- AddForeignKey
ALTER TABLE `races` ADD CONSTRAINT `fk_race_circuit` FOREIGN KEY (`circuit_id`) REFERENCES `places`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `fk_result_race` FOREIGN KEY (`race_id`) REFERENCES `races`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `fk_result_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
