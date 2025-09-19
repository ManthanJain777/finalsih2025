import { useState } from 'react'
import { AuthProvider } from '../components/AuthWrapper'
import { Sidebar } from '../components/Sidebar'
import { Dashboard } from '../components/Dashboard'
import { BiometricVerification } from '../components/BiometricVerification'
import { AcademicRecords } from '../components/AcademicRecords'
import { FraudDetection } from '../components/FraudDetection'
import { ExamHallSecurity } from '../components/ExamHallSecurity'
import { Analytics } from '../components/Analytics'
import { DataSecurity } from '../components/DataSecurity'
import { Settings } from '../components/Settings'
import { FloatingAIAssistant } from '../components/FloatingAIAssistant'
import { ProcessCancellationWidget } from '../components/ProcessCancellationWidget'
import { Toaster } from '../components/ui/sonner'

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'biometric':
        return <BiometricVerification onNavigate={setActiveSection} />
      case 'academic':
        return <AcademicRecords />
      case 'fraud':
        return <FraudDetection />
      case 'exam':
        return <ExamHallSecurity />
      case 'analytics':
        return <Analytics />
      case 'data':
        return <DataSecurity />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
      <FloatingAIAssistant />
      <ProcessCancellationWidget />
      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}