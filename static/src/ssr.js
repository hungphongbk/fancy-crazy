import createApp from './universal';
import axios     from 'axios';

export default async context => {
  global.window.__state__ = (await axios.post('http://localhost:5000/fancycrazy-895ba/us-central1/s/ssr')).data;
  return createApp();
}
