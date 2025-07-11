import { useRef, useEffect, useState, useCallback } from 'react'

// Utility functions
function getCentroid(points) {
  const n = points.length
  if (n === 0) return null

  const sum = points.reduce(
    (acc, p) => ({
      x: acc.x + p.x,
      y: acc.y + p.y,
    }),
    { x: 0, y: 0 }
  )

  return {
    x: sum.x / n,
    y: sum.y / n,
  }
}

function getMainDirectionLine(points) {
  const n = points.length
  if (n < 2) return null

  // 1. Centroide
  const centroid = getCentroid(points)

  // 2. Calcular covarianzas
  let sxx = 0,
    syy = 0,
    sxy = 0
  for (const { x, y } of points) {
    const dx = x - centroid.x
    const dy = y - centroid.y
    sxx += dx * dx
    syy += dy * dy
    sxy += dx * dy
  }

  // 3. Calcular dirección del vector principal (eigenvector del mayor autovalor)
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy)
  const dir = { x: Math.cos(theta), y: Math.sin(theta) }

  // 4. Generar puntos de la línea (prolongada desde el centroide)
  const length = 1000 // suficientemente larga para pintar
  const p1 = {
    x: centroid.x - dir.x * length,
    y: centroid.y - dir.y * length,
  }
  const p2 = {
    x: centroid.x + dir.x * length,
    y: centroid.y + dir.y * length,
  }

  return { p1, p2, centroid, angleRad: theta }
}

// Point-in-polygon test using ray casting algorithm
function isPointInPolygon(point, polygon) {
  if (polygon.length < 3) return false

  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (
      polygon[i].y > point.y !== polygon[j].y > point.y &&
      point.x <
        ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x
    ) {
      inside = !inside
    }
  }
  return inside
}

