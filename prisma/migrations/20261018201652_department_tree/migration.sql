/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Position` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Position` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_departmentId_fkey";

-- DropIndex
DROP INDEX "Position_departmentId_name_key";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "departmentId";

-- CreateTable
CREATE TABLE "_DepartmentToPosition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DepartmentToPosition_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DepartmentToPosition_B_index" ON "_DepartmentToPosition"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToPosition" ADD CONSTRAINT "_DepartmentToPosition_A_fkey" FOREIGN KEY ("A") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToPosition" ADD CONSTRAINT "_DepartmentToPosition_B_fkey" FOREIGN KEY ("B") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;
