module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Reservation', {
    ReservationID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ListingID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    
  }, {
    timestamps: false ,
    freezeTableName: true,
    tableName: 'Reservation'
  });
};
