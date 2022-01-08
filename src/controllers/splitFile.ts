import { Request, Response } from 'express';
import path from 'path';
import FileSplitter from '../services/fileSplitter';
const splitFile = async (req: Request, res: Response) => {
  try {
    const filePath = path.normalize(`${__dirname}./../assets/test.csv`);
    const splitInstance = new FileSplitter(filePath);
    const count = await splitInstance.splitFileFunc(406);
    console.log(count);
    return res.status(200).json({ date: `Main file is split into files ` });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
export { splitFile };
