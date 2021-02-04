var fs = require('fs');
var readline = require('readline');

//调用方法
var path = 'database_export-xxYgIeN55P7V.json';
read_file(path, function (data) {
  const stats = {
    total: data.length,
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    finished: [],
  };
  data.forEach((user) => {
    const set = new Set();
    user.history.forEach((day) => {
      day.record.forEach((draw) => {
        if (draw.name !== 'e') {
          set.add(draw.name);
        }
      });
    });
    const hasBlessings = Array.from(set);
    stats[hasBlessings.length]++;
    if (hasBlessings.length === 4) {
      stats.finished.push(
        `${user.userinfo.name}(${user.userinfo.id}) - ${
          user.history.map(day=>day.record).flat().length
        }次`
      );
    }
  });
  console.log(stats);
});

//定义读取方法
function read_file(path, callback) {
  var fRead = fs.createReadStream(path);
  var objReadline = readline.createInterface({
    input: fRead,
  });
  var arr = new Array();
  objReadline.on('line', function (line) {
    // console.log(line);
    arr.push(JSON.parse(line));
  });
  objReadline.on('close', function () {
    callback(arr);
  });
}
