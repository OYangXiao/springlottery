import { createReadStream } from 'fs';
import { createInterface } from 'readline';
const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
});
//调用方法
var path = 'database_export-gz16TCBnv1RM.json';
read_file(path, function (data) {
  const stats = {
    参与人数: data.length,
    a福: 0,
    b福: 0,
    c福: 0,
    d福: 0,
    e福: 0,
    '0个福': 0,
    '1个福': 0,
    '2个福': 0,
    '3个福': 0,
    '4个福': 0,
    完成人员列表: [],
  };
  data.forEach((user) => {
    const set = new Set();
    let time = undefined;
    user.history.forEach((day) => {
      day.record.forEach((draw) => {
        stats[`${draw.name}福`]++;
        if (draw.name !== 'e') {
          set.add(draw.name);
          time = draw.time;
        }
      });
    });
    const hasBlessings = Array.from(set);
    stats[`${hasBlessings.length}个福`]++;
    if (hasBlessings.length === 4) {
      stats.完成人员列表.push(
        `${user.userinfo.name}(${user.userinfo.id}) - ${
          user.history.map((day) => day.record).flat().length
        }次 - ${timeFormatter.format(new Date(time))}`
      );
    }
  });
  console.log(stats);
});

//定义读取方法
function read_file(path, callback) {
  var fRead = createReadStream(path);
  var objReadline = createInterface({
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
