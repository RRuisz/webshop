-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_merchantId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "merchantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
