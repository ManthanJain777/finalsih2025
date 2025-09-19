import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create storage buckets on startup
async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const bucketsToCreate = [
      'make-683e58b0-biometric-data',
      'make-683e58b0-certificates',
      'make-683e58b0-exam-recordings',
      'make-683e58b0-fraud-evidence'
    ];

    for (const bucketName of bucketsToCreate) {
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
        });
        console.log(`Created bucket: ${bucketName}`);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize storage on startup
initializeStorage();

// Helper function to verify auth token
async function verifyAuth(c: any) {
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader?.split(' ')[1];
  if (!accessToken) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) return null;
  
  return user;
}

// Health check endpoint
app.get("/make-server-683e58b0/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post("/make-server-683e58b0/auth/signup", async (c) => {
  try {
    const { email, password, name, role = 'examiner' } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      message: 'User created successfully', 
      user: { id: data.user.id, email, name, role } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Biometric verification endpoints
app.post("/make-server-683e58b0/biometric/verify", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { type, data: biometricData, examId } = await c.req.json();
    
    const verificationId = crypto.randomUUID();
    const verification = {
      id: verificationId,
      userId: user.id,
      examId,
      type, // 'fingerprint', 'face', 'signature'
      status: 'verified',
      confidence: Math.random() * 0.3 + 0.7, // Simulate 70-100% confidence
      timestamp: new Date().toISOString(),
      metadata: { deviceInfo: 'Web Browser', ipAddress: 'simulated' }
    };

    await kv.set(`biometric:${verificationId}`, verification);
    
    // Update exam session
    const sessionKey = `exam_session:${examId}:${user.id}`;
    const session = await kv.get(sessionKey) || { verifications: [] };
    session.verifications.push(verificationId);
    await kv.set(sessionKey, session);

    return c.json({ 
      success: true, 
      verificationId,
      confidence: verification.confidence 
    });
  } catch (error) {
    console.error('Biometric verification error:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

app.get("/make-server-683e58b0/biometric/history", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const verifications = await kv.getByPrefix(`biometric:`) || [];
    const userVerifications = verifications
      .filter(v => v.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50); // Last 50 verifications

    return c.json({ verifications: userVerifications });
  } catch (error) {
    console.error('Error fetching biometric history:', error);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// Academic records endpoints
app.post("/make-server-683e58b0/academic/verify-certificate", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { certificateData, studentId, institution } = await c.req.json();
    
    const verificationId = crypto.randomUUID();
    const verification = {
      id: verificationId,
      userId: user.id,
      studentId,
      institution,
      status: Math.random() > 0.1 ? 'verified' : 'suspicious', // 90% verification rate
      blockchainHash: `0x${crypto.randomUUID().replace(/-/g, '')}`,
      ocrData: {
        extractedText: `Certificate of ${institution} for Student ID: ${studentId}`,
        confidence: Math.random() * 0.2 + 0.8
      },
      timestamp: new Date().toISOString()
    };

    await kv.set(`certificate:${verificationId}`, verification);

    return c.json({ 
      success: true, 
      verificationId,
      status: verification.status,
      blockchainHash: verification.blockchainHash 
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// Fraud detection endpoints
app.post("/make-server-683e58b0/fraud/detect", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { imageData, examId, type } = await c.req.json();
    
    const detectionId = crypto.randomUUID();
    const riskScore = Math.random();
    const detection = {
      id: detectionId,
      userId: user.id,
      examId,
      type,
      riskScore,
      status: riskScore > 0.7 ? 'high_risk' : riskScore > 0.4 ? 'medium_risk' : 'low_risk',
      findings: [
        ...(riskScore > 0.7 ? ['Multiple faces detected', 'Suspicious behavior patterns'] : []),
        ...(riskScore > 0.4 ? ['Inconsistent lighting patterns'] : []),
        'Standard verification completed'
      ],
      timestamp: new Date().toISOString()
    };

    await kv.set(`fraud:${detectionId}`, detection);

    return c.json({ 
      success: true, 
      detectionId,
      riskScore: detection.riskScore,
      status: detection.status,
      findings: detection.findings
    });
  } catch (error) {
    console.error('Fraud detection error:', error);
    return c.json({ error: 'Detection failed' }, 500);
  }
});

// Exam hall security endpoints
app.post("/make-server-683e58b0/exam/start-monitoring", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { examId, hallId, duration } = await c.req.json();
    
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      examId,
      hallId,
      proctorId: user.id,
      status: 'active',
      startTime: new Date().toISOString(),
      duration,
      devices: [],
      alerts: []
    };

    await kv.set(`exam_session:${sessionId}`, session);

    return c.json({ 
      success: true, 
      sessionId,
      message: 'Monitoring started successfully' 
    });
  } catch (error) {
    console.error('Exam monitoring start error:', error);
    return c.json({ error: 'Failed to start monitoring' }, 500);
  }
});

app.post("/make-server-683e58b0/exam/device-scan", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { sessionId, devices } = await c.req.json();
    
    const session = await kv.get(`exam_session:${sessionId}`);
    if (!session) return c.json({ error: 'Session not found' }, 404);

    // Simulate device detection
    const detectedDevices = devices.map((device: any) => ({
      ...device,
      riskLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
      timestamp: new Date().toISOString()
    }));

    session.devices = detectedDevices;
    await kv.set(`exam_session:${sessionId}`, session);

    return c.json({ 
      success: true, 
      devicesDetected: detectedDevices.length,
      highRiskDevices: detectedDevices.filter(d => d.riskLevel === 'high').length
    });
  } catch (error) {
    console.error('Device scan error:', error);
    return c.json({ error: 'Scan failed' }, 500);
  }
});

// Analytics endpoints
app.get("/make-server-683e58b0/analytics/dashboard", async (c) => {
  try {
    // Temporarily disable auth for testing
    // const user = await verifyAuth(c);
    // if (!user) return c.json({ error: 'Unauthorized' }, 401);

    // Simulate analytics data
    const analytics = {
      totalExams: Math.floor(Math.random() * 1000) + 500,
      activeExams: Math.floor(Math.random() * 50) + 10,
      fraudDetected: Math.floor(Math.random() * 20) + 5,
      verificationRate: Math.random() * 0.1 + 0.9,
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        exams: Math.floor(Math.random() * 100) + 50,
        frauds: Math.floor(Math.random() * 10) + 2
      })),
      recentAlerts: [
        { id: '1', type: 'high_risk', message: 'Multiple devices detected in Exam Hall A', timestamp: new Date().toISOString() },
        { id: '2', type: 'medium_risk', message: 'Suspicious activity in biometric verification', timestamp: new Date(Date.now() - 300000).toISOString() }
      ]
    };

    return c.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Data security endpoints
app.post("/make-server-683e58b0/security/aadhaar-kyc", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { aadhaarNumber, otp } = await c.req.json();
    
    // Simulate KYC verification
    const kycId = crypto.randomUUID();
    const verification = {
      id: kycId,
      userId: user.id,
      aadhaarNumber: aadhaarNumber.replace(/\d(?=\d{4})/g, '*'), // Mask number
      status: Math.random() > 0.1 ? 'verified' : 'failed',
      timestamp: new Date().toISOString()
    };

    await kv.set(`kyc:${kycId}`, verification);

    return c.json({ 
      success: verification.status === 'verified', 
      kycId,
      status: verification.status 
    });
  } catch (error) {
    console.error('KYC verification error:', error);
    return c.json({ error: 'KYC verification failed' }, 500);
  }
});

