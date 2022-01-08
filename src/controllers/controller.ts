import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { getProducts, insertProduct } from '../repo';
import { performance } from 'perf_hooks';

const uploadDataController = async (req: Request, res: Response) => {
  try {
    // Call the insert to some other function as background service
    // and this should handle the processing with errors

    const [data, error] = await handle(readFile());
    if (error) {
      return res.status(500).send('Some error');
    }
    const dataLen = JSON.parse(JSON.stringify(data)).length;
    console.log(dataLen);
    dataForProcessing(data);
    return res.status(200).json({ data: 'Data send for processing' });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Some error here');
  }
};

const readFile = () => {
  const softCustomerSurveyData: any = [];

  return new Promise<void>(function (resolve, reject) {
    fs.createReadStream(path.resolve(__dirname, 'assets', 'test.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        reject(error);
      })
      .on('data', (row) => {
        softCustomerSurveyData.push(row);
      })
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`);
        resolve(softCustomerSurveyData);
      });
  });
};

const fetchAllProducts = async (req: Request, res: Response) => {
  try {
    const data = await getProducts('Product');
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const wrapTask = async (promise: any) => {
  try {
    return await promise;
  } catch (e) {
    return e;
  }
};

const handle = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return await Promise.resolve([undefined, error]);
  }
};

const dataForProcessing = async (arrayItems: any) => {
  const tasks = arrayItems.map(task);
  const startTime = performance.now();

  console.log(`Tasks starting...`);
  try {
    const results = await Promise.all(tasks.map(wrapTask));
    console.log(
      `Task finished in ${performance.now() - startTime} miliseconds with,`,
      results
    );
  } catch (e) {
    console.log('should not happen but we never know', e);
  }
};

const task = async (item: any) => {
  //console.log(`Parallel Task Running for ${item.customerName}`);
  let table = 'Product';
  if (item.contactNumber == '8800210524') {
    table = 'trsststs';
  }
  if (item.contactNumber == '9134743017') {
    item.casda = 'asdasd';
  }

  const [data, readError] = await handle(getProducts(table));
  if (readError) {
    return 'Some error in read of table';
  }

  data[0];

  const [insertId, insertErr] = await handle(insertProduct(item));
  if (insertErr) {
    return `Some error to log and continue process for ${item}`;
  }
  return `Done for ${insertId}`;
};

export { uploadDataController, fetchAllProducts };
