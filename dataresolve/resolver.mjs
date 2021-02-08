import { createReadStream } from 'fs';
import { createInterface } from 'readline';
const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
});
//调用方法
var path = 'database_export-o8sFCMxgB2RQ.json';
read_file(path, function (data) {
  let lastScan = 0;
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
  };
  const spread = {};
  const finished = [];
  data.forEach((user) => {
    const set = new Set();
    let time = undefined;
    user.history.forEach((day) => {
      day.record.forEach((draw) => {
        if(draw.time > lastScan){
          lastScan = draw.time
        }
        stats[`${draw.name}福`]++;
        if (draw.name !== 'e') {
          set.add(draw.name);
          time = draw.time;
        }
      });
    });
    const hasBlessings = Array.from(set);
    stats[`${hasBlessings.length}个福`]++;
    if (hasBlessings.length === 4 && user.userinfo.id !== '016649') {
      const idStart = user.userinfo.id.substring(0, 3);
      if (spread[idStart] === undefined) {
        spread[idStart] = 1;
      } else {
        spread[idStart]++;
      }
      finished.push({ ...user.userinfo, time, count: user.history.map((day) => day.record).flat().length });
      finished.sort((a, b) => a.time - b.time);
    }
  });
  stats.完成人员列表 = finished.map(
    (user) =>
      `${user.name}${new Array(Math.max(4 - user.name.length, 0) * 2).fill(' ').join('')}- (${user.id}) - ${
        user.count
      }次 - ${timeFormatter.format(new Date(user.time))}`
  );
  stats.完成人员分布 = Object.fromEntries(
    Object.entries(spread)
      .sort((a, b) => a[0] - b[0])
      .map(([key, value]) => [key + 'xxx', value])
  );
  stats.最后一次扫码 = timeFormatter.format(new Date(lastScan))
  stats['4个福']--
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