export function TabletCanvas({ 
  selectedFinger, 
  isPaintMode, 
  onDotsChange, 
  onZonesChange,
  fingerDots,
  paintedZones,
  currentZone,
  onCurrentZoneChange 
}) {
  const canvasRef = useRef(null)
  const [isDrawingZone, setIsDrawingZone] = useState(false)
  
  const DOT_SIZE = 12
  const SQUARE_SIZE = 80
  const SQUARE_GAP = 10

  // Finger colors
  const FINGER_COLORS = [
    "#4a4a4a", // Thumb - Dark gray/charcoal
    "#14b8a6", // Index - Teal/cyan
    "#0891b2", // Index_far - Darker teal/blue-green (using as middle)
    "#a855f7", // Middle - Purple/violet (using as ring)
    "#ec4899", // Ring - Pink/magenta (using as pinky)
  ]

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to fill the available space
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Set canvas style size
    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    setupCanvas()
    window.addEventListener("resize", setupCanvas)
    return () => window.removeEventListener("resize", setupCanvas)
  }, [setupCanvas])

  const isPointInAnyZone = useCallback(
    (point) => {
      return paintedZones.some((zone) => isPointInPolygon(point, zone.points))
    },
    [paintedZones]
  )

  const drawPaintedZones = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw all painted zones
    paintedZones.forEach((zone) => {
      if (zone.points.length > 2) {
        ctx.fillStyle = "rgba(128, 128, 128, 0.5)" // Semi-transparent grey
        ctx.strokeStyle = "#666666"
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(zone.points[0].x, zone.points[0].y)
        for (let i = 1; i < zone.points.length; i++) {
          ctx.lineTo(zone.points[i].x, zone.points[i].y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
    })

    // Draw current zone being painted
    if (currentZone.length > 1) {
      ctx.fillStyle = "rgba(128, 128, 128, 0.3)" // Lighter grey for current zone
      ctx.strokeStyle = "#999999"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      ctx.beginPath()
      ctx.moveTo(currentZone[0].x, currentZone[0].y)
      for (let i = 1; i < currentZone.length; i++) {
        ctx.lineTo(currentZone[i].x, currentZone[i].y)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [paintedZones, currentZone])

  const drawDot = useCallback((x, y, fingerIndex, size = DOT_SIZE) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = FINGER_COLORS[fingerIndex]
    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI)
    ctx.fill()
  }, [FINGER_COLORS, DOT_SIZE])

  const drawMainDirectionLine = useCallback((points, color) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const line = getMainDirectionLine(points)
    if (!line) return

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5]) // Dashed line
    ctx.beginPath()
    ctx.moveTo(line.p1.x, line.p1.y)
    ctx.lineTo(line.p2.x, line.p2.y)
    ctx.stroke()
    ctx.setLineDash([]) // Reset to solid line
  }, [])

  const drawCentroidSquares = useCallback((points, color) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centroid = getCentroid(points)
    if (!centroid) return

    // Get the direction line to determine angle and direction
    const line = getMainDirectionLine(points)
    if (!line) {
      // If no direction line (only 1 point), draw squares vertically
      const totalHeight = 3 * SQUARE_SIZE + 2 * SQUARE_GAP
      const startY = centroid.y - totalHeight / 2

      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.lineWidth = 2

      for (let i = 0; i < 3; i++) {
        const squareX = centroid.x - SQUARE_SIZE / 2
        const squareY = startY + i * (SQUARE_SIZE + SQUARE_GAP)
        ctx.strokeRect(squareX, squareY, SQUARE_SIZE, SQUARE_SIZE)
      }
      return
    }

    const angle = line.angleRad
    const spacing = SQUARE_SIZE + SQUARE_GAP

    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    // Draw 3 squares positioned along the direction line
    for (let i = 0; i < 3; i++) {
      // Calculate position along the direction line
      // Center square (i=1) at centroid, others offset by spacing
      const offset = (i - 1) * spacing
      const squareCenterX = centroid.x + Math.cos(angle) * offset
      const squareCenterY = centroid.y + Math.sin(angle) * offset

      // Save current transformation
      ctx.save()

      // Translate to square center and rotate
      ctx.translate(squareCenterX, squareCenterY)
      ctx.rotate(angle)

      // Draw square centered at origin (after transformation)
      const halfSize = SQUARE_SIZE / 2
      ctx.strokeRect(-halfSize, -halfSize, SQUARE_SIZE, SQUARE_SIZE)

      // Restore transformation
      ctx.restore()
    }
  }, [SQUARE_SIZE, SQUARE_GAP])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw painted zones first (so they appear behind other elements)
    drawPaintedZones()

    // Redraw all dots, regression lines, and centroid squares for each finger
    fingerDots.forEach((dots, fingerIndex) => {
      // Draw dots
      dots.forEach((dot) => {
        drawDot(dot.x, dot.y, fingerIndex)
      })

      // Draw regression line if we have at least 2 points
      if (dots.length >= 2) {
        drawMainDirectionLine(dots, FINGER_COLORS[fingerIndex])
      }

      // Draw centroid squares if we have at least 1 point
      if (dots.length >= 1) {
        drawCentroidSquares(dots, FINGER_COLORS[fingerIndex])
      }
    })
  }, [fingerDots, drawDot, drawMainDirectionLine, drawCentroidSquares, drawPaintedZones, FINGER_COLORS])

  const handleMouseDown = useCallback(
    (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (isPaintMode) {
        // Start painting a zone
        setIsDrawingZone(true)
        onCurrentZoneChange([{ x, y }])
      } else {
        // Check if point is in a painted zone
        if (isPointInAnyZone({ x, y })) {
          return // Ignore touch in painted zone
        }

        // Add dot to selected finger's array
        const newMap = new Map(fingerDots)
        const currentDots = newMap.get(selectedFinger) || []
        newMap.set(selectedFinger, [...currentDots, { x, y }])
        onDotsChange(newMap)
      }
    },
    [isPaintMode, selectedFinger, isPointInAnyZone, fingerDots, onDotsChange, onCurrentZoneChange]
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (!isPaintMode || !isDrawingZone) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      onCurrentZoneChange([...currentZone, { x, y }])
    },
    [isPaintMode, isDrawingZone, currentZone, onCurrentZoneChange]
  )

  const handleMouseUp = useCallback(() => {
    if (isPaintMode && isDrawingZone && currentZone.length > 2) {
      // Finish painting zone
      onZonesChange([...paintedZones, { points: currentZone }])
      onCurrentZoneChange([])
    }
    setIsDrawingZone(false)
  }, [isPaintMode, isDrawingZone, currentZone, paintedZones, onZonesChange, onCurrentZoneChange])

  const getTouchPos = useCallback((touch) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
  }, [])

  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault()
      const touches = Array.from(e.touches)

      touches.forEach((touch, index) => {
        if (index === selectedFinger) {
          const pos = getTouchPos(touch)

          if (isPaintMode) {
            // Start painting a zone
            setIsDrawingZone(true)
            onCurrentZoneChange([pos])
          } else {
            // Check if point is in a painted zone
            if (isPointInAnyZone(pos)) {
              return // Ignore touch in painted zone
            }

            // Add dot to selected finger's array
            const newMap = new Map(fingerDots)
            const currentDots = newMap.get(selectedFinger) || []
            newMap.set(selectedFinger, [...currentDots, pos])
            onDotsChange(newMap)
          }
        }
      })
    },
    [selectedFinger, getTouchPos, isPaintMode, isPointInAnyZone, fingerDots, onDotsChange, onCurrentZoneChange]
  )

  const handleTouchMove = useCallback(
    (e) => {
      if (!isPaintMode || !isDrawingZone) return

      e.preventDefault()
      const touches = Array.from(e.touches)

      touches.forEach((touch, index) => {
        if (index === selectedFinger) {
          const pos = getTouchPos(touch)
          onCurrentZoneChange([...currentZone, pos])
        }
      })
    },
    [isPaintMode, isDrawingZone, selectedFinger, getTouchPos, currentZone, onCurrentZoneChange]
  )

  const handleTouchEnd = useCallback(() => {
    if (isPaintMode && isDrawingZone && currentZone.length > 2) {
      // Finish painting zone
      onZonesChange([...paintedZones, { points: currentZone }])
      onCurrentZoneChange([])
    }
    setIsDrawingZone(false)
  }, [isPaintMode, isDrawingZone, currentZone, paintedZones, onZonesChange, onCurrentZoneChange])

  useEffect(() => {
    redrawCanvas()
  }, [fingerDots, paintedZones, currentZone, redrawCanvas])

  return (
    <canvas
      ref={canvasRef}
      className={`main-canvas ${isPaintMode ? 'canvas-crosshair' : 'canvas-pointer'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    />
  )
}
