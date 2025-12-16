/*
  Warnings:

  - You are about to drop the column `customerId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `sendNotify` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `AppointmentItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repair` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PreferredContactMethod" AS ENUM ('PHONE', 'EMAIL', 'NONE');

-- CreateEnum
CREATE TYPE "AppointmentSource" AS ENUM ('APP', 'PHONE', 'MANUAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_customerId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentItem" DROP CONSTRAINT "AppointmentItem_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentItem" DROP CONSTRAINT "AppointmentItem_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Repair" DROP CONSTRAINT "Repair_purchaseId_fkey";

-- DropIndex
DROP INDEX "Appointment_customerId_startTime_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "customerId",
DROP COLUMN "note",
DROP COLUMN "sendNotify",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "serviceName" TEXT NOT NULL,
ADD COLUMN     "source" "AppointmentSource" NOT NULL,
ADD COLUMN     "wigPurchaseId" TEXT;

-- DropTable
DROP TABLE "AppointmentItem";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Purchase";

-- DropTable
DROP TABLE "Repair";

-- DropTable
DROP TABLE "Service";

-- DropEnum
DROP TYPE "PaymentMethod";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "preferredContactMethod" "PreferredContactMethod" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WigPurchase" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "wigDescription" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "warrantyEndDate" TIMESTAMP(3) NOT NULL,
    "freeStylingEndDate" TIMESTAMP(3),
    "maxFreeStylingVisits" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WigPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceVisit" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "wigPurchaseId" TEXT,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "serviceName" TEXT NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "freeReason" TEXT,
    "priceCharged" INTEGER NOT NULL,
    "internalCost" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT,
    "serviceVisitId" TEXT,
    "wigPurchaseId" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WigPurchase_clientId_purchaseDate_idx" ON "WigPurchase"("clientId", "purchaseDate");

-- CreateIndex
CREATE INDEX "WigPurchase_warrantyEndDate_idx" ON "WigPurchase"("warrantyEndDate");

-- CreateIndex
CREATE INDEX "ServiceVisit_appointmentId_visitDate_idx" ON "ServiceVisit"("appointmentId", "visitDate");

-- CreateIndex
CREATE INDEX "Transaction_transactionDate_idx" ON "Transaction"("transactionDate");

-- CreateIndex
CREATE INDEX "Appointment_clientId_startTime_idx" ON "Appointment"("clientId", "startTime");

-- AddForeignKey
ALTER TABLE "WigPurchase" ADD CONSTRAINT "WigPurchase_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_wigPurchaseId_fkey" FOREIGN KEY ("wigPurchaseId") REFERENCES "WigPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVisit" ADD CONSTRAINT "ServiceVisit_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVisit" ADD CONSTRAINT "ServiceVisit_wigPurchaseId_fkey" FOREIGN KEY ("wigPurchaseId") REFERENCES "WigPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_serviceVisitId_fkey" FOREIGN KEY ("serviceVisitId") REFERENCES "ServiceVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_wigPurchaseId_fkey" FOREIGN KEY ("wigPurchaseId") REFERENCES "WigPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
