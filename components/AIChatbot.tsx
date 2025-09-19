import { useState, useRef, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  Bot, 
  User, 
  Send, 
  Trash2, 
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Shield,
  AlertTriangle,
  FileCheck,
  Users,
  Settings
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface QuickAction {
  icon: typeof Shield
  label: string
  query: string
  category: string
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m ExeSecure AI Assistant. I can help you with identity verification, fraud detection, system management, and compliance questions. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickActions: QuickAction[] = [
    {
      icon: Shield,
      label: 'How to verify identity?',
      query: 'Explain the multi-layer biometric identity verification process',
      category: 'Verification'
    },
    {
      icon: AlertTriangle,
      label: 'Detect fraud patterns',
      query: 'What are common fraud patterns and how to detect them?',
      category: 'Fraud Detection'
    },
    {
      icon: FileCheck,
      label: 'Certificate validation',
      query: 'How does the OCR-based certificate validation work?',
      category: 'Academic Records'
    },
    {
      icon: Users,
      label: 'Exam hall security',
      query: 'Explain the ESP32-based exam hall monitoring system',
      category: 'Security'
    },
    {
      icon: Settings,
      label: 'System compliance',
      query: 'What compliance standards does the system follow?',
      category: 'Compliance'
    }
  ]

  const predefinedResponses: Record<string, string> = {
    'verify identity': 'Our multi-layer biometric verification uses three key methods:\n\n1. **Fingerprint Verification** - Aadhaar-based fingerprint matching with 98.5% accuracy\n2. **Face Recognition** - AI-powered face recognition with liveness detection\n3. **Signature Verification** - Digital signature verification using CNS/ESM models\n\nThe system requires a minimum confidence score of 85% across all three methods for successful verification.',
    
    'fraud patterns': 'Common fraud patterns detected by our AI system:\n\n**Document Forgery (45%)** - Tampered certificates, altered seals, fake watermarks\n**Identity Theft (32%)** - Multiple accounts using same biometric data\n**Photo Manipulation (23%)** - AI-generated photos, deepfakes, edited images\n\nOur detection accuracy is 96.8% with less than 2.1% false positives.',
    
    'certificate validation': 'Our OCR-based validation process includes:\n\n1. **Document Analysis** - Pixel-level examination for tampering\n2. **OCR Extraction** - Text recognition with 97.8% accuracy\n3. **Institution Verification** - Cross-checking with official databases\n4. **QR Code Validation** - Blockchain-based certificate verification\n5. **Duplicate Detection** - Comparison against existing records',
    
    'exam hall security': 'Our ESP32-based monitoring system provides:\n\n**Real-time Face Recognition** - Continuous identity verification\n**Mobile Device Detection** - Bluetooth scanning for unauthorized devices\n**Behavioral Analysis** - AI detection of suspicious movements\n**Live Alerts** - Instant notifications for violations\n\nThe system monitors up to 200 students simultaneously with 96% security score.',
    
    'compliance standards': 'ExeSecure AI complies with:\n\n**GDPR** - 98.5% compliance score\n**IT Act 2000 (India)** - 99.2% compliance\n**DPDP Act 2023** - 97.8% compliance\n**ISO 27001** - Certified with 100% coverage\n\nWe use AES-256 encryption, Zero Trust access control, and maintain audit trails for 7 years.'
  }

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return response
      }
    }

    // Contextual responses based on keywords
    if (lowerMessage.includes('biometric') || lowerMessage.includes('fingerprint')) {
      return 'Our biometric verification system uses advanced AI algorithms for fingerprint matching, face recognition, and signature verification. The system achieves 98.5% accuracy and integrates with Aadhaar for secure identity validation. Would you like me to explain a specific biometric method?'
    }
    
    if (lowerMessage.includes('fraud') || lowerMessage.includes('detection')) {
      return 'Our fraud detection system uses AI to identify document forgery, identity theft, and photo manipulation. We maintain a 96.8% detection accuracy with real-time alerts. The system can detect deepfakes, tampered documents, and duplicate records. What specific fraud type would you like to know about?'
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('data')) {
      return 'Data security is ensured through AES-256 encryption, Aadhaar KYC networks, and Zero Trust architecture. We maintain 99.97% uptime with real-time monitoring and comply with GDPR, DPDP Act, and ISO 27001 standards. How can I help with security configuration?'
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I can assist you with:\n\n• Identity verification processes\n• Fraud detection and prevention\n• Academic record validation\n• Exam hall security monitoring\n• Data privacy and compliance\n• System configuration and troubleshooting\n\nWhat specific area would you like help with?'
    }

    // Default response
    return 'I\'m here to help with ExeSecure AI system. I can assist with identity verification, fraud detection, academic record validation, exam hall security, and compliance questions. Could you please be more specific about what you\'d like to know?'
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(content),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000) // 1-3 second delay
  }

  const handleSend = () => {
    sendMessage(inputValue)
  }

  const handleQuickAction = (query: string) => {
    sendMessage(query)
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Chat cleared! How can I assist you with ExeSecure AI today?',
        timestamp: new Date()
      }
    ])
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type.toUpperCase()}: ${msg.content}`
    ).join('\n\n')
    
    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ExeSecure-AI-Chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">ExeSecure AI Assistant</h1>
          <p className="text-muted-foreground">Get instant help with identity verification, fraud detection, and system management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportChat}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span className="text-sm">Quick Actions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickAction(action.query)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${
                  message.type === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.type === 'bot' && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 bg-muted rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />
        
        {/* Input Area */}
        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about ExeSecure AI..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • AI responses are simulated for demonstration
          </p>
        </div>
      </Card>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI Online</span>
          </div>
          <div>Response Time: ~2s</div>
        </div>
        <div>
          {messages.length - 1} messages • {Math.floor(Math.random() * 100 + 900)} users helped today
        </div>
      </div>
    </div>
  )
}