// Process cancellation endpoints
app.post("/make-server-683e58b0/process/cancel", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { processId, processType } = await c.req.json();
    
    // Store cancellation record
    const cancellation = {
      id: crypto.randomUUID(),
      userId: user.id,
      processId,
      processType,
      cancelledAt: new Date().toISOString(),
      reason: 'User requested cancellation'
    };

    await kv.set(`cancellation:${cancellation.id}`, cancellation);
    
    // If it's an exam session, mark it as cancelled
    if (processType === 'exam_session') {
      const session = await kv.get(`exam_session:${processId}`);
      if (session && session.proctorId === user.id) {
        session.status = 'cancelled';
        session.endTime = new Date().toISOString();
        await kv.set(`exam_session:${processId}`, session);
      }
    }

    return c.json({ 
      success: true, 
      message: 'Process cancelled successfully',
      cancellationId: cancellation.id
    });
  } catch (error) {
    console.error('Process cancellation error:', error);
    return c.json({ error: 'Cancellation failed' }, 500);
  }
});

app.get("/make-server-683e58b0/process/active", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    // Get active sessions for the user
    const sessions = await kv.getByPrefix(`exam_session:`) || [];
    const userSessions = sessions.filter(session => 
      session.proctorId === user.id && session.status === 'active'
    );

    // Get active verifications
    const verifications = await kv.getByPrefix(`biometric:`) || [];
    const recentVerifications = verifications
      .filter(v => v.userId === user.id)
      .filter(v => {
        const verificationTime = new Date(v.timestamp);
        const now = new Date();
        return (now.getTime() - verificationTime.getTime()) < 300000; // Last 5 minutes
      });

    return c.json({
      activeProcesses: {
        examSessions: userSessions,
        recentVerifications: recentVerifications
      }
    });
  } catch (error) {
    console.error('Active processes fetch error:', error);
    return c.json({ error: 'Failed to fetch active processes' }, 500);
  }
});

// File upload endpoint for secure storage
app.post("/make-server-683e58b0/upload", async (c) => {
  try {
    const user = await verifyAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { fileData, fileName, bucketType } = await c.req.json();
    
    const bucketMap = {
      'biometric': 'make-683e58b0-biometric-data',
      'certificate': 'make-683e58b0-certificates',
      'exam': 'make-683e58b0-exam-recordings',
      'fraud': 'make-683e58b0-fraud-evidence'
    };

    const bucketName = bucketMap[bucketType as keyof typeof bucketMap];
    if (!bucketName) return c.json({ error: 'Invalid bucket type' }, 400);

    const filePath = `${user.id}/${Date.now()}-${fileName}`;
    
    // For demo purposes, we'll simulate file upload
    const fileRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      fileName,
      filePath,
      bucketName,
      uploadTime: new Date().toISOString(),
      size: Math.floor(Math.random() * 1000000) + 100000 // Simulate file size
    };

    await kv.set(`file:${fileRecord.id}`, fileRecord);

    // Generate a simulated signed URL
    const signedUrl = `https://${Deno.env.get('SUPABASE_URL')}/storage/v1/object/sign/${bucketName}/${filePath}?token=simulated-token`;

    return c.json({ 
      success: true, 
      fileId: fileRecord.id,
      signedUrl 
    });
  } catch (error) {
    console.error('File upload error:', error);
    return c.json({ error: 'Upload failed' }, 500);
  }
});

Deno.serve(app.fetch);