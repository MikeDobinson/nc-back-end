const fs = require('fs/promises');

exports.getApi = (req, res) => {
  fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8').then((data) => {
    console.log('data :>> ', data);
    res.status(200).send(data);
  });
};
