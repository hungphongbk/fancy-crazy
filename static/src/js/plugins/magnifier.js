import './libs/magnifier.css'
import Magnifier from 'exports-loader?Magnifier!./libs/magnifier'
import Event from 'exports-loader?Event!./libs/event'

export default (opts = {}) => {
  const evt = new Event();
  return new Magnifier(evt, opts)
}
