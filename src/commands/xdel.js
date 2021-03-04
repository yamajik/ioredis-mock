export function xdel(stream, eventId) {
  if (!this.data.has(stream)) {
    throw new Error('ERR The ID specified in XDEL not found');
  }

  let list = this.data.get(stream);
  const index = list.findIndex((data) => data[0] === eventId);
  if (index === -1) {
    throw new Error(
      `ERR The ID specified in XDEL not found in stream: ${stream}`
    );
  }
  list.splice(index, 1);
  this.data.set(stream, list);
  this.data.delete(`stream:${stream}:${eventId}`);
  return eventId;
}
