-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticleTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ArticleTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArticleTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titel" TEXT NOT NULL,
    "body" TEXT,
    "authorid" INTEGER NOT NULL,
    "categoryId" INTEGER,
    CONSTRAINT "Article_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("authorid", "body", "id", "titel") SELECT "authorid", "body", "id", "titel" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleTags_AB_unique" ON "_ArticleTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleTags_B_index" ON "_ArticleTags"("B");
