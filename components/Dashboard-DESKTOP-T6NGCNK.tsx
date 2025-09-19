import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { analyticsAPI, healthCheck } from '../utils/api'
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  AlertTriangle,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react'

export function Dashboard() {
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  // Load dashboard data from backend
  useEffect(() => {
    loadDashboardData()
    checkBackendHealth()
    
    // Set up real-time data updates
    const interval = setInterval(() => {
      loadDashboardData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const checkBackendHealth = async () => {
    setBackendStatus('checking')
    try {
      await healthCheck()
      setBackendStatus('connected')
    } catch (error) {
      console.error('Backend health check failed:', error)
      setBackendStatus('disconnected')
    }
  }

  const loadDashboardData = async () => {
    try {
      const data = await analyticsAPI.getDashboard()
      setDashboardData(data)
      setBackendStatus('connected')
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setBackendStatus('disconnected')
      // Use fallback data for demo
      setDashboardData({
        totalExams: 1247,
        activeExams: 23,
        fraudDetected: 8,
        verificationRate: 0.982,
        monthlyData: [],
        recentAlerts: []
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    try {
      await loadDashboardData()
      await checkBackendHealth()
      toast.success('Dashboard data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh dashboard data')
    } finally {
      setRefreshing(false)
    }
  }

  const startNewVerification = () => {
    toast.info('Redirecting to verification module...')
    // In a real app, this would navigate to the verification page
  }

  const uploadDocuments = () => {
    toast.info('Opening document upload interface...')
  }

  const viewMetrics = () => {
    toast.info('Loading system metrics...')
  }

  const generateReport = () => {
    toast.success('Report generation started. You\'ll receive an email when ready.')
  }
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { 
      title: 'Total Exams', 
      value: dashboardData?.totalExams?.toLocaleString() || '0', 
      change: '+12%', 
      icon: FileCheck,
      color: 'text-blue-600'
    },
    { 
      title: 'Active Exams', 
      value: dashboardData?.activeExams?.toLocaleString() || '0', 
      change: '+5%', 
      icon: Users,
      color: 'text-green-600'
    },
    { 
      title: 'Fraud Detected', 
      value: dashboardData?.fraudDetected?.toString() || '0', 
      change: '-8%', 
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    { 
      title: 'Verification Rate', 
      value: ((dashboardData?.verificationRate || 0) * 100).toFixed(1) + '%', 
      change: '+0.5%', 
      icon: TrendingUp,
      color: 'text-emerald-600'
    },
  ]

  const recentVerifications = [
    {
      id: 'VER-001',
      type: 'Aadhaar Verification',
      user: 'Rajesh Kumar',
      status: 'Verified',
      time: '2 min ago',
      confidence: '99.8%'
    },
    {
      id: 'VER-002',
      type: 'Academic Certificate',
      user: 'Priya Singh',
      status: 'Pending',
      time: '5 min ago',
      confidence: '95.2%'
    },
    {
      id: 'VER-003',
      type: 'Biometric Scan',
      user: 'Amit Sharma',
      status: 'Failed',
      time: '12 min ago',
      confidence: '67.3%'
    },
    {
      id: 'VER-004',
      type: 'Document Validation',
      user: 'Sunita Patel',
      status: 'Verified',
      time: '18 min ago',
      confidence: '97.1%'
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor system performance and recent verification activities</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              backendStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
              backendStatus === 'disconnected' ? 'bg-red-500' : 
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-sm text-muted-foreground">
              Backend {backendStatus === 'connected' ? 'Connected' : backendStatus === 'disconnected' ? 'Offline' : 'Checking...'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Verifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Recent Verifications</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData} 
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentVerifications.map((verification) => (
            <div key={verification.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(verification.status)}
                <div>
                  <p className="text-sm">{verification.type}</p>
                  <p className="text-sm text-muted-foreground">{verification.user} • {verification.id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm">Confidence: {verification.confidence}</p>
                  <p className="text-xs text-muted-foreground">{verification.time}</p>
                </div>
                <Badge className={getStatusColor(verification.status)}>
                  {verification.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="mb-2">New Verification</h3>
          <p className="text-sm text-muted-foreground mb-3">Start a new identity verification process</p>
          <Button className="w-full" onClick={startNewVerification}>Start Verification</Button>
        </Card>
        
        <Card className="p-4">
          <h3 className="mb-2">Bulk Upload</h3>
          <p className="text-sm text-muted-foreground mb-3">Upload multiple documents for verification</p>
          <Button variant="outline" className="w-full" onClick={uploadDocuments}>Upload Documents</Button>
        </Card>
        
        <Card className="p-4">
          <h3 className="mb-2">System Health</h3>
          <p className="text-sm text-muted-foreground mb-3">Check system performance metrics</p>
          <Button variant="outline" className="w-full" onClick={viewMetrics}>View Metrics</Button>
        </Card>
        
        <Card className="p-4">
          <h3 className="mb-2">Generate Report</h3>
          <p className="text-sm text-muted-foreground mb-3">Create verification activity reports</p>
          <Button variant="outline" className="w-full" onClick={generateReport}>Generate</Button>
        </Card>
      </div>
    </div>
  )
}