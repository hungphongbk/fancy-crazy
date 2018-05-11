import credentials            from './credentials/hungphongbk-02e62197a93f';
import {google as googleapis} from 'googleapis';
import fs                     from 'fs';
import {promisify}            from 'bluebird';

const sheets = googleapis.sheets('v4');

export default class Spreadsheet {
  constructor(targetFile) {
    this.targetFile = targetFile;
    const polyfill = apiFn => {
      return (...args) => apiFn.apply(null, args)
        .then(result => {
          console.log(result);
          if (typeof result.values === 'undefined')
            result.values = result.data.values;
          return result;
        });
    };

    this.spreadsheetId = '1_j1hz8PerZEGG7pe-wRXwtOfJH8suBLZ6DcSC606_vM';
    this.rowOffset = 1;
    this.columnLastIndex = 'K';
    this.spreadsheets = {
      values: {
        get: sheets.spreadsheets.values.get,
        batchGet: sheets.spreadsheets.values.batchGet,
        update: sheets.spreadsheets.values.update,
        batchUpdate: sheets.spreadsheets.values.batchUpdate,
        append: sheets.spreadsheets.values.append
      }
    };
    // const spreadSheetFns = this.spreadsheets.values;
    // for (const fn of Object.keys(spreadSheetFns)) {
    //   if (spreadSheetFns.hasOwnProperty(fn)) {
    //     spreadSheetFns[fn] = promisify(spreadSheetFns[fn]);
    //   }
    // }
  }

  static async _makeAuth() {
    const jwt = new googleapis.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      [
        'https://www.googleapis.com/auth/spreadsheets'
      ],
      null
    );
    try {
      await jwt.authorize();
      return jwt;
    } catch (e) {
      throw e;
    }
  }

  async _params(params, sheet = 'Reviews') {
    // deep-determine 'range' or 'ranges'
    const deep = obj => {
      for (const key in Object.keys(obj)) {
        if (key === 'range' && typeof obj.range !== 'undefined')
          obj.range = sheet + '!' + obj.range;
        else if (key === 'ranges' && typeof obj.ranges !== 'undefined') {
          obj.ranges = obj.ranges.map(r => sheet + '!' + r);
        } else if (typeof obj[key] === 'object')
          deep(obj[key]);
      }
    };
    deep(params);

    return {
      auth: await Spreadsheet._makeAuth(),
      spreadsheetId: this.spreadsheetId,
      ...params
    };
  }

  readSheetData() {
    return new Promise(async resolve => {
      const start = this.rowOffset,
        nullDefault = (row, index) => {
          const value = row[index];
          if (typeof value !== 'undefined' && value !== null && value.length > 0)
            return value;
          return null;
        };

      const params = await this._params({
        range: `A${start}:K`,
        majorDimension: 'ROWS'
      });

      sheets.spreadsheets.values.get(params)
        .then(result => {
          const keys = [null, 'position', 'group', 'type', 'image_url', 'rating', 'review_customer_name', 'review_date', 'review_title', 'review_content', 'collection_id'];
          const rs = result.data.values.map(row => {
            const obj = {};
            for (let i = 1; i <= 10; i++) {
              const value = nullDefault(row, i);
              if (value !== null)
                obj[keys[i]] = value;
            }
            return obj;
          });

          resolve(rs);
        });
    });
  }

  async write() {
    fs.writeFile(this.targetFile, JSON.stringify(await this.readSheetData()), 'utf-8');
  }
}
