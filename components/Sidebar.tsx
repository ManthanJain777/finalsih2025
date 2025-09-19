import { 
  Shield, 
  UserCheck, 
  FileCheck, 
  AlertTriangle, 
  Camera, 
  BarChart3, 
  Settings, 
  Database,
  Home,
  LogOut,
  User
} from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from './AuthWrapper'
import { Badge } from './ui/badge'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth()
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'biometric', label: 'Biometric Verification', icon: UserCheck },
    { id: 'academic', label: 'Academic Records', icon: FileCheck },
    { id: 'fraud', label: 'Fraud Detection', icon: AlertTriangle },
    { id: 'exam', label: 'Exam Hall Security', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'data', label: 'Data Security', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg">ExeSecure AI</h1>
            <p className="text-sm text-muted-foreground">Identity Validator</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-border space-y-3">
        {user && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm">System Status</p>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}