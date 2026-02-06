-- CreateEnum
CREATE TYPE "aviso_tipo" AS ENUM ('Aviso', 'Publi');

-- AlterTable
ALTER TABLE "aviso" ADD COLUMN     "tipo" "aviso_tipo" NOT NULL DEFAULT 'Publi';
