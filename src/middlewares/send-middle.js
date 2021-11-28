module.exports = (req, res) => {
  res.send = (status, data) => {
    res.writeHeader(status, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(data));
  }
}