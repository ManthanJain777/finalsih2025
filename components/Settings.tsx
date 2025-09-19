import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { toast } from 'sonner'
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette,
  Database,
  Globe,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react'

export function Settings() {
  const [userSettings, setUserSettings] = useState({
    name: 'Administrator',
    email: 'admin@exesecure.ai',
    role: 'System Administrator',
    timezone: 'Asia/Kolkata',
    language: 'en'
  })

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    auditLogging: true,
    dataRetention: '7years'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    securityAlerts: true,
    fraudAlerts: true,
    systemAlerts: true
  })

  const handleUserSettingChange = (field: string, value: string) => {
    setUserSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSystemToggle = (setting: string, checked: boolean) => {
    setSystemSettings(prev => ({ ...prev, [setting]: checked }))
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${checked ? 'enabled' : 'disabled'}`)
  }

  const handleNotificationToggle = (setting: string, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: checked }))
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${checked ? 'enabled' : 'disabled'}`)
  }

  const saveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  const exportSettings = () => {
    const settings = {
      user: userSettings,
      system: systemSettings,
      notifications: notificationSettings
    }
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exesecure-settings.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Settings exported successfully!')
  }

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setSystemSettings({
        autoBackup: true,
        maintenanceMode: false,
        debugMode: false,
        auditLogging: true,
        dataRetention: '7years'
      })
      setNotificationSettings({
        emailAlerts: true,
        smsAlerts: false,
        pushNotifications: true,
        securityAlerts: true,
        fraudAlerts: true,
        systemAlerts: true
      })
      toast.success('Settings reset to default values')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">System Settings</h1>
          <p className="text-muted-foreground">Manage your ExeSecure AI system configuration and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={saveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2>User Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={userSettings.name}
                  onChange={(e) => handleUserSettingChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input 
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => handleUserSettingChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={userSettings.role} onValueChange={(value) => handleUserSettingChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="System Administrator">System Administrator</SelectItem>
                    <SelectItem value="Security Analyst">Security Analyst</SelectItem>
                    <SelectItem value="Verification Officer">Verification Officer</SelectItem>
                    <SelectItem value="Audit Manager">Audit Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Timezone</Label>
                <Select value={userSettings.timezone} onValueChange={(value) => handleUserSettingChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2>Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Language</Label>
                <Select value={userSettings.language} onValueChange={(value) => handleUserSettingChange('language', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Compact View</Label>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2>Security Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                </div>
                <Select defaultValue="30min">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">15 min</SelectItem>
                    <SelectItem value="30min">30 min</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="4hours">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>API Access</Label>
                  <p className="text-sm text-muted-foreground">Allow API access to your account</p>
                </div>
                <Switch />
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3>Password Security</h3>
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Download Recovery Codes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2>Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle('emailAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch 
                  checked={notificationSettings.smsAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle('smsAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch 
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <h3>Alert Types</h3>
              
              <div className="flex items-center justify-between">
                <Label>Security Alerts</Label>
                <Switch 
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle('securityAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Fraud Detection Alerts</Label>
                <Switch 
                  checked={notificationSettings.fraudAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle('fraudAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>System Status Alerts</Label>
                <Switch 
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle('systemAlerts', checked)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2>System Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">Daily backup of system data</p>
                </div>
                <Switch 
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => handleSystemToggle('autoBackup', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                </div>
                <Switch 
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSystemToggle('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                </div>
                <Switch 
                  checked={systemSettings.debugMode}
                  onCheckedChange={(checked) => handleSystemToggle('debugMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Track all system activities</p>
                </div>
                <Switch 
                  checked={systemSettings.auditLogging}
                  onCheckedChange={(checked) => handleSystemToggle('auditLogging', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Retention Period</Label>
                  <p className="text-sm text-muted-foreground">How long to keep audit logs</p>
                </div>
                <Select value={systemSettings.dataRetention} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dataRetention: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1 year</SelectItem>
                    <SelectItem value="3years">3 years</SelectItem>
                    <SelectItem value="5years">5 years</SelectItem>
                    <SelectItem value="7years">7 years</SelectItem>
                    <SelectItem value="10years">10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>System Version</Label>
                <div className="flex items-center space-x-2">
                  <Badge>v2.4.1</Badge>
                  <Badge variant="outline">Latest</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Database Version</Label>
                <Badge variant="secondary">PostgreSQL 15.2</Badge>
              </div>
              <div className="space-y-2">
                <Label>Last Backup</Label>
                <p className="text-sm">Today at 3:00 AM</p>
              </div>
              <div className="space-y-2">
                <Label>System Health</Label>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2>Advanced Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-3">Data Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    Backup Database
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="mb-3">System Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">
                    Clear Cache
                  </Button>
                  <Button variant="outline">
                    Rebuild Index
                  </Button>
                  <Button variant="outline">
                    Update System
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="mb-3">Danger Zone</h3>
                <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-red-800">Reset All Settings</Label>
                      <p className="text-sm text-red-600">Reset all settings to default values</p>
                    </div>
                    <Button variant="destructive" onClick={resetSettings}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}