import { supabase } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-683e58b0`;

interface ApiOptions {
  requireAuth?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { requireAuth = true, method = 'GET', body } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
}

// Specific API functions
export const biometricAPI = {
  verify: async (type: string, data: any, examId: string) =>
    apiCall('/biometric/verify', {
      method: 'POST',
      body: { type, data, examId }
    }),
  
  getHistory: async () =>
    apiCall('/biometric/history')
};

export const academicAPI = {
  verifyCertificate: async (certificateData: any, studentId: string, institution: string) =>
    apiCall('/academic/verify-certificate', {
      method: 'POST',
      body: { certificateData, studentId, institution }
    })
};

export const fraudAPI = {
  detect: async (imageData: any, examId: string, type: string) =>
    apiCall('/fraud/detect', {
      method: 'POST',
      body: { imageData, examId, type }
    })
};

export const examAPI = {
  startMonitoring: async (examId: string, hallId: string, duration: number) =>
    apiCall('/exam/start-monitoring', {
      method: 'POST',
      body: { examId, hallId, duration }
    }),
  
  deviceScan: async (sessionId: string, devices: any[]) =>
    apiCall('/exam/device-scan', {
      method: 'POST',
      body: { sessionId, devices }
    }),
  
  cancelProcess: async (processId: string, processType: string) =>
    apiCall('/process/cancel', {
      method: 'POST',
      body: { processId, processType }
    }),
  
  getActiveProcesses: async () =>
    apiCall('/process/active')
};

export const analyticsAPI = {
  getDashboard: async () =>
    apiCall('/analytics/dashboard', { requireAuth: false })
};

export const securityAPI = {
  aadhaarKYC: async (aadhaarNumber: string, otp: string) =>
    apiCall('/security/aadhaar-kyc', {
      method: 'POST',
      body: { aadhaarNumber, otp }
    }),
  
  uploadFile: async (fileData: any, fileName: string, bucketType: string) =>
    apiCall('/upload', {
      method: 'POST',
      body: { fileData, fileName, bucketType }
    })
};

export const healthCheck = async () =>
  apiCall('/health', { requireAuth: false });