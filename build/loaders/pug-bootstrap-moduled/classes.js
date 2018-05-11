// @flow
const {Heap} = require('./utils'),
  fs = require('fs'),
  sass = require('node-sass'),
  nodeSassImporter = require('node-sass-package-importer'),
  _ = require('lodash');

module.exports = ({scssFiles, cache = __dirname + '/classes.json'}) => new Promise(resolve => {
  function extractClassNames(source): Array<string> {
    console.log('transform source, size = ' + source.length);
    const rs = new Heap(),
      re = /\.([a-zA-Z_][\w-_]*)/g;
    let match;
    while (match = re.exec(source)) {
      const val = match[1];
      if (!rs.some(v => v === val)) {
        rs.push(val);
      }
      if (match.index === re.lastIndex)
        re.lastIndex++;
    }

    // Now return pure Array
    return rs.sorted();
  }



  Promise.all(scssFiles.map(file => new Promise(resolve_2 => {
    sass.render(
      {file, importer: nodeSassImporter()},
      (err, result) => {
        resolve_2(extractClassNames(result.css.toString('utf8')));
      });
  }))).then(_arr => {
    const arr = _.uniq(_.flatten(_arr));
    fs.writeFileSync(cache, JSON.stringify(arr), 'utf8');
    resolve(arr);
  });
});
