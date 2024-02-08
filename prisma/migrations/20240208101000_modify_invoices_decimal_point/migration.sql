/*
  Warnings:

  - You are about to alter the column `amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(13,2)`.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(13,2);
