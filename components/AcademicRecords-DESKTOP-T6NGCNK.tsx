import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Search,
  Eye
} from 'lucide-react'

export function AcademicRecords() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    certificateType: '',
    institution: '',
    studentName: ''
  })

  const certificates = [
    {
      id: 'CERT-001',
      type: 'Degree Certificate',
      institution: 'IIT Mumbai',
      student: 'Rajesh Kumar',
      year: '2020',
      status: 'Verified',
      confidence: '98.7%',
      issues: []
    },
    {
      id: 'CERT-002', 
      type: 'Mark Sheet',
      institution: 'Delhi University',
      student: 'Priya Singh',
      year: '2019',
      status: 'Suspicious',
      confidence: '67.3%',
      issues: ['Watermark mismatch', 'Font inconsistency']
    },
    {
      id: 'CERT-003',
      type: 'Diploma Certificate',
      institution: 'Polytechnic College',
      student: 'Amit Sharma',
      year: '2021',
      status: 'Pending',
      confidence: '89.2%',
      issues: ['Manual review required']
    }
  ]

  const simulateUpload = () => {
    if (!formData.certificateType || !formData.institution || !formData.studentName) {
      toast.error('Please fill in all required fields')
      return
    }
    
    toast.info('Starting certificate validation...')
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast.success('Certificate validated successfully!')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const downloadReport = () => {
    toast.success('Validation report downloaded successfully')
  }

  const saveToRecords = () => {
    toast.success('Certificate saved to records database')
  }

  const viewCertificate = (certId: string) => {
    toast.info(`Opening certificate ${certId}...`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Suspicious':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'Pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800'
      case 'Suspicious':
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
        <h1 className="mb-2">Certificate & Academic Record Validation</h1>
        <p className="text-muted-foreground">OCR-based validation with institutional verification and blockchain-based QR codes</p>
      </div>

      <Tabs defaultValue="validate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="validate">Validate Certificate</TabsTrigger>
          <TabsTrigger value="records">Certificate Records</TabsTrigger>
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
        </TabsList>

        <TabsContent value="validate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card className="p-6">
              <h2 className="mb-4">Upload Certificate</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Certificate Type</Label>
                  <Select value={formData.certificateType} onValueChange={(value) => setFormData(prev => ({ ...prev, certificateType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="degree">Degree Certificate</SelectItem>
                      <SelectItem value="diploma">Diploma Certificate</SelectItem>
                      <SelectItem value="marksheet">Mark Sheet</SelectItem>
                      <SelectItem value="transcript">Official Transcript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Institution</Label>
                  <Input 
                    placeholder="Enter institution name" 
                    value={formData.institution}
                    onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Student Name</Label>
                  <Input 
                    placeholder="Enter student name"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  />
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {!isUploading ? (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p>Drag and drop your certificate here</p>
                        <p className="text-sm text-muted-foreground">or click to browse files</p>
                      </div>
                      <Button onClick={simulateUpload}>
                        Choose File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p>Processing certificate... {uploadProgress}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Validation Results */}
            <Card className="p-6">
              <h2 className="mb-4">Validation Results</h2>
              
              {uploadProgress === 100 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3>Certificate Validated</h3>
                    <p className="text-muted-foreground">Verification completed successfully</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">OCR Accuracy</span>
                      <Badge>97.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">Institution Verification</span>
                      <Badge>Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">QR Code Validation</span>
                      <Badge>Valid</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm">Duplicate Detection</span>
                      <Badge variant="secondary">None Found</Badge>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" onClick={downloadReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm" onClick={saveToRecords}>
                      Save to Records
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload a certificate to see validation results</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Certificate Records</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search certificates..." className="pl-10" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </div>

            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(cert.status)}
                      <div>
                        <p className="text-sm">{cert.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {cert.student} • {cert.institution} • {cert.year}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm">Confidence: {cert.confidence}</p>
                        <p className="text-xs text-muted-foreground">{cert.id}</p>
                      </div>
                      <Badge className={getStatusColor(cert.status)}>
                        {cert.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => viewCertificate(cert.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {cert.issues.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Issues Found:</p>
                      <div className="flex flex-wrap gap-1">
                        {cert.issues.map((issue, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="institutions">
          <Card className="p-6">
            <h2 className="mb-4">Verified Institutions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'IIT Mumbai', type: 'Technical Institute', certificates: 1247, status: 'Active' },
                { name: 'Delhi University', type: 'University', certificates: 2156, status: 'Active' },
                { name: 'BITS Pilani', type: 'Technical Institute', certificates: 892, status: 'Active' },
                { name: 'Anna University', type: 'University', certificates: 1653, status: 'Active' },
              ].map((institution, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm">{institution.name}</h3>
                    <Badge variant="secondary">{institution.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{institution.type}</p>
                  <p className="text-xs">Certificates processed: {institution.certificates}</p>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}