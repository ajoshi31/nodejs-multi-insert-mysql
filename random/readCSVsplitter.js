const FS = require('fs');
const CSV = require('csv');

let filePath = './src/assets/test.csv';

FS.createReadStream(filePath)
  .pipe(
    CSV.parse({
      delimiter: ',',
      skip_empty_lines: true,
      skip_lines_with_error: true
    })
  )
  .pipe(
    CSV.transform({ parallel: 1 }, function (row, callback) {
      // Getting and printing each line individually
      console.log(row);

      // Next line won't be processed unless we call the callback
      callback();
    })
  )
  .on('end', function () {
    // The process is finished
    console.log('Done.');
  })
  .on('error', function (error) {
    console.log(error.message);
  });
