/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
CREATE SEQUENCE order_number_seq;
ALTER TABLE "Order" ALTER COLUMN "number" SET DEFAULT nextval('order_number_seq'),
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;
ALTER SEQUENCE order_number_seq OWNED BY "Order"."number";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "banner" TEXT NOT NULL DEFAULT 'https://via.placeholder.com/150';
