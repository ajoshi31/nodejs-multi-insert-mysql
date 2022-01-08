import transform from 'parallel-transform';

const stream = transform(
  5,
  function (data: any, callback: (arg0: any, arg1: any) => void) {
    // 10 is the parallism level
    setTimeout(function () {
      callback(null, data);
    }, Math.random() * 1000);
  }
);

for (let i = 0; i < 10; i++) {
  stream.write('' + i);
}
stream.end();

stream.on('data', function (data) {
  console.log(data); // prints 0,1,2,...
});
stream.on('end', function () {
  console.log('stream has ended');
});
