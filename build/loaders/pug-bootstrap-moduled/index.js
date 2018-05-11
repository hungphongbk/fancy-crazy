// import {getOptions} from 'loader-utils';
const utils = require('loader-utils'),
  parse = require('./parser'),
  path = require('path'),
  fs = require('fs');
//
// const classes = require('./classes');
// let debug = false;

module.exports = function (source, map, meta) {
  const self = this,
    cb = self.async(),
    {scssFiles, cacheFile = path.resolve(__dirname, 'classes.json')} = utils.getOptions(self);
  // self.cacheable();
  fs.readFile(cacheFile, 'utf8', (err, obj) => {
    if (err) return cb(err);
    const newSource = parse(source, cls => obj.indexOf(cls) !== -1);

    //console.log(newSource + "\n-------");
    cb(null, newSource, map, meta);
  });
  // self.callback(null,source);
  // return source;
};
