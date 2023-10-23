-- CreateTable
CREATE TABLE `Collection` (
    `CollectionID` INTEGER NOT NULL AUTO_INCREMENT,
    `Status` INTEGER NOT NULL,
    `ReservationIDField` INTEGER NULL,
    `UserIDField` INTEGER NULL,

    PRIMARY KEY (`CollectionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Listing` (
    `ListingID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `Datetime` DATETIME(3) NOT NULL,
    `ExpiryDate` DATE NOT NULL,
    `Category` VARCHAR(255) NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `Description` TEXT NULL,
    `Image` LONGBLOB NULL,
    `PickUpAddressFirst` VARCHAR(255) NULL,
    `PickUpAddressSecond` VARCHAR(255) NULL,
    `PickUpAddressThird` VARCHAR(255) NULL,
    `PickUpPostalCode` VARCHAR(20) NULL,
    `PickUpStartDate` DATE NOT NULL,
    `PickUpEndDate` DATE NOT NULL,
    `PickUpStartTime` TIME NOT NULL,
    `PickUpEndTime` TIME NOT NULL,

    PRIMARY KEY (`ListingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `ReservationID` INTEGER NOT NULL AUTO_INCREMENT,
    `Datetime` DATETIME(3) NOT NULL,
    `Status` INTEGER NOT NULL,
    `Remarks` TEXT NULL,
    `UserIDField` INTEGER NULL,
    `ListingIDField` INTEGER NULL,

    PRIMARY KEY (`ReservationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(255) NOT NULL,
    `FirstName` VARCHAR(255) NOT NULL,
    `LastName` VARCHAR(255) NOT NULL,
    `Role` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `DOB` DATE NOT NULL,
    `AddressFirst` VARCHAR(255) NULL,
    `AddressSecond` VARCHAR(255) NULL,
    `AddressThird` VARCHAR(255) NULL,
    `PostalCode` VARCHAR(20) NULL,

    UNIQUE INDEX `User_Username_key`(`Username`),
    UNIQUE INDEX `User_Email_key`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_ReservationIDField_fkey` FOREIGN KEY (`ReservationIDField`) REFERENCES `Reservation`(`ReservationID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_UserIDField_fkey` FOREIGN KEY (`UserIDField`) REFERENCES `User`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_UserIDField_fkey` FOREIGN KEY (`UserIDField`) REFERENCES `User`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_ListingIDField_fkey` FOREIGN KEY (`ListingIDField`) REFERENCES `Listing`(`ListingID`) ON DELETE SET NULL ON UPDATE CASCADE;
