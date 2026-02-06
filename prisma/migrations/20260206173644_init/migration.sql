-- CreateTable
CREATE TABLE "quadra" (
    "quadra_id" SERIAL NOT NULL,
    "quadra_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cep" TEXT,
    "numero" TEXT,
    "endereco" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "estado_codigo" TEXT,
    "pais" TEXT,
    "pais_iso" TEXT,

    CONSTRAINT "quadra_pkey" PRIMARY KEY ("quadra_id")
);

-- CreateTable
CREATE TABLE "unidade" (
    "unidade_id" SERIAL NOT NULL,
    "unidade_numero" TEXT NOT NULL,
    "quadra_id" INTEGER NOT NULL,
    "mora" TEXT,
    "contato" TEXT,
    "vistoria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidade_pkey" PRIMARY KEY ("unidade_id")
);

-- CreateTable
CREATE TABLE "aviso" (
    "aviso_id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "url" TEXT,
    "url_metadata" TEXT,
    "autor" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "fixado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aviso_pkey" PRIMARY KEY ("aviso_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quadra_quadra_name_key" ON "quadra"("quadra_name");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_unidade_numero_key" ON "unidade"("unidade_numero");

-- CreateIndex
CREATE INDEX "aviso_ativo_fixado_createdAt_idx" ON "aviso"("ativo", "fixado", "createdAt");

-- AddForeignKey
ALTER TABLE "unidade" ADD CONSTRAINT "unidade_quadra_id_fkey" FOREIGN KEY ("quadra_id") REFERENCES "quadra"("quadra_id") ON DELETE CASCADE ON UPDATE CASCADE;
