/*
  Warnings:

  - You are about to alter the column `amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(13,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
