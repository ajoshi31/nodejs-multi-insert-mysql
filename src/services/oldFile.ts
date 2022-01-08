import FS from 'fs';
import path from 'path';
import readLine from 'readline';
class FileSplitter {
  private fileCount: number;
  fileURI: FS.PathLike;
  outputName: string;
  readStream: FS.ReadStream;
  count: any;
  writeStream: any;
  output: any;

  constructor(fileURI: FS.PathLike, splitLine: number) {
    this.fileCount = 1;
    this.output = path.normalize(`${__dirname}./../output/`);
    this.fileURI = fileURI;
    this.outputName = this.output + 'output.csv.' + this.fileCount;
    this.createWriteStream();
    this.readStream = FS.createReadStream(fileURI);
    const lineReader = readLine.createInterface({
      input: this.readStream
    });
    lineReader.on('line', (line) => {
      this.count++;
      this.writeStream.write(line + '\n');
      if (this.count >= splitLine) {
        this.fileCount++;
        console.log('File:', this.outputName, this.count);
        this.writeStream.end();
        this.createWriteStream();
      }
    });
    lineReader.on('close', () => {
      if (this.count > 0) {
        console.log('File:', this.outputName, this.count);
      }
      this.readStream.close();
      this.writeStream.end();
      console.log('Done.');
    });
  }

  createWriteStream() {
    this.outputName = this.output + 'output.csv.' + this.fileCount;
    this.writeStream = FS.createWriteStream(this.outputName);
    this.count = 0;
  }

  countFun(): number {
    return this.fileCount;
  }
}
export default FileSplitter;
