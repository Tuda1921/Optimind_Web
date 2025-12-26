/*
  Warnings:

  - You are about to drop the column `feedCount` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `playCount` on the `Pet` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Pet',
    "type" TEXT NOT NULL DEFAULT 'cat',
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "hunger" INTEGER NOT NULL DEFAULT 50,
    "happiness" INTEGER NOT NULL DEFAULT 50,
    "energy" INTEGER NOT NULL DEFAULT 50,
    "lastFed" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pet" ("createdAt", "energy", "happiness", "hunger", "id", "lastFed", "level", "name", "type", "updatedAt", "userId") SELECT "createdAt", "energy", "happiness", "hunger", "id", "lastFed", "level", "name", "type", "updatedAt", "userId" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
CREATE UNIQUE INDEX "Pet_userId_key" ON "Pet"("userId");
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
