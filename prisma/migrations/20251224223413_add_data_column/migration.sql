/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ShopItem` table. All the data in the column will be lost.

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
CREATE TABLE "new_ShopItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "data" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ShopItem" ("createdAt", "description", "id", "isAvailable", "name", "price", "type") SELECT "createdAt", "description", "id", "isAvailable", "name", "price", "type" FROM "ShopItem";
DROP TABLE "ShopItem";
ALTER TABLE "new_ShopItem" RENAME TO "ShopItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
