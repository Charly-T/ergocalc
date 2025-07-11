import { useState, useCallback } from 'react'
import { TabletCanvas } from './components/TabletCanvas.jsx'
import { HandIcon, RotateCcwIcon, PaintbrushIcon } from './components/icons.jsx'

export function App() {
  const [selectedFinger, setSelectedFinger] = useState(0)
  const [isPaintMode, setIsPaintMode] = useState(false)
  const [fingerDots, setFingerDots] = useState(new Map())
  const [paintedZones, setPaintedZones] = useState([])
  const [currentZone, setCurrentZone] = useState([])

  const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"]

  const clearCanvas = useCallback(() => {
    setFingerDots(new Map())
    setPaintedZones([])
    setCurrentZone([])
  }, [])

  const clearZones = useCallback(() => {
    setPaintedZones([])
    setCurrentZone([])
  }, [])

  const getDotsInfo = () => {
    const entries = Array.from(fingerDots.entries())
    if (entries.length === 0) return "None"
    
    return entries
      .map(([finger, dots]) => `${fingerNames[finger]}: ${dots.length}`)
      .join(", ")
  }

  return (
    <div className="app">
      {/* Top Menu */}
      <div className="card top-menu">
        <div className="menu-content">
          <div className="menu-section">
            <HandIcon />
            <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>Finger Selection:</span>
          </div>

          <div className="menu-section finger-selection">
            {fingerNames.map((name, index) => (
              <button
                key={index}
                className={`btn large ${selectedFinger === index ? 'primary' : ''}`}
                onClick={() => setSelectedFinger(index)}
                disabled={isPaintMode}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="menu-section controls">
            <button
              className={`btn large ${isPaintMode ? 'primary' : ''}`}
              onClick={() => setIsPaintMode(!isPaintMode)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PaintbrushIcon className="icon" style={{ width: '1rem', height: '1rem' }} />
              {isPaintMode ? "Exit Paint" : "Paint Zone"}
            </button>

            <button 
              className="btn large" 
              onClick={clearZones}
              style={{ backgroundColor: 'transparent' }}
            >
              Clear Zones
            </button>

            <button
              className="btn large"
              onClick={clearCanvas}
              style={{ 
                backgroundColor: 'transparent', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}
            >
              <RotateCcwIcon className="icon" style={{ width: '1rem', height: '1rem' }} />
              Clear All
            </button>
          </div>
        </div>

        <div className="status-bar">
          <p className="status-text">
            <strong>Mode:</strong> {isPaintMode ? "Paint Zone" : "Touch Mode"} •{" "}
            <strong>Selected:</strong> {fingerNames[selectedFinger]} finger •{" "}
            <strong>Dots:</strong> {getDotsInfo()} •{" "}
            <strong>Zones:</strong> {paintedZones.length}
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <TabletCanvas
          selectedFinger={selectedFinger}
          isPaintMode={isPaintMode}
          onDotsChange={setFingerDots}
          onZonesChange={setPaintedZones}
          fingerDots={fingerDots}
          paintedZones={paintedZones}
          currentZone={currentZone}
          onCurrentZoneChange={setCurrentZone}
        />
      </div>
    </div>
  )
}
