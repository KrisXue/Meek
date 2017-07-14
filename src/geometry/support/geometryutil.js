/**
 * Created by zhangyong on 2017/5/23.
 */


/**
 * Calculate the index of the given point in geometry coordinates
 * @param geometry
 * @param coordinates
 */
export function getCoordinateIndex (geometry, coordinate) {
  
}


/**
 * Calculate the distance between two points, and then determine
 * if two points get intersecting
 *
 * @param pointA
 * @param pointB
 * @param tolerance
 * @returns {boolean}
 */
export function pointIntersectPoint (pointA, pointB, tolerance) {
  const toleranceDistance = tolerance ? tolerance : 2
  
  const distance = squaredDistance(pointA.x, pointA.y, pointB.x, pointB.y)
  if (distance <= toleranceDistance) {
    return true
  }
  
  return false
}

/**
 * Detemin if the point is clo
 * @param pointA
 * @param line
 * @param tolerance
 */
export function pointIntersectLine (pointA, line, tolerance) {
  const path = line.path
  const squaredSegmentDistanceFn = squaredSegmentDistance
  const x = pointA.x
  const y = pointA.y
  
  let find = false
  for (let i = 0, ii = path.length - 1; i < ii; i++) {
    let nowP = path[i]
    let nextP = path[i + 1]
    let distance = squaredSegmentDistanceFn(x, y, nowP.x, nowP.y, nextP.x, nextP.y)
    distance = Math.sqrt(distance)
    if (distance <= tolerance) {
      find = true
      break
    }
  }
  
  return find
}

/**
 * Return the square of the closest distance between the point
 * and the line segment.
 * @param x
 * @param y
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
export function squaredSegmentDistance (x, y, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  if (dx !== 0 || dy !== 0) {
    let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
    if (t > 1) {
      x1 = x2
      y1 = y2
    } else if (t > 0) {
      x1 += dx * t
      y1 += dy * t
    }
  }
  
  return squaredDistance(x, y, x1, y1)
}

/**
 *
 * @param coordinate
 * @param segment
 * @returns {number}
 */
export function squaredDistanceToSegment (coordinate, segment) {
  const closestCoordinate = closestOnSegment(coordinate, segment)
  return squaredDistance(coordinate[0], coordinate[1], closestCoordinate[0], closestCoordinate[1])
}


export function pointIntersectPolygon (pointA, polygon, tolerance) {
  
}


export function equals (coordinate1, coordinate2) {
  let equals = true
  for (let i = coordinate1.length - 1; i >= 0; --i) {
    if (coordinate1[i] != coordinate2[i]) {
      equals = false
      break
    }
  }
  
  return equals
}

/**
 * Return the square of the distance between the points
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number} squared distance
 */
export function squaredDistance (x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}

/**
 * Calculate the distance between two points
 * @param coord1
 * @param coord2
 * @returns {number}
 */
export function distance (coord1, coord2) {
  return Math.sqrt(squaredDistance(coord1[0], coord1[1], coord2[0], coord2[1]))
}

/**
 *
 * @param coordinate
 * @param segment
 * @returns {[*,*]}
 */
export function closestOnSegment (coordinate, segment) {
  const x0 = coordinate[0]
  const y0 = coordinate[1]
  const start = segment[0]
  const end = segment[1]
  const x1 = start[0]
  const y1 = start[1]
  const x2 = end[0]
  const y2 = end[1]
  const dx = x2 - x1
  const dy = y2 - y1
  
  const along = (dx === 0 && dy === 0) ? 0 :
  ((dx * (x0 - x1)) + (dy * (y0 - y1))) / ((dx * dx + dy * dy) || 0)
  
  let x, y
  if (along <= 0) {
    x = x1
    y = y1
  } else if (along >= 1) {
    x = x2
    y = y2
  } else {
    x = x1 + along * dx
    y = y1 + along * dy
  }
  
  return [x, y]
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param ends
 * @param stride
 * @param x
 * @param y
 * @returns {boolean}
 */
export function linearRingsContainsXY (flatCoordinates, offset, ends, stride, x, y) {
  if (ends.length === 0) {
    return false
  }
  
  if (!linearRingContainsXY(flatCoordinates, offset, ends[0], stride, x, y)) {
    return false
  }
  
  let i, ii
  for (i = 1, ii = ends.length; i < ii; ++i) {
    if (linearRingContainsXY(flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
      return false
    }
  }
  
  return true
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param end
 * @param stride
 * @param x
 * @param y
 * @returns {boolean}
 */
export function linearRingContainsXY (flatCoordinates, offset, end, stride, x, y) {
  // http://geomalgorithms.com/a03-_inclusion.html
  // Copyright 2000 softSurfer, 2012 Dan Sunday
  // This code may be freely used and modified for any purpose
  // providing that this copyright notice is included with it.
  // SoftSurfer makes no warranty for this code, and cannot be held
  // liable for any real or imagined damage resulting from its use.
  // Users of this code must verify correctness for their application.
  let wn = 0
  let x1 = flatCoordinates[end - stride]
  let y1 = flatCoordinates[end - stride + 1]
  for (; offset < end; offset += stride) {
    let x2 = flatCoordinates[offset]
    let y2 = flatCoordinates[offset + 1]
    
    if (y1 <= y) {
      if (y2 > y && ((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1)) > 0) {
        wn++
      }
    } else if (y2 <= y && ((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1)) < 0) {
      wn--
    }
    
    x1 = x2
    y1 = y2
  }
  
  return wn !== 0
}


export default {
  linearRingContainsXY,
  linearRingsContainsXY,
  pointIntersectPoint,
  squaredDistance,
  closestOnSegment,
  equals,
  distance
}