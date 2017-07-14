/**
 * Created by zhangyong on 2017/6/15.
 */


import Kinetic from './kinetic'
import DragPan from './dragpan'
import MouseWheelZoom from './mousewheelzoom'

/**
 *
 * @param options
 * @returns {Set}
 */
export function componentsDefaults (options = {}) {
  const components = new Set()
  
  const kinetic = new Kinetic(-0.005, 0.05, 100)
  
  const dragPan = options.dragPan !== undefined ? options.dragPan : true
  if (dragPan) {
    components.add(new DragPan({
      kinetic: kinetic
    }))
  }
  
  const mouseWheelZoom = options.mouseWheelZoom !== undefined ?
    options.mouseWheelZoom : true
  if (mouseWheelZoom) {
    components.add(new MouseWheelZoom({
      constrainResolution: options.constrainResolution,
      duration: options.zoomDuration
    }))
  }
  
  return components
}


export default {
  componentsDefaults
}