-- CreateTable
CREATE TABLE "CodeIteration" (
    "id" TEXT NOT NULL,
    "generatedAppId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shadcn" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CodeIteration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "iterationId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeIteration_generatedAppId_idx" ON "CodeIteration"("generatedAppId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_iterationId_key" ON "Feedback"("iterationId");

-- CreateIndex
CREATE INDEX "Feedback_iterationId_idx" ON "Feedback"("iterationId");

-- AddForeignKey
ALTER TABLE "CodeIteration" ADD CONSTRAINT "CodeIteration_generatedAppId_fkey" FOREIGN KEY ("generatedAppId") REFERENCES "GeneratedApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_iterationId_fkey" FOREIGN KEY ("iterationId") REFERENCES "CodeIteration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
