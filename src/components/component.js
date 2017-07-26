/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/baseobject'
import BrowserEvent from '../meek/browserevent'
import Obj from '../utils/obj'

/**
 * Abstract base class,represent a base componnet whcih should be inhrited
 *
 * <br/> 定义组件基础类
 *
 * @class Component
 * @extends BaseObject
 * @module component
 * @constructor
 */
export default class Component extends BaseObject {
  constructor (options = {}) {
    super()
  
    /**
     * 当前组件开关，默认为ture，设置为false时，则关闭当前组件的功能
     * @type {boolean}
     */
    this.active = true
  
    /**
     *
     * @type {null}
     * @private
     */
    this._mapRenderKey = null
  
    /**
     *
     * @type {null}
     */
    this.targetPointers = null
  
    /**
     *
     * @type {{}}
     * @private
     */
    this._trackedPointers = {}
  
    /**
     *
     * @type {boolean}
     */
    this.handlingDownUpSequence = false
    
  }
  
  /**
   *
   * @param options
   */
  applyHandleEventOption (options) {
    /**
     *
     */
    this.handleMouseEvent = options.handleMouseEvent ?
      options.handleMouseEvent : this.handleMouseEvent
  
    /**
     * @private
     */
    this._handleDownEvent = options.handleDownEvent ?
      options.handleDownEvent : function () { return false }
  
    /**
     * @private
     */
    this._handleDragEvent = options.handleDragEvent ?
      options.handleDragEvent : function () {}
  
    /**
     * @private
     */
    this._handleMoveEvent = options.handleMoveEvent ?
      options.handleMoveEvent : function () {}
  
    /**
     * @private
     */
    this._handleUpEvent = options.handleUpEvent ?
      options.handleUpEvent : function () { return false }
    
  }
  
  
  /**
   * 处理鼠标的各种事件
   * @param browserEvent
   */
  handleMouseEvent (browserEvent) {
    let stopEvent = false
    this._updateTrackedPointers(browserEvent)

    if (this.handlingDownUpSequence) {

      if (browserEvent.type === BrowserEvent.MOUSE_DRAG) {
        this._handleDragEvent(browserEvent)

      } else if (browserEvent.type === BrowserEvent.MOUSE_UP) {

        const handledUp = this._handleUpEvent(browserEvent)
        this.handlingDownUpSequence = handledUp && this.targetPointers.length > 0
      }
    } else {
      if (browserEvent.type === BrowserEvent.MOUSE_DOWN) {

        const handled = this._handleDownEvent(browserEvent)
        this.handlingDownUpSequence = handled
        stopEvent = this.shouldStopEvent(handled)

      } else if (browserEvent.type === BrowserEvent.MOUSE_MOVE) {
        this._handleMoveEvent(browserEvent)
      }
    }
    
    return !stopEvent
  }
  
  /**
   * 根据浏览器鼠标操作事件的类型返回true或false
   * @param browserEvent
   * @returns {boolean}
   * @private
   */
  _isPointerDraggingEvent (browserEvent) {
    const type = browserEvent.type
    return (
      type === BrowserEvent.MOUSE_DOWN ||
      type === BrowserEvent.MOUSE_DRAG ||
      type === BrowserEvent.MOUSE_UP)
  }
  
  /**
   * 处理浏览器鼠标操作事件
   * @param browserEvent
   * @private
   */
  _updateTrackedPointers (browserEvent) {
    if (this._isPointerDraggingEvent(browserEvent)) {
      const event = browserEvent

      if (browserEvent.type == BrowserEvent.MOUSE_UP) {
        delete this._trackedPointers[event.pointerId]
      } else if (browserEvent.type == BrowserEvent.MOUSE_DOWN) {
        this._trackedPointers[event.pointerId] = event
      } else if (event.pointerId in this._trackedPointers) {
        this._trackedPointers[event.pointerId] = event
      }
      this.targetPointers = Obj.getValues(this._trackedPointers)
    }
  }
  
  /**
   * 根据Delta值进行视图缩放，Delta等于1时固定放大，等于-1时固定缩小
   * @param view(当前视图)
   * @param delta
   * @param opt_anchor
   * @param opt_duration
   */
  zoomByDelta (view, delta, opt_anchor, opt_duration) {
    const currentResolution = view.resolution
    const resolution = view.constrainResolution(currentResolution, delta, 0)
    
    if (opt_anchor && resolution !== undefined && resolution !== currentResolution) {
      const currentCenter = view.center
      let center = view.calculateCenterZoom(resolution, opt_anchor)
      center = view.constrainCenter(center)
      
      opt_anchor = [
        (resolution * currentCenter[0] - currentResolution * center[0]) /
        (resolution - currentResolution),
        (resolution * currentCenter[1] - currentResolution * center[1]) /
        (resolution - currentResolution)
      ]
    }
    
    this.zoomWithoutConstraints(view, resolution, opt_anchor, opt_duration)
  }
  
  /**
   * 没有限制条件的缩放
   * @param view
   * @param resolution
   * @param opt_anchor
   * @param opt_duration
   */
  zoomWithoutConstraints (view, resolution, opt_anchor, opt_duration) {
    if (resolution) {
      const currentResolution = view.resolution
      const currentCenter = view.center
      
      if (currentResolution !== undefined && currentCenter &&
          resolution !== currentResolution && opt_duration) {
        // view.animate({
        //   resolution: resolution,
        //   anchor: opt_anchor,
        //   duration: opt_duration,
        //   // easing: 1 - ol.easing.easeIn(1 - t)
        // })
  
        view.resolution = resolution
      } else {
        if (opt_anchor) {
          const center = view.calculateCenterZoom(resolution, opt_anchor)
          view.center = center
        }
        view.resolution = resolution
      }
    }
  }
  
  /**
   * 获取当前标注视图的坐标范围(标注的图片的像素)
   * @returns {*|null}
   */
  getViewDataExtent () {
    if (!this._dataExtent) {
      this._dataExtent = this.map.view.dataExtent
    }
    
    return this._dataExtent
  }
  
  /**
   * 坐标自检测，如果有小于0的坐标，修正为0，如果有大于最大值的坐标，修正为最大值
   * @param coordinate
   * @returns {Array}
   */
  coordinateBeyond (coordinate) {
    if (coordinate === undefined) {
      return coordinate
    }
    
    let newCoordinate = new Array(2)
    
    let x,y
    
    try{
      x = coordinate[0]
      y = coordinate[1]
    } catch (e) {
      // console.log(coordinate)
    }
  
    newCoordinate[0] = x
    newCoordinate[1] = y
  
    if (x <= 0) {
      newCoordinate[0] = 0
    }
    
    if (y <= 0) {
      newCoordinate[1] = 0
    }
    
    const extent = this.getViewDataExtent()
    
    if (extent) {
      if (x >= extent[2]) {
        newCoordinate[0] = extent[2]
      }
      
      if (y >= extent[3]) {
        newCoordinate[1] = extent[3]
      }
    }
    
    return newCoordinate
  }
  
  /**
   *
   * @param handled
   * @returns {*}
   * @private
   */
  shouldStopEvent (handled) {
    return handled
  }
    
  get map () { return this._map }
  set map (value) { this._map = value }

  get active () { return this._active }
  set active (value) {
    this._active = value
  }
}
