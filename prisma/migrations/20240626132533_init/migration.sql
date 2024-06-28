-- CreateEnum
CREATE TYPE "Flag" AS ENUM ('ACTIVE', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToDoList" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ToDoList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToDo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "createdById" INTEGER NOT NULL,
    "flag" "Flag" NOT NULL DEFAULT E'ACTIVE',
    "toDoListId" INTEGER NOT NULL,

    CONSTRAINT "ToDo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ToDoListToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ToDo_createdById_key" ON "ToDo"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "_ToDoListToUser_AB_unique" ON "_ToDoListToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ToDoListToUser_B_index" ON "_ToDoListToUser"("B");

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_toDoListId_fkey" FOREIGN KEY ("toDoListId") REFERENCES "ToDoList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ToDoListToUser" ADD FOREIGN KEY ("A") REFERENCES "ToDoList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ToDoListToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
