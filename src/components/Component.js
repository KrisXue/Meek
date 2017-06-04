/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import BrowserEvent from '../meek/BrowserEvent'



export default class Component extends BaseObject {
  constructor () {
    super()

    this.active = true
    this._mapRenderKey = null
  }
  
  /**
   * Handles the browser event and then may call into the subclass functions.
   * @param browserEvent
   */
  handleMouseEvent (browserEvent) {
    let type = browserEvent.type
    if (type === BrowserEvent.MOUSE_MOVE) {
      this._handleMouseMove(browserEvent)
    } else if (type === BrowserEvent.MOUSE_DOWN) {
      let handled = this._handleDownEvent(browserEvent)
      // this.handlingDownUpSequence = handled;
      // stopEvent = this.shouldStopEvent(handled);
    } else if (type === BrowserEvent.MOUSE_UP){
      // this.handlingDownUpSequence = this._handleUpEvent_(browserEvent)
      this._handleUpEvent(browserEvent)
    }
  }

  _isPointerDraggingEvent (browserEvent) {
    var type = browserEvent.type
    return (
      type === BrowserEvent.MOUSE_DOWN ||
      type === BrowserEvent.MOUSE_DRAG ||
      type === BrowserEvent.MOUSE_UP)
  }

  _updateTrackedPointers (browserEvent) {
    if (this._isPointerDraggingEvent(browserEvent)) {
      var event = browserEvent.pointerEvent

      if (browserEvent.type == BrowserEvent.MOUSE_UP) {
        delete this.trackedPointers_[event.pointerId]
      } else if (browserEvent.type == BrowserEvent.MOUSE_DOWN) {
        this.trackedPointers_[event.pointerId] = event
      } else if (event.pointerId in this.trackedPointers_) {
        this.trackedPointers_[event.pointerId] = event
      }
      this.targetPointers = ol.obj.getValues(this.trackedPointers_)
    }
  }

  get map () { return this._map }
  set map (value) { this._map = value }

  get active () { return this._active }
  set active (value) {
    this._active = value
  }
}
