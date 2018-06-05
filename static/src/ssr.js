import createApp from './universal';
import axios     from 'axios';

export default async context => {
  global.window.__state__ = (await axios.post('https://us-central1-fancycrazy-895ba.cloudfunctions.net/s/ssr')).data;
  return createApp();
}
