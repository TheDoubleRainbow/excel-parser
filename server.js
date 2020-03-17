"use strict";
const express = require("express");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const xlsx = require('xlsx/xlsx');
const cors = require('cors');
const bodyParser = require('body-parser');

const _port = process.env.PORT || 3000;
const _app_folder = 'dist/excel-parser';

const app = express();
app.use(compression());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 * 1024 },
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/file', (req, res) => {
  console.log(req.files.excel.name);
  var binary = req.files.excel.data;
  console.log(binary);

  var arraybuffer = binary;

  /* convert data to binary string */
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  var bstr = arr.join("");

  // const wb = {status: 200};
  const wb = xlsx.read(bstr, { type: 'binary' });
  res.send(JSON.stringify(wb));
})

app.get('*.*', express.static(_app_folder, {maxAge: '1y'}));

app.get('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});

app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on port" + _port);
});
