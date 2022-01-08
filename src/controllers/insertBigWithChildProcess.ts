import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getProductById, insertProduct } from '../repo';
import { performance } from 'perf_hooks';

import Papa from 'papaparse';

let processedNum = 0;

const insertBig = async (req: Request, res: Response) => {
  try {
    const filePath = path.normalize(`${__dirname}./../assets/test.csv.1`);

    /*
      Hav N files and Y CPU process Each CPU should process N/y files 

      100 / 4

      (100/4 * i) + 1 -> 100/4 * (i+1)
      Loop over cpu process
      i=0 => 1,25
      i=1 => 26, 50,
      i=2 => 51, 75
      i=3 => 76, 100 + extra 
      
      
        Loop over all the files with that modulo -> N/y files for process x
        
        const loop = async () => {
          for (let i = 0; i < 10; i++) {
            for i cehck file 
            let a = await importCSV(i)
            console.log(a);
          }
        }

   

        loop()

     */

    importCSV(filePath).catch((error) => {
      return res.status(500).send('Some error here in isert biG 123');
    });
    return res.status(200).json({ data: 'Data send for processing 123' });
  } catch (error) {
    return res.status(500).send('Some error here in isert biG 123');
  }
};

async function importCSV(filePath: fs.PathLike) {
  let parsedNum = 0;
  const dataStream = fs.createReadStream(filePath);
  const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
    header: true
  });
  dataStream.pipe(parseStream);
  let buffer = [];
  let totalTime = 0;
  const startTime = performance.now();
  for await (const row of parseStream) {
    //console.log('PA#', parsedNum, ': parsed');
    buffer.push(row);
    parsedNum++;
    if (parsedNum % 400 == 0) {
      await dataForProcessing(buffer);
      buffer = [];
    }
  }
  totalTime = totalTime + (performance.now() - startTime);
  console.log(`Parsed ${parsedNum} rows and took ${totalTime} seconds`);
}

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
  console.log('DW#', processedNum, ': dirty work START');
  try {
    await Promise.all(tasks.map(wrapTask));

    console.log(
      `Task finished in ${performance.now() - startTime} miliseconds with,`
    );
    processedNum++;
  } catch (e) {
    console.log('should not happen but we never know', e);
  }
};

const task = async (item: any) => {
  let table = 'Product';

  if (item.contactNumber == '8800210524') {
    table = 'random table'; // ro create read error
  }
  if (item.contactNumber == '9134743017') {
    item.randomRow = 'random'; // to create insert error
  }

  // To add some read process
  const [data, readError] = await handle(getProductById(2, table));
  if (readError) {
    return 'Some error in read of table';
  }
  //console.log(JSON.parse(JSON.stringify(data))[0]['customerName']);
  data;
  // To add some write process
  const [insertId, insertErr] = await handle(insertProduct(item));
  if (insertErr) {
    return `Some error to log and continue process for ${item}`;
  }
  return `Done for ${insertId}`;
};

export { insertBig };
