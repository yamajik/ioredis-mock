import * as us from "microseconds";

export function xadd(stream, id, ...args) {
  let maxlen = 0,
    id;
  if (args[0].toUpperCase() === 'MAXLEN') {
    if (['~', '='].includes(args[1])) {
      maxlen = args[2];
      id = args[3];
      args = args.slice(4);
    } else {
      maxlen = args[1];
      id = args[2];
      args = args.slice(3);
    }
  }

  if (!stream || !id || args.length === 0 || args.length % 2 !== 0) {
    throw new Error("ERR wrong number of arguments for 'xadd' command");
  }

  if (!this.data.has(stream)) {
    this.data.set(stream, []);
  }

  let list = this.data.get(stream);
  const eventId = `${id === '*' ? us.now() * 1000 : id}-0`;

  if (list.length > 0 && list[0][0] === `${eventId}`) {
    throw new Error(
      'ERR The ID specified in XADD is equal or smaller than the target stream top item'
    );
  }

  this.data.set(`stream:${stream}:${eventId}`, {
    polled: false,
  });
  list = [...list, [`${eventId}`, [...args]]];
  if (maxlen > 0 && list.length > maxlen) {
    this.data.set(stream, list.slice(list.length - maxlen));
    this.data.delete(`stream:${stream}:${list[0][0]}`);
  } else {
    this.data.set(stream, list);
  }
  return `${eventId}`;
}
