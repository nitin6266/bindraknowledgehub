-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('SIBLING', 'MERIT', 'SPECIAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DiscountMode" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE');

-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('CHARGE', 'PAYMENT', 'DISCOUNT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('SINGLE', 'BATCH', 'CLASS', 'SESSION');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateTable
CREATE TABLE "FeeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeStructure" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "batchId" TEXT,
    "categoryId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "lateFeeAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lateFeeAfterDays" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFee" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "structureId" TEXT,
    "sessionId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "batchId" TEXT,
    "assignmentType" TEXT NOT NULL DEFAULT 'SINGLE',
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dueAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFeeInstallment" (
    "id" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paidDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentFeeInstallment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeDiscount" (
    "id" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reason" TEXT,
    "approvedBy" TEXT,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeePayment" (
    "id" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "receiptId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "mode" TEXT NOT NULL,
    "transactionRef" TEXT,
    "collectedById" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeReceipt" (
    "id" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "discountAmount" DECIMAL(65,30) NOT NULL,
    "paidAmount" DECIMAL(65,30) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "generatedById" TEXT NOT NULL,
    "meta" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeLedger" (
    "id" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "balanceAfter" DECIMAL(65,30) NOT NULL,
    "referenceId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeeLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeeCategory_name_key" ON "FeeCategory"("name");

-- CreateIndex
CREATE INDEX "FeeCategory_status_idx" ON "FeeCategory"("status");

-- CreateIndex
CREATE INDEX "FeeCategory_deletedAt_idx" ON "FeeCategory"("deletedAt");

-- CreateIndex
CREATE INDEX "FeeStructure_sessionId_idx" ON "FeeStructure"("sessionId");

-- CreateIndex
CREATE INDEX "FeeStructure_classId_idx" ON "FeeStructure"("classId");

-- CreateIndex
CREATE INDEX "FeeStructure_batchId_idx" ON "FeeStructure"("batchId");

-- CreateIndex
CREATE INDEX "FeeStructure_categoryId_idx" ON "FeeStructure"("categoryId");

-- CreateIndex
CREATE INDEX "FeeStructure_status_idx" ON "FeeStructure"("status");

-- CreateIndex
CREATE INDEX "FeeStructure_deletedAt_idx" ON "FeeStructure"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentFee_studentId_idx" ON "StudentFee"("studentId");

-- CreateIndex
CREATE INDEX "StudentFee_sessionId_idx" ON "StudentFee"("sessionId");

-- CreateIndex
CREATE INDEX "StudentFee_classId_idx" ON "StudentFee"("classId");

-- CreateIndex
CREATE INDEX "StudentFee_batchId_idx" ON "StudentFee"("batchId");

-- CreateIndex
CREATE INDEX "StudentFee_categoryId_idx" ON "StudentFee"("categoryId");

-- CreateIndex
CREATE INDEX "StudentFee_status_idx" ON "StudentFee"("status");

-- CreateIndex
CREATE INDEX "StudentFee_deletedAt_idx" ON "StudentFee"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentFeeInstallment_studentFeeId_idx" ON "StudentFeeInstallment"("studentFeeId");

-- CreateIndex
CREATE INDEX "StudentFeeInstallment_status_idx" ON "StudentFeeInstallment"("status");

-- CreateIndex
CREATE INDEX "StudentFeeInstallment_deletedAt_idx" ON "StudentFeeInstallment"("deletedAt");

-- CreateIndex
CREATE INDEX "FeeDiscount_studentFeeId_idx" ON "FeeDiscount"("studentFeeId");

-- CreateIndex
CREATE INDEX "FeeDiscount_studentId_idx" ON "FeeDiscount"("studentId");

-- CreateIndex
CREATE INDEX "FeeDiscount_status_idx" ON "FeeDiscount"("status");

-- CreateIndex
CREATE INDEX "FeeDiscount_deletedAt_idx" ON "FeeDiscount"("deletedAt");

-- CreateIndex
CREATE INDEX "FeePayment_studentFeeId_idx" ON "FeePayment"("studentFeeId");

-- CreateIndex
CREATE INDEX "FeePayment_studentId_idx" ON "FeePayment"("studentId");

-- CreateIndex
CREATE INDEX "FeePayment_receiptId_idx" ON "FeePayment"("receiptId");

-- CreateIndex
CREATE INDEX "FeePayment_paymentDate_idx" ON "FeePayment"("paymentDate");

-- CreateIndex
CREATE INDEX "FeePayment_deletedAt_idx" ON "FeePayment"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeeReceipt_receiptNumber_key" ON "FeeReceipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "FeeReceipt_studentFeeId_idx" ON "FeeReceipt"("studentFeeId");

-- CreateIndex
CREATE INDEX "FeeReceipt_studentId_idx" ON "FeeReceipt"("studentId");

-- CreateIndex
CREATE INDEX "FeeReceipt_receiptNumber_idx" ON "FeeReceipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "FeeReceipt_deletedAt_idx" ON "FeeReceipt"("deletedAt");

-- CreateIndex
CREATE INDEX "FeeLedger_studentFeeId_idx" ON "FeeLedger"("studentFeeId");

-- CreateIndex
CREATE INDEX "FeeLedger_studentId_idx" ON "FeeLedger"("studentId");

-- CreateIndex
CREATE INDEX "FeeLedger_type_idx" ON "FeeLedger"("type");
