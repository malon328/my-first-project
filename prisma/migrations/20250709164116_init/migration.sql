-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titel" TEXT NOT NULL,
    "body" TEXT,
    "authorid" INTEGER NOT NULL,
    CONSTRAINT "Article_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
