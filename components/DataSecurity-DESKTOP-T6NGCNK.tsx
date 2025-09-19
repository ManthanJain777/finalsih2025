import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { toast } from 'sonner' // Corrected import
import {
  Shield,
  Lock,
  Key,
  Database,
  CheckCircle,
  AlertTriangle,
  FileShield,
  Activity,
  Settings
} from 'lucide-react'

export function DataSecurity() {
  const [privacySettings, setPrivacySettings] = useState({
    dataAnonymization: true,
    consentManagement: true,
    dataMinimization: true,
    rightToErasure: true,
    dataPortability: false
  })

  const handlePrivacyToggle = (setting: string, checked: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: checked }))
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${checked ? 'enabled' : 'disabled'}`)
  }
  const securityFeatures = [
    {
      name: 'Aadhaar KYC for Bulletproof Networks',
      description: 'Advanced KYC verification ensuring network security',
      enabled: true,
      status: 'Active',
      lastUpdate: '2 min ago'
    },
    {
      name: 'Encrypted Storage & Meta-data Access Control',
      description: 'End-to-end encryption with granular access controls',
      enabled: true,
      status: 'Active',
      lastUpdate: '5 min ago'
    },
    {
      name: 'Prevents Use of Fake Degrees in Jobs/Admissions',
      description: 'Real-time verification preventing fraudulent credentials',
      enabled: true,
      status: 'Active',
      lastUpdate: '1 min ago'
    },
    {
      name: 'Ensures Only Genuine Candidates Enter Exams/Institutions',
      description: 'Multi-layer identity verification for authentic access',
      enabled: true,
      status: 'Active',
      lastUpdate: '3 min ago'
    }
  ]

  const privacyCompliance = [
    {
      regulation: 'GDPR Compliance',
      status: 'Compliant',
      coverage: 98.5,
      lastAudit: '2024-01-10'
    },
    {
      regulation: 'IT Act 2000 (India)',
      status: 'Compliant', 
      coverage: 99.2,
      lastAudit: '2024-01-12'
    },
    {
      regulation: 'DPDP Act 2023',
      status: 'Compliant',
      coverage: 97.8,
      lastAudit: '2024-01-08'
    },
    {
      regulation: 'ISO 27001',
      status: 'Certified',
      coverage: 100,
      lastAudit: '2024-01-15'
    }
  ]

  const securityMetrics = [
    { metric: 'Data Encryption Level', value: 'AES-256', status: 'Secure' },
    { metric: 'Access Control Policy', value: 'Zero Trust', status: 'Active' },
    { metric: 'Backup Frequency', value: 'Real-time', status: 'Active' },
    { metric: 'Vulnerability Scans', value: 'Daily', status: 'Active' },
    { metric: 'Incident Response Time', value: '< 15 min', status: 'Optimized' },
    { metric: 'Audit Trail Retention', value: '7 years', status: 'Compliant' }
  ]

  const accessLogs = [
    {
      user: 'Admin User',
      action: 'Viewed biometric data',
      resource: 'Student Database',
      timestamp: '2 min ago',
      status: 'Authorized',
      ip: '192.168.1.100'
    },
    {
      user: 'Verification Agent',
      action: 'Downloaded certificate',
      resource: 'Academic Records',
      timestamp: '5 min ago',
      status: 'Authorized',
      ip: '192.168.1.105'
    },
    {
      user: 'Unknown User',
      action: 'Failed login attempt',
      resource: 'System Access',
      timestamp: '12 min ago',
      status: 'Blocked',
      ip: '203.45.67.89'
    },
    {
      user: 'System Admin',
      action: 'Updated security policy',
      resource: 'Security Settings',
      timestamp: '25 min ago',
      status: 'Authorized',
      ip: '192.168.1.101'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Compliant':
      case 'Certified':
      case 'Secure':
      case 'Authorized':
        return 'bg-green-100 text-green-800'
      case 'Blocked':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Data Security & Privacy</h1>
        <p className="text-muted-foreground">Aadhaar KYC bulletproof networks with encrypted storage and access control</p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList>
          <TabsTrigger value="security">Security Features</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <p className="text-xl">98.7%</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <Lock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Encrypted Records</p>
                  <p className="text-xl">100%</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <Key className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-xl">47</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Security Alerts</p>
                  <p className="text-xl">2</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Security Features */}
          <Card className="p-6">
            <h2 className="mb-4">Expected Impact & Security Features</h2>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="text-sm">{feature.name}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{feature.lastUpdate}</p>
                    </div>
                    <Switch checked={feature.enabled} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Security Metrics */}
          <Card className="p-6">
            <h2 className="mb-4">Security Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityMetrics.map((metric, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm">{metric.metric}</h3>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <p className="text-lg mt-1">{metric.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">Regulatory Compliance</h2>
              <div className="space-y-4">
                {privacyCompliance.map((compliance, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm">{compliance.regulation}</h3>
                      <Badge className={getStatusColor(compliance.status)}>
                        {compliance.status}
                      </Badge>
                    </div>
                    <Progress value={compliance.coverage} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Coverage: {compliance.coverage}%</span>
                      <span>Last audit: {compliance.lastAudit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4">Privacy Controls</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Data Anonymization</Label>
                  <Switch 
                    checked={privacySettings.dataAnonymization}
                    onCheckedChange={(checked) => handlePrivacyToggle('dataAnonymization', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Consent Management</Label>
                  <Switch 
                    checked={privacySettings.consentManagement}
                    onCheckedChange={(checked) => handlePrivacyToggle('consentManagement', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Data Minimization</Label>
                  <Switch 
                    checked={privacySettings.dataMinimization}
                    onCheckedChange={(checked) => handlePrivacyToggle('dataMinimization', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Right to Erasure</Label>
                  <Switch 
                    checked={privacySettings.rightToErasure}
                    onCheckedChange={(checked) => handlePrivacyToggle('rightToErasure', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Data Portability</Label>
                  <Switch 
                    checked={privacySettings.dataPortability}
                    onCheckedChange={(checked) => handlePrivacyToggle('dataPortability', checked)}
                  />
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm mb-3">Data Retention Policies</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Biometric Data</span>
                      <span>5 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Academic Records</span>
                      <span>10 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audit Logs</span>
                      <span>7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temporary Data</span>
                      <span>30 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access">
          <Card className="p-6">
            <h2 className="mb-4">Recent Access Logs</h2>
            <div className="space-y-3">
              {accessLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <div>
                      <h3 className="text-sm">{log.user}</h3>
                      <p className="text-xs text-muted-foreground">
                        {log.action} • {log.resource}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">IP: {log.ip}</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="mb-4">Security Monitoring</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Intrusion Detection</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Active</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">Real-time Monitoring</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Active</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm">Anomaly Detection</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Active</span>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm">Threat Intelligence</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Active</span>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4">System Health</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Security Score</span>
                    <span className="text-sm">98.7%</span>
                  </div>
                  <Progress value={98.7} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Compliance Score</span>
                    <span className="text-sm">96.4%</span>
                  </div>
                  <Progress value={96.4} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Data Integrity</span>
                    <span className="text-sm">99.9%</span>
                  </div>
                  <Progress value={99.9} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Access Control</span>
                    <span className="text-sm">100%</span>
                  </div>
                  <Progress value={100} />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}