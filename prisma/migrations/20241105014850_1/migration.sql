-- CreateTable
CREATE TABLE `User` (
    `cuid` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`cuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trim` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trim` VARCHAR(191) NULL,
    `trimDetail` VARCHAR(191) NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `backgroundImg` VARCHAR(191) NOT NULL,
    `brochure` VARCHAR(191) NOT NULL,
    `otr` VARCHAR(191) NOT NULL,
    `otrPrice` INTEGER NOT NULL,
    `urlBackgroundImg` VARCHAR(191) NOT NULL,
    `urlBrochure` VARCHAR(191) NOT NULL,
    `urlWarrantyImg` VARCHAR(191) NOT NULL,
    `warrantyImg` VARCHAR(191) NOT NULL,
    `LinkPage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Trim_vehicleId_fkey`(`vehicleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `backgroundColor` VARCHAR(191) NOT NULL,
    `descColor` VARCHAR(191) NOT NULL,
    `colorsImage` VARCHAR(191) NOT NULL,
    `urlcolorsImage` VARCHAR(191) NOT NULL,
    `trimId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Color_trimId_fkey`(`trimId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `headTitle1` VARCHAR(191) NOT NULL,
    `headTitle2` VARCHAR(191) NOT NULL,
    `imgView` VARCHAR(191) NOT NULL,
    `text1` VARCHAR(191) NOT NULL,
    `text2` VARCHAR(191) NOT NULL,
    `text3` VARCHAR(191) NOT NULL,
    `urlImgView` VARCHAR(191) NOT NULL,
    `headTitle3` VARCHAR(191) NOT NULL,
    `headTitle4` VARCHAR(191) NULL,
    `headTitle5` VARCHAR(191) NULL,
    `text4` VARCHAR(191) NULL,
    `text5` VARCHAR(191) NULL,
    `trimId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Specification_trimId_fkey`(`trimId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImgSlide` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `urlImage` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dealer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `urlFacebook` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `urlMaps` VARCHAR(191) NOT NULL,
    `urlInstagram` VARCHAR(191) NOT NULL,
    `imgDealer` VARCHAR(191) NOT NULL,
    `urlImageDealer` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trim` ADD CONSTRAINT `Trim_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Color` ADD CONSTRAINT `Color_trimId_fkey` FOREIGN KEY (`trimId`) REFERENCES `Trim`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specification` ADD CONSTRAINT `Specification_trimId_fkey` FOREIGN KEY (`trimId`) REFERENCES `Trim`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
