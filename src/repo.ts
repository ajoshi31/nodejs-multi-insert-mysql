import pool from './dbConfig';

const getProducts = (table: any) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM ${table}`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};
const getProductById = (id: any, table: any) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM ${table} WHERE id = ${id}`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

const insertProduct = (data: any) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO Product SET ?`,
      [
        {
          ...data
        }
      ],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
};

export { insertProduct, getProducts, getProductById };
