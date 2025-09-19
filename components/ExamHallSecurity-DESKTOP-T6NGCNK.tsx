import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { useCancellableProcesses } from '../utils/cancellation'
import { examAPI } from '../utils/api'
import { toast } from 'sonner'
import { 
  Camera, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Monitor,
  Eye,
  Clock,
  Shield,
  Activity,
  StopCircle,
  Play,
  Pause
} from 'lucide-react'

export function ExamHallSecurity() {
  const [monitoringActive, setMonitoringActive] = useState(true)
  const [realTimeAlerts, setRealTimeAlerts] = useState(true)
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [sessionDetails, setSessionDetails] = useState<any>(null)
  const { addProcess, cancelProcess } = useCancellableProcesses()

  const handleMonitoringToggle = (checked: boolean) => {
    setMonitoringActive(checked)
    
    if (checked) {
      startMonitoringSession()
    } else {
      stopMonitoringSession()
    }
  }

  const startMonitoringSession = async () => {
    try {
      const sessionData = await examAPI.startMonitoring('EXAM_' + Date.now(), 'HALL-A1', 120)
      
      const processId = addProcess({
        type: 'monitoring',
        startTime: new Date(),
        description: 'Exam hall monitoring session',
        onCancel: () => {
          stopMonitoringSession()
        }
      })

      setActiveSession(sessionData.sessionId)
      setSessionDetails(sessionData)
      toast.success('Monitoring session started successfully')
    } catch (error) {
      console.error('Failed to start monitoring:', error)
      toast.error('Failed to start monitoring session')
      setMonitoringActive(false)
    }
  }

  const stopMonitoringSession = () => {
    if (activeSession) {
      setActiveSession(null)
      setSessionDetails(null)
    }
    setMonitoringActive(false)
    toast.success('Monitoring session stopped')
  }

  const handleAlertsToggle = (checked: boolean) => {
    setRealTimeAlerts(checked)
    toast.success(checked ? 'Real-time alerts enabled' : 'Real-time alerts disabled')
  }

  const viewLiveFeed = (hallId: string) => {
    toast.info(`Opening live camera feed for ${hallId}...`)
  }

  const viewAlert = (alertId: string) => {
    toast.info(`Opening alert details for ${alertId}...`)
  }

  const respondToAlert = (alertId: string) => {
    toast.success(`Alert ${alertId} marked as responded`)
  }

  const examHalls = [
    {
      id: 'HALL-A1',
      name: 'Main Examination Hall A1',
      capacity: 150,
      currentStudents: 142,
      cameras: 8,
      status: 'Active',
      violations: 2,
      lastUpdate: '2 min ago'
    },
    {
      id: 'HALL-B2',
      name: 'Computer Lab B2', 
      capacity: 60,
      currentStudents: 58,
      cameras: 4,
      status: 'Active',
      violations: 0,
      lastUpdate: '1 min ago'
    },
    {
      id: 'HALL-C3',
      name: 'Lecture Hall C3',
      capacity: 200,
      currentStudents: 0,
      cameras: 6,
      status: 'Inactive',
      violations: 0,
      lastUpdate: '30 min ago'
    }
  ]

  const liveAlerts = [
    {
      id: 'ALERT-001',
      hall: 'HALL-A1',
      type: 'Suspicious Movement',
      description: 'Student looking at neighbor\'s paper',
      severity: 'Medium',
      timestamp: '30 sec ago',
      camera: 'CAM-A1-03',
      student: 'Seat 45'
    },
    {
      id: 'ALERT-002',
      hall: 'HALL-A1', 
      type: 'Mobile Device',
      description: 'Electronic device detected under desk',
      severity: 'High',
      timestamp: '2 min ago',
      camera: 'CAM-A1-07',
      student: 'Seat 73'
    },
    {
      id: 'ALERT-003',
      hall: 'HALL-B2',
      type: 'Face Not Visible',
      description: 'Student face covered by hand',
      severity: 'Low',
      timestamp: '5 min ago',
      camera: 'CAM-B2-02',
      student: 'Seat 12'
    }
  ]

  const securityFeatures = [
    {
      name: 'Real-time Face Recognition',
      description: 'ESP32-based Bluetooth scanning for unauthorized devices',
      enabled: true,
      accuracy: '98.5%'
    },
    {
      name: 'Mobile Device Detection',
      description: 'Detection of electronic devices in exam hall',
      enabled: true,
      accuracy: '94.2%'
    },
    {
      name: 'Behavioral Analysis',
      description: 'AI analysis of suspicious behaviors and movements',
      enabled: true,
      accuracy: '89.7%'
    },
    {
      name: 'Voice Detection',
      description: 'Audio monitoring for unauthorized communication',
      enabled: false,
      accuracy: '92.1%'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-orange-100 text-orange-800'
      case 'Low':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Exam Hall Security (Challenge AI Value Add)</h1>
        <p className="text-muted-foreground">ESP32-based Bluetooth scanning for mobile detection and real-time monitoring</p>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="halls">Exam Halls</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Control Panel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h2>Security Control Panel</h2>
                {activeSession && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    Session Active
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={monitoringActive} 
                    onCheckedChange={handleMonitoringToggle}
                    id="monitoring"
                  />
                  <Label htmlFor="monitoring">Active Monitoring</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={realTimeAlerts} 
                    onCheckedChange={handleAlertsToggle}
                    id="alerts"
                  />
                  <Label htmlFor="alerts">Real-time Alerts</Label>
                </div>
                
                {activeSession && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopMonitoringSession}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Session
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-muted-foreground">Active Cameras</p>
                <p className="text-xl">18</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-muted-foreground">Students Monitored</p>
                <p className="text-xl">200</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-xl">3</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className="text-xl">96%</p>
              </div>
            </div>
          </Card>

          {/* Live Alerts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Live Security Alerts</h2>
              <Badge variant="outline" className="animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            </div>

            <div className="space-y-3">
              {liveAlerts.map((alert) => (
                <div key={alert.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm">{alert.type}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Hall: {alert.hall}</span>
                          <span>Camera: {alert.camera}</span>
                          <span>Student: {alert.student}</span>
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => viewAlert(alert.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" onClick={() => respondToAlert(alert.id)}>
                        Respond
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="halls">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {examHalls.map((hall) => (
              <Card key={hall.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm">{hall.name}</h3>
                  <Badge className={getStatusColor(hall.status)}>
                    {hall.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Occupancy</span>
                    <span>{hall.currentStudents}/{hall.capacity}</span>
                  </div>
                  <Progress value={(hall.currentStudents / hall.capacity) * 100} />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cameras</p>
                      <p>{hall.cameras} active</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Violations</p>
                      <p className={hall.violations > 0 ? 'text-red-600' : 'text-green-600'}>
                        {hall.violations}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Last update: {hall.lastUpdate}</p>
                  </div>

                  <Button variant="outline" className="w-full" size="sm" onClick={() => viewLiveFeed(hall.id)}>
                    <Camera className="h-4 w-4 mr-2" />
                    View Live Feed
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">Security Features</h2>
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm">{feature.name}</h3>
                        <Switch 
                          checked={feature.enabled}
                          size="sm"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-sm">{feature.accuracy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4">Alert Configuration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>High Priority Alerts</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Alerts</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-Recording</Label>
                  <Switch defaultChecked />
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm mb-3">Alert Thresholds</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Suspicious Movement</Label>
                      <Progress value={75} />
                    </div>
                    <div>
                      <Label className="text-xs">Device Detection</Label>
                      <Progress value={85} />
                    </div>
                    <div>
                      <Label className="text-xs">Face Recognition</Label>
                      <Progress value={90} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}