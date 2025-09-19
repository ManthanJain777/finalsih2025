import { useState, useRef, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { toast } from 'sonner'
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Zap,
  Shield
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your ExeSecure AI Assistant. I can help you with biometric verification, fraud detection, system settings, and answer any questions about academic integrity and security protocols. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'How to verify biometric data?',
        'Check system security status',
        'Fraud detection help',
        'Academic record verification'
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { icon: Shield, label: 'Security Status', action: 'security-status' },
    { icon: HelpCircle, label: 'Help & Guide', action: 'help' },
    { icon: Zap, label: 'Quick Analysis', action: 'analysis' },
    { icon: Bot, label: 'System Health', action: 'health' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): { content: string, suggestions?: string[] } => {
    const input = userInput.toLowerCase()
    
    if (input.includes('biometric') || input.includes('verification')) {
      return {
        content: 'For biometric verification, ensure you have:\n\n1. Valid Aadhaar number (12 digits)\n2. Clear camera access or uploaded images\n3. Proper lighting for face recognition\n4. Clean finger surface for fingerprint scanning\n\nThe system uses multi-layer verification with 85%+ accuracy threshold. Would you like me to guide you through the verification process?',
        suggestions: ['Start biometric verification', 'Check verification history', 'Troubleshoot camera issues']
      }
    }
    
    if (input.includes('fraud') || input.includes('detection')) {
      return {
        content: 'Our fraud detection system uses AI-powered analysis to identify:\n\n• Document tampering (99.2% accuracy)\n• Identity spoofing attempts\n• Suspicious behavioral patterns\n• Anomalous access patterns\n\nCurrent system status: 🟢 Active with 47 threats blocked today. All detection algorithms are running optimally.',
        suggestions: ['View fraud reports', 'Check security alerts', 'Update detection rules']
      }
    }
    
    if (input.includes('security') || input.includes('status')) {
      return {
        content: '🛡️ **System Security Status**\n\n✅ All security protocols active\n✅ Biometric systems operational\n✅ Fraud detection running\n✅ Data encryption enabled\n✅ Audit logging active\n\n**Recent Activity:**\n• 1,247 verifications completed today\n• 0 security breaches detected\n• 99.8% system uptime',
        suggestions: ['View detailed logs', 'Run security audit', 'Check system health']
      }
    }
    
    if (input.includes('academic') || input.includes('record')) {
      return {
        content: 'Academic record verification includes:\n\n📋 **Document Validation:**\n• OCR text extraction\n• Blockchain verification\n• Institution database matching\n• Digital signature validation\n\n🔍 **Current Processing:**\n• 342 certificates verified today\n• Average processing time: 45 seconds\n• 99.7% authenticity rate',
        suggestions: ['Upload new certificate', 'Check verification queue', 'Institution settings']
      }
    }
    
    if (input.includes('help') || input.includes('how')) {
      return {
        content: 'I can help you with:\n\n🔐 **Security & Verification**\n• Biometric authentication setup\n• Fraud detection configuration\n• Security protocol guidance\n\n📊 **System Management**\n• Analytics and reporting\n• User management\n• System configuration\n\n🎓 **Academic Integrity**\n• Certificate verification\n• Exam hall monitoring\n• Compliance management\n\nWhat specific area would you like help with?',
        suggestions: ['Biometric setup guide', 'Fraud detection help', 'System configuration', 'Compliance guidelines']
      }
    }
    
    // Default response
    return {
      content: 'I understand you\'re asking about "' + userInput + '". As your ExeSecure AI Assistant, I can help with:\n\n• Biometric verification processes\n• Fraud detection and security\n• Academic record validation\n• System configuration\n• Analytics and reporting\n\nCould you please be more specific about what you\'d like help with?',
      suggestions: ['System overview', 'Security features', 'Verification guide', 'Technical support']
    }
  }

  const handleQuickAction = (action: string) => {
    const responses: Record<string, string> = {
      'security-status': 'security status',
      'help': 'I need help with the system',
      'analysis': 'Run a quick system analysis',
      'health': 'Check system health status'
    }
    
    setInputValue(responses[action] || 'help')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative"
        >
          <MessageCircle className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[600px]'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm">AI Assistant</h3>
              <p className="text-xs opacity-80">ExeSecure Support</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-3 border-b bg-muted/50">
              <div className="grid grid-cols-4 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="flex flex-col space-y-1 h-auto py-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 h-[400px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {message.type === 'assistant' && (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Bot className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        {message.type === 'user' && (
                          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                            <User className="h-3 w-3" />
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-8'
                            : 'bg-muted mr-8'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                      
                      {message.suggestions && (
                        <div className="mt-2 mr-8">
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%]">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground">Typing...</span>
                      </div>
                      <div className="bg-muted rounded-lg p-3 mr-8">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about ExeSecure..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by ExeSecure AI
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}