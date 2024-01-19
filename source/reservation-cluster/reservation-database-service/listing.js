module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Listing', {
      ListingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ExpiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PickUpAddressFirst: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PickUpAddressSecond: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PickUpAddressThird: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PickUpPostalCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PickUpStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      PickUpEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      PickUpStartTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      PickUpEndTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      ContactPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ContactEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'Listing',
    });
  };
  