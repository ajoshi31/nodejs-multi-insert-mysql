import * as fs from 'fs';
import * as path from 'path';
import { getProductById, insertProduct } from '../repo';
import { performance } from 'perf_hooks';

import Papa from 'papaparse';

let processedNum = 0;

process.on('message', async function (message: any) {
  console.log('[child] received message from server:', message);
  JSON.stringify(process.argv);
  const filePath = path.normalize(
    `${__dirname}./../output/output.csv.${message}`
  );

  let time = await importCSV(filePath, message);
  if (process.send) {
    process.send({
      child: process.pid,
      result: message + 1,
      time: time
    });
  }

  process.disconnect();
});

async function importCSV(filePath: fs.PathLike, message: any) {
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
    // console.log('Child Server # :', message, 'PA#', parsedNum, ': parsed');
    buffer.push(row);
    parsedNum++;
    if (parsedNum % 400 == 0) {
      await dataForProcessing(buffer, message);
      buffer = [];
    }
  }

  totalTime = totalTime + (performance.now() - startTime);
  //   console.log(
  //     `Child Server ${message} : Parsed ${parsedNum} rows and took ${totalTime} seconds`
  //   );
  return totalTime;
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

const dataForProcessing = async (arrayItems: any, message: any) => {
  const tasks = arrayItems.map(task);
  const startTime = performance.now();
  console.log(`Tasks starting... from server ${message}`);
  console.log('CS#: ', message, 'DW#:', processedNum, ': dirty work START');
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
