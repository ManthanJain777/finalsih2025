import { useState, useRef, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Camera, 
  RotateCcw, 
  Check, 
  X, 
  Video,
  VideoOff,
  Scan,
  Eye,
  HelpCircle,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

// Utility function to check camera support
const checkCameraSupport = () => {
  const hasMediaDevices = !!navigator.mediaDevices?.getUserMedia
  const isSecureContext = window.isSecureContext || 
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost')
  
  return {
    hasMediaDevices,
    isSecureContext,
    isSupported: hasMediaDevices && isSecureContext
  }
}

interface CameraCaptureProps {
  type: 'fingerprint' | 'face' | 'signature'
  onCapture: (imageData: string) => void
  onClose: () => void
  isActive: boolean
}

export function CameraCapture({ type, onCapture, onClose, isActive }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getCameraTitle = () => {
    switch (type) {
      case 'fingerprint':
        return 'Fingerprint Scanner'
      case 'face':
        return 'Face Recognition'
      case 'signature':
        return 'Signature Capture'
      default:
        return 'Biometric Capture'
    }
  }

  const getCameraInstructions = () => {
    switch (type) {
      case 'fingerprint':
        return 'Place your finger on the scanner area and hold steady'
      case 'face':
        return 'Position your face in the center frame and look directly at the camera'
      case 'signature':
        return 'Sign your name clearly in the designated area'
      default:
        return 'Follow the on-screen instructions'
    }
  }

  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasPermission(false)
        toast.error('Camera not supported in this browser. Please use Chrome, Firefox, or Safari.')
        return
      }

      // Check if we're in a secure context first
      const isSecureContext = window.isSecureContext || 
        window.location.protocol === 'https:' || 
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('localhost')
      
      if (!isSecureContext) {
        setHasPermission(false)
        toast.error('Camera requires HTTPS or localhost. Using simulation mode instead.')
        return
      }

      // Request camera permission with more flexible constraints
      const constraints = {
        video: {
          width: { ideal: 640, min: 320, max: 1280 },
          height: { ideal: 480, min: 240, max: 720 },
          facingMode: type === 'face' ? 'user' : 'environment'
        }
      }

      console.log('Requesting camera access with constraints:', constraints)
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      console.log('Camera stream obtained:', mediaStream)
      setStream(mediaStream)
      setHasPermission(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Ensure video starts playing
        try {
          await videoRef.current.play()
          console.log('Video playback started')
        } catch (playError) {
          console.warn('Video autoplay blocked:', playError)
          // Try to play manually
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(console.error)
            }
          }, 100)
        }
      }
      
      toast.success('Camera initialized successfully - Live scan ready!')
    } catch (error: any) {
      console.error('Camera access error:', error)
      setHasPermission(false)
      
      let errorMessage = 'Camera access denied.'
      let toastType: 'error' | 'warning' = 'error'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.'
        toastType = 'warning'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera device.'
      } else if (error.name === 'NotSupportedError' || error.message === 'Camera not supported') {
        errorMessage = 'Camera not supported in this browser. Try using Chrome, Firefox, or Safari with HTTPS.'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.'
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints cannot be satisfied. Trying with different settings...'
        
        // Retry with more basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true })
          setStream(basicStream)
          setHasPermission(true)
          
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream
            await videoRef.current.play()
          }
          
          toast.success('Camera initialized with basic settings')
          return
        } catch (retryError) {
          console.error('Retry failed:', retryError)
          errorMessage = 'Camera could not be initialized with any settings.'
        }
      }
      
      if (toastType === 'error') {
        toast.error(errorMessage)
      } else {
        toast(errorMessage, { 
          description: 'You can use simulation mode instead for demonstration purposes.'
        })
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const simulateCapture = () => {
    // Create a simulation canvas for demonstration
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = 640
    canvas.height = 480

    // Create a mock biometric capture based on type with clear simulation branding
    context.fillStyle = '#f8f9fa'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add simulation watermark background
    context.fillStyle = 'rgba(59, 130, 246, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    context.fillStyle = '#333'
    context.font = '20px Arial'
    context.textAlign = 'center'
    
    // Add "SIMULATION MODE" header
    context.fillStyle = '#3b82f6'
    context.font = 'bold 16px Arial'
    context.fillText('🔬 SIMULATION MODE - DEMO DATA', 320, 30)
    
    context.fillStyle = '#333'
    context.font = '20px Arial'
    
    if (type === 'fingerprint') {
      // Draw mock fingerprint
      context.beginPath()
      context.arc(320, 240, 80, 0, 2 * Math.PI)
      context.strokeStyle = '#007bff'
      context.lineWidth = 3
      context.stroke()
      
      // Add fingerprint lines
      for (let i = 0; i < 10; i++) {
        context.beginPath()
        context.arc(320, 240, 30 + (i * 5), 0, 2 * Math.PI)
        context.strokeStyle = '#007bff'
        context.lineWidth = 1
        context.stroke()
      }
      
      context.fillStyle = '#007bff'
      context.font = 'bold 18px Arial'
      context.fillText('MOCK FINGERPRINT PATTERN', 320, 350)
      context.font = '14px Arial'
      context.fillText('Quality Score: 95% | Match Confidence: 98%', 320, 375)
    } else if (type === 'face') {
      // Draw mock face
      context.strokeStyle = '#00ff00'
      context.lineWidth = 3
      context.strokeRect(220, 140, 200, 240)
      
      // Eyes
      context.fillStyle = '#333'
      context.fillRect(250, 200, 30, 15)
      context.fillRect(360, 200, 30, 15)
      
      // Nose
      context.strokeRect(310, 230, 20, 30)
      
      // Mouth
      context.fillRect(290, 290, 60, 10)
      
      context.fillStyle = '#00aa00'
      context.font = 'bold 18px Arial'
      context.fillText('MOCK FACIAL RECOGNITION', 320, 400)
      context.font = '14px Arial'
      context.fillText('Identity Match: 97% | Liveness: Verified', 320, 425)
    } else if (type === 'signature') {
      // Draw mock signature
      context.strokeStyle = '#ff6b35'
      context.lineWidth = 3
      context.beginPath()
      context.moveTo(150, 250)
      context.quadraticCurveTo(250, 200, 350, 250)
      context.quadraticCurveTo(450, 300, 550, 250)
      context.stroke()
      
      // Add more signature details
      context.beginPath()
      context.moveTo(200, 280)
      context.lineTo(400, 270)
      context.stroke()
      
      context.fillStyle = '#cc5500'
      context.font = 'bold 18px Arial'
      context.fillText('MOCK SIGNATURE VERIFICATION', 320, 350)
      context.font = '14px Arial'
      context.fillText('Authenticity Score: 92% | Pattern Match: Valid', 320, 375)
    }

    // Add timestamp
    context.fillStyle = '#666'
    context.font = '12px Arial'
    const timestamp = new Date().toLocaleString()
    context.fillText(`Generated: ${timestamp}`, 320, 460)

    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    setIsCapturing(true)
    
    toast.success(`🔬 Simulation: ${type} capture completed!`, {
      description: 'This is demo data for demonstration purposes only.'
    })
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      // Fallback to simulation if no camera
      simulateCapture()
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Add overlay graphics based on type
    if (type === 'fingerprint') {
      // Draw fingerprint scanning overlay
      context.strokeStyle = '#00ff00'
      context.lineWidth = 3
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80
      
      context.beginPath()
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      context.stroke()
      
      // Add scanning animation effect
      context.strokeStyle = '#ffffff'
      context.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        context.beginPath()
        context.arc(centerX, centerY, radius - (i * 15), 0, 2 * Math.PI)
        context.stroke()
      }
    } else if (type === 'face') {
      // Draw face detection overlay
      context.strokeStyle = '#00ff00'
      context.lineWidth = 3
      const faceWidth = 200
      const faceHeight = 240
      const x = (canvas.width - faceWidth) / 2
      const y = (canvas.height - faceHeight) / 2
      
      context.strokeRect(x, y, faceWidth, faceHeight)
      
      // Add corner markers
      const cornerSize = 20
      context.lineWidth = 5
      // Top left
      context.beginPath()
      context.moveTo(x, y + cornerSize)
      context.lineTo(x, y)
      context.lineTo(x + cornerSize, y)
      context.stroke()
      
      // Top right
      context.beginPath()
      context.moveTo(x + faceWidth - cornerSize, y)
      context.lineTo(x + faceWidth, y)
      context.lineTo(x + faceWidth, y + cornerSize)
      context.stroke()
      
      // Bottom left
      context.beginPath()
      context.moveTo(x, y + faceHeight - cornerSize)
      context.lineTo(x, y + faceHeight)
      context.lineTo(x + cornerSize, y + faceHeight)
      context.stroke()
      
      // Bottom right
      context.beginPath()
      context.moveTo(x + faceWidth - cornerSize, y + faceHeight)
      context.lineTo(x + faceWidth, y + faceHeight)
      context.lineTo(x + faceWidth, y + faceHeight - cornerSize)
      context.stroke()
    }

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    setIsCapturing(true)
    
    // Stop camera after capture
    stopCamera()
    
    toast.success(`${type} captured successfully!`)
  }

  const processCapture = async () => {
    if (!capturedImage) return
    
    setIsProcessing(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    onCapture(capturedImage)
    toast.success(`${type} verification completed!`)
  }

  const retakeCapture = () => {
    setCapturedImage(null)
    setIsCapturing(false)
    startCamera()
  }

  useEffect(() => {
    if (isActive && hasPermission === null) {
      // Check if we're in a secure context (HTTPS or localhost)
      const isSecureContext = window.isSecureContext || 
        window.location.protocol === 'https:' || 
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('localhost')
      
      if (!isSecureContext) {
        console.warn('Not in secure context, camera may not work')
        setHasPermission(false)
        toast('Camera requires HTTPS connection', {
          description: 'Using simulation mode for demonstration. Deploy to HTTPS for live camera features.',
          action: {
            label: 'Try Simulation',
            onClick: () => simulateCapture()
          }
        })
      } else {
        console.log('Starting camera in secure context')
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          startCamera()
        }, 100)
      }
    }
    
    return () => {
      stopCamera()
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {type === 'fingerprint' && <Scan className="h-5 w-5 text-primary" />}
            {type === 'face' && <Eye className="h-5 w-5 text-primary" />}
            {type === 'signature' && <Camera className="h-5 w-5 text-primary" />}
            <h2>{getCameraTitle()}</h2>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                toast('Camera Help', {
                  description: 'Having issues? Try simulation mode or check your browser camera permissions in settings.',
                  action: {
                    label: 'Use Simulation',
                    onClick: () => simulateCapture()
                  }
                })
              }}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {getCameraInstructions()}
        </p>

        {hasPermission === false && (
          <div className="text-center py-8">
            <VideoOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Camera Access Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Live scanning requires camera access. Please follow the steps below to enable your camera, or use simulation mode for demonstration.
            </p>
            <div className="space-y-3">
              <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700">
                <Video className="h-4 w-4 mr-2" />
                Try Camera Access Again
              </Button>
              <div className="text-xs text-muted-foreground">or</div>
              <Button variant="outline" onClick={simulateCapture} className="bg-blue-50 hover:bg-blue-100 border-blue-200">
                <Scan className="h-4 w-4 mr-2" />
                Use Simulation Mode
              </Button>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📹 How to Enable Camera Access:</h4>
                <div className="text-xs text-blue-800 text-left space-y-1">
                  <p><strong>Step 1:</strong> Click "Try Camera Access Again" above</p>
                  <p><strong>Step 2:</strong> When prompted, click "Allow" to grant camera permission</p>
                  <p><strong>Step 3:</strong> If blocked, look for a camera icon 📷 in your browser's address bar and click it</p>
                  <p><strong>Step 4:</strong> Select "Always allow" for this site</p>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-2">🔧 Troubleshooting:</h4>
                <div className="text-xs text-amber-800 text-left space-y-1">
                  <p>• <strong>Chrome:</strong> Click the camera icon in address bar → Allow</p>
                  <p>• <strong>Firefox:</strong> Click the camera icon next to URL → Allow</p>
                  <p>• <strong>Safari:</strong> Safari → Preferences → Websites → Camera → Allow</p>
                  <p>• <strong>Still not working?</strong> Try refreshing the page or restarting your browser</p>
                  <p>• <strong>Mobile:</strong> Allow camera access in your browser settings</p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">✨ Simulation Mode</h4>
                <p className="text-xs text-green-800">
                  If you prefer not to use your camera or are experiencing issues, simulation mode provides 
                  a complete demonstration of the {type} verification process with mock data.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasPermission === true && !isCapturing && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-80 object-cover"
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded')
                  if (videoRef.current) {
                    console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
                  }
                }}
                onCanPlay={() => {
                  console.log('Video can play')
                  toast.success('Live camera feed active!')
                }}
                onError={(e) => {
                  console.error('Video error:', e)
                  toast.error('Video display error')
                }}
              />
              
              {/* Live scan indicators */}
              {stream && (
                <>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      LIVE SCAN ACTIVE
                    </Badge>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      {type.toUpperCase()}
                    </Badge>
                  </div>
                </>
              )}
              
              {/* Overlay based on type */}
              {type === 'fingerprint' && stream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-green-400 rounded-full border-dashed animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <Scan className="h-8 w-8 text-green-400" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <p className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Place finger in the center circle
                    </p>
                  </div>
                </div>
              )}
              
              {type === 'face' && stream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-56 border-2 border-green-400 rounded-lg relative">
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-400"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-400"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-400"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-400"></div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <p className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Position your face in the frame
                    </p>
                  </div>
                </div>
              )}
              
              {type === 'signature' && stream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-32 border-2 border-green-400 rounded-lg border-dashed animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-green-400 text-sm">Sign Here</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <p className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Hold up your signature to the camera
                    </p>
                  </div>
                </div>
              )}
              
              {/* Loading indicator when stream is being established */}
              {hasPermission && !stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                  <div className="text-center text-white">
                    <div className="animate-spin h-8 w-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Initializing live scan...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={captureImage}
                disabled={!stream}
                className={stream ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Camera className="h-4 w-4 mr-2" />
                {stream ? 'Capture Live Scan' : 'Initializing...'} 
              </Button>
            </div>
            
            {stream && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  ✓ Live scan is active and ready for capture
                </p>
              </div>
            )}
          </div>
        )}

        {isCapturing && capturedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured biometric"
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Captured
                </Badge>
              </div>
            </div>

            {isProcessing ? (
              <div className="text-center py-4">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Processing {type} verification...</p>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={retakeCapture}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={processCapture}>
                  <Check className="h-4 w-4 mr-2" />
                  Verify {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </Card>
    </div>
  )
}