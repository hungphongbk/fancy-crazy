import Spreadsheet from './Spreadsheet';
import path        from 'path';
import fs          from 'fs';
import groupBy     from 'lodash/groupBy';
import omit        from 'lodash/omit';

const s = new Spreadsheet(path.resolve(__dirname, '../dist/reviews.json'));
s.readSheetData()
  .then(arr => {
    const filesObj = groupBy(arr, item => {
      if (item.position === 'index') return 'index';
      return 'collection-' + item.collection_id;
    })

    for (const [file, obj] of Object.entries(filesObj)) {
      fs.writeFileSync(path.resolve(__dirname, `../dist/reviews-${file}.json`),
        JSON.stringify(obj.map(item=>omit(item, ['position', 'collection_id']))),
        'utf-8');
    }
  });
