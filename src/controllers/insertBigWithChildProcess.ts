import { Request, Response } from 'express';
var child_process = require('child_process');

const insertBigChildProcess = async (req: Request, res: Response) => {
  try {
    var numchild = require('os').cpus().length;
    var done = 0;
    let totalProcessTime: any[] = [];
    for (var i = 1; i <= numchild; i++) {
      const child = child_process.fork(__dirname + '/child.ts');
      child.send(i);
      child.on('message', function (message: any) {
        console.log('[parent] received message from child:', message);
        totalProcessTime.push(message.time);
        const sum = totalProcessTime.reduce(
          (partial_sum, a) => partial_sum + a,
          0
        );
        console.log(sum); // 6
        console.log(totalProcessTime);
        done++;
        if (done === numchild) {
          console.log('[parent] received all results');
        }
      });
    }

  
    return res.status(200).json({ data: 'Data send for processing 123' });
  } catch (error) {
    return res.status(500).send('Some error here in isert biG 123');
  }
};

export { insertBigChildProcess };
