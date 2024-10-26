/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roles` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `drivers` ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `password_hash` VARCHAR(255) NOT NULL,
    ADD COLUMN `roles` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `idx_driver_email_unique` ON `drivers`(`email`);
