import { useState, useRef } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { useCancellableProcesses, createCancellableTimeout } from '../utils/cancellation'
import { fraudAPI } from '../utils/api'
import { toast } from 'sonner'
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Search, 
  TrendingUp,
  FileX,
  Users,
  Activity,
  StopCircle,
  X
} from 'lucide-react'

export function FraudDetection() {
  const [scanInProgress, setScanInProgress] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [activeScanId, setActiveScanId] = useState<string | null>(null)
  const { addProcess, cancelProcess } = useCancellableProcesses()
  const scanTimeoutRef = useRef<{ cancel: () => void } | null>(null)

  const fraudAlerts = [
    {
      id: 'FRAUD-001',
      type: 'Document Forgery',
      severity: 'High',
      description: 'Detected tampered graduation certificate',
      user: 'Unknown User',
      timestamp: '2 min ago',
      confidence: '94.7%',
      status: 'Under Investigation'
    },
    {
      id: 'FRAUD-002',
      type: 'Identity Theft',
      severity: 'Critical',
      description: 'Multiple accounts using same biometric data',
      user: 'Suspicious Activity',
      timestamp: '15 min ago',
      confidence: '98.2%',
      status: 'Blocked'
    },
    {
      id: 'FRAUD-003',
      type: 'Photo Manipulation',
      severity: 'Medium',
      description: 'AI-generated photo detected in profile',
      user: 'Ravi Kumar',
      timestamp: '1 hour ago',
      confidence: '87.3%',
      status: 'Pending Review'
    }
  ]

  const fraudStats = [
    { label: 'Total Fraud Attempts', value: '157', change: '+23%', color: 'text-red-600' },
    { label: 'Blocked Accounts', value: '89', change: '+15%', color: 'text-orange-600' },
    { label: 'False Positives', value: '12', change: '-8%', color: 'text-yellow-600' },
    { label: 'Detection Accuracy', value: '96.8%', change: '+2.1%', color: 'text-green-600' }
  ]

  const detectionMethods = [
    {
      name: 'Deepfake Detection',
      description: 'AI anomaly detection for generated/manipulated photos',
      status: 'Active',
      accuracy: '97.2%'
    },
    {
      name: 'Document Tampering',
      description: 'Pixel-level analysis for document modifications',
      status: 'Active', 
      accuracy: '94.8%'
    },
    {
      name: 'Duplicate Detection',
      description: 'Cross-verification against existing records',
      status: 'Active',
      accuracy: '99.1%'
    },
    {
      name: 'Behavioral Analysis',
      description: 'Pattern recognition for suspicious activities',
      status: 'Active',
      accuracy: '89.6%'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const startFullScan = async () => {
    if (scanInProgress) {
      cancelFullScan()
      return
    }

    const processId = addProcess({
      type: 'analysis',
      startTime: new Date(),
      description: 'Full system fraud detection scan',
      onCancel: () => {
        cancelFullScan()
      }
    })

    setActiveScanId(processId)
    setScanInProgress(true)
    setScanProgress(0)
    toast.info('Starting comprehensive fraud detection scan...')

    try {
      let currentProgress = 0
      const updateProgress = () => {
        if (currentProgress < 100 && scanInProgress) {
          currentProgress += Math.random() * 10 + 5
          if (currentProgress > 100) currentProgress = 100
          
          setScanProgress(currentProgress)
          
          if (currentProgress >= 100) {
            setScanInProgress(false)
            setActiveScanId(null)
            toast.success('Fraud detection scan completed successfully!')
            
            // Simulate API call for results
            setTimeout(async () => {
              try {
                await fraudAPI.detect('scan_data', 'FULL_SCAN', 'comprehensive')
              } catch (error) {
                console.error('Scan API error:', error)
              }
            }, 500)
          } else {
            scanTimeoutRef.current = createCancellableTimeout(updateProgress, 400)
          }
        }
      }
      
      updateProgress()
    } catch (error) {
      console.error('Scan start error:', error)
      setScanInProgress(false)
      setActiveScanId(null)
      toast.error('Failed to start fraud detection scan')
    }
  }

  const cancelFullScan = () => {
    if (scanTimeoutRef.current) {
      scanTimeoutRef.current.cancel()
      scanTimeoutRef.current = null
    }
    
    setScanInProgress(false)
    setScanProgress(0)
    setActiveScanId(null)
    toast.success('Fraud detection scan cancelled')
  }

  const investigateAlert = (alertId: string) => {
    toast.info(`Opening investigation panel for alert ${alertId}...`)
  }

  const runSecurityAudit = () => {
    toast.info('Security audit initiated. This may take several minutes...')
  }

  const reviewFlaggedItems = () => {
    toast.info('Opening flagged items review panel...')
  }

  const updateDetectionRules = () => {
    toast.success('Detection rules updated successfully')
  }

  const generateFraudReport = () => {
    toast.success('Fraud report generated. Download will start shortly...')
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Forgery & Fraud Detection</h1>
        <p className="text-muted-foreground">AI-powered detection of tampering, photos, seals, and fraudulent certificates</p>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="alerts">Fraud Alerts</TabsTrigger>
          <TabsTrigger value="detection">Detection Methods</TabsTrigger>
          <TabsTrigger value="analysis">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fraudStats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.change} this week</p>
                  </div>
                  <AlertTriangle className={`h-6 w-6 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>

          {/* Active Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Active Fraud Alerts</h2>
              <div className="flex space-x-2">
                <Button 
                  variant={scanInProgress ? "destructive" : "outline"} 
                  size="sm" 
                  onClick={startFullScan}
                >
                  {scanInProgress ? (
                    <>
                      <StopCircle className="h-4 w-4 mr-2" />
                      Cancel Scan
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Full System Scan
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  Export Report
                </Button>
              </div>
            </div>

            {scanInProgress && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm">System Scan in Progress...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">{Math.round(scanProgress)}%</span>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={cancelFullScan}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={scanProgress} />
                <p className="text-xs text-blue-700 mt-2">
                  Scanning documents, analyzing patterns, and detecting anomalies...
                </p>
              </div>
            )}

            <div className="space-y-4">
              {fraudAlerts.map((alert) => (
                <div key={alert.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm">{alert.type}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>User: {alert.user}</span>
                          <span>Confidence: {alert.confidence}</span>
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{alert.status}</Badge>
                      <Button variant="outline" size="sm" onClick={() => investigateAlert(alert.id)}>
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="detection">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">Detection Methods</h2>
              <div className="space-y-4">
                {detectionMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h3 className="text-sm">{method.name}</h3>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{method.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{method.accuracy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start" onClick={runSecurityAudit}>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Security Audit
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={reviewFlaggedItems}>
                  <Eye className="h-4 w-4 mr-2" />
                  Review Flagged Items
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={updateDetectionRules}>
                  <FileX className="h-4 w-4 mr-2" />
                  Update Detection Rules
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={generateFraudReport}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Fraud Report
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">Fraud Trends</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm">Document Forgery</span>
                  <div className="text-right">
                    <span className="text-sm">45%</span>
                    <div className="w-24 bg-red-200 rounded-full h-2 mt-1">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm">Identity Theft</span>
                  <div className="text-right">
                    <span className="text-sm">32%</span>
                    <div className="w-24 bg-orange-200 rounded-full h-2 mt-1">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm">Photo Manipulation</span>
                  <div className="text-right">
                    <span className="text-sm">23%</span>
                    <div className="w-24 bg-yellow-200 rounded-full h-2 mt-1">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4">Detection Performance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Accuracy</span>
                  <span className="text-sm">96.8%</span>
                </div>
                <Progress value={96.8} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">False Positive Rate</span>
                  <span className="text-sm">2.1%</span>
                </div>
                <Progress value={2.1} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Detection Speed</span>
                  <span className="text-sm">1.3s avg</span>
                </div>
                <Progress value={85} />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}