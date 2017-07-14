/**
 * Created by zhangyong on 2017/5/23.
 */

import BrowserEvent from '../meek/browserevent'


export function singleClick (browserEvent) {
  return browserEvent.type === BrowserEvent.SINGLE_CLICK
}

export function mouseWheel (browserEvent) {
  return browserEvent.type === BrowserEvent.MOUSE_WHEEL ||
         browserEvent.type === BrowserEvent.WHEEL
}

export function noModifierKeys (browserEvent) {
  const originalEvent = browserEvent.originalEvent
  return ( !originalEvent.altKey &&
  !(originalEvent.metaKey || originalEvent.ctrlKey) &&
  !originalEvent.shiftKey)
}

export default {
  singleClick,
  mouseWheel,
  noModifierKeys
}
