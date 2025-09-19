import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  FileCheck, 
  AlertTriangle,
  Download,
  Calendar,
  Filter
} from 'lucide-react'

export function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days')

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value)
    toast.info(`Analytics updated for ${value === '7days' ? 'last 7 days' : value === '30days' ? 'last 30 days' : value === '90days' ? 'last 90 days' : 'this year'}`)
  }

  const exportData = () => {
    toast.success('Analytics report exported successfully!')
  }

  const filterInstitutions = () => {
    toast.info('Opening institution filter panel...')
  }
  const verificationStats = {
    total: 12847,
    successful: 12521,
    failed: 203,
    pending: 123,
    successRate: 97.5,
    avgProcessingTime: '2.3s'
  }

  const monthlyData = [
    { month: 'Jan', verifications: 1200, fraud: 15, success: 96.8 },
    { month: 'Feb', verifications: 1100, fraud: 12, success: 97.2 },
    { month: 'Mar', verifications: 1350, fraud: 18, success: 96.5 },
    { month: 'Apr', verifications: 1250, fraud: 10, success: 98.1 },
    { month: 'May', verifications: 1400, fraud: 22, success: 96.1 },
    { month: 'Jun', verifications: 1300, fraud: 8, success: 98.5 }
  ]

  const institutionStats = [
    { name: 'IIT Mumbai', verifications: 2341, success: 98.7, trend: 'up' },
    { name: 'Delhi University', verifications: 1987, success: 97.2, trend: 'up' },
    { name: 'BITS Pilani', verifications: 1654, success: 96.8, trend: 'down' },
    { name: 'Anna University', verifications: 1432, success: 98.1, trend: 'up' },
    { name: 'NIT Trichy', verifications: 1298, success: 97.5, trend: 'up' }
  ]

  const fraudAnalytics = [
    { type: 'Document Forgery', count: 45, percentage: 42.1, trend: '+8%' },
    { type: 'Identity Theft', count: 32, percentage: 29.9, trend: '-3%' },
    { type: 'Photo Manipulation', count: 18, percentage: 16.8, trend: '+12%' },
    { type: 'Certificate Duplication', count: 12, percentage: 11.2, trend: '-15%' }
  ]

  const performanceMetrics = [
    { metric: 'Average Processing Time', value: '2.3s', change: '-0.8s', trend: 'down' },
    { metric: 'System Uptime', value: '99.97%', change: '+0.02%', trend: 'up' },
    { metric: 'API Response Time', value: '145ms', change: '-12ms', trend: 'down' },
    { metric: 'Database Performance', value: '98.2%', change: '+1.1%', trend: 'up' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Admin & Analytics Dashboard</h1>
          <p className="text-muted-foreground">Central authority dashboard with real-time verification analytics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Verifications</p>
                  <p className="text-2xl">{verificationStats.total.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <FileCheck className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl">{verificationStats.successRate}%</p>
                  <p className="text-sm text-green-600">+0.3% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Verifications</p>
                  <p className="text-2xl">{verificationStats.failed}</p>
                  <p className="text-sm text-red-600">-8% from last month</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                  <p className="text-2xl">{verificationStats.avgProcessingTime}</p>
                  <p className="text-sm text-green-600">-0.5s from last month</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card className="p-6">
            <h2 className="mb-4">Monthly Verification Trends</h2>
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">{month.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Verifications:</span>
                      <span className="text-sm">{month.verifications}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Fraud:</span>
                      <span className="text-sm text-red-600">{month.fraud}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">Success: {month.success}%</span>
                    <Progress value={month.success} className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="institutions">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Institution Performance</h2>
              <Button variant="outline" size="sm" onClick={filterInstitutions}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {institutionStats.map((institution, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-sm">{institution.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {institution.verifications.toLocaleString()} verifications
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm">Success Rate: {institution.success}%</p>
                      <Progress value={institution.success} className="w-24 mt-1" />
                    </div>
                    {institution.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="fraud">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">Fraud Type Distribution</h2>
              <div className="space-y-4">
                {fraudAnalytics.map((fraud, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{fraud.type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{fraud.count}</span>
                        <Badge variant={fraud.trend.startsWith('+') ? "destructive" : "secondary"}>
                          {fraud.trend}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={fraud.percentage} />
                    <p className="text-xs text-muted-foreground">{fraud.percentage}% of total fraud cases</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4">Fraud Detection Performance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Detection Accuracy</span>
                  <span className="text-sm">96.8%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">False Positive Rate</span>
                  <span className="text-sm">2.1%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm">Average Detection Time</span>
                  <span className="text-sm">1.7s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm">Cases Reviewed</span>
                  <span className="text-sm">187</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">System Performance Metrics</h2>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h3 className="text-sm">{metric.metric}</h3>
                      <p className="text-lg">{metric.value}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4">Resource Utilization</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm">68%</span>
                  </div>
                  <Progress value={68} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm">74%</span>
                  </div>
                  <Progress value={74} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Storage Usage</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Network Usage</span>
                    <span className="text-sm">32%</span>
                  </div>
                  <Progress value={32} />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}