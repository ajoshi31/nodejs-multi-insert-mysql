import { OkPacket } from 'mysql';
import pool from './dbConfig';

const seed = () => {
  const queryString = `CREATE TABLE IF NOT EXISTS Product (
  id int(11) NOT NULL,
  customerName varchar(100) DEFAULT NULL,
  contactNumber varchar(100) DEFAULT NULL,
  modelName varchar(255) NOT NULL,
  retailerName varchar(100) NOT NULL,
  dateOfPurchase varchar(100) NOT NULL,
  voucherCode varchar(100) NOT NULL,
  voucherValue int(10) DEFAULT NULL,
  surveyUrl varchar(255) NOT NULL,
  surveyId varchar(255) NOT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  pool.query(queryString, (err, result) => {
    if (err) {
      console.log(err);
    }

    const insertId = (<OkPacket>result).insertId;
    console.log('Insert andy data', insertId);
  });
};

export default seed;
