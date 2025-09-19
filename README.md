# ExeSecure AI - Educational Security System

A comprehensive academic integrity monitoring and management system built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview and real-time statistics
- **Biometric Verification**: Multi-layer identity verification (fingerprint, face recognition, signature)
- **Academic Records**: Certificate validation with OCR and blockchain verification
- **Fraud Detection**: AI-powered tampering detection
- **Exam Hall Security**: ESP32 Bluetooth scanning for mobile detection
- **Analytics**: Comprehensive reporting across institutions and fraud metrics
- **Data Security**: Aadhaar KYC and compliance management
- **AI Assistant**: Floating AI chatbot for support

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS v4
- Vite
- Lucide React (icons)
- Sonner (toast notifications)
- Recharts (charts)

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

This project is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. Deploy with the build command: `npm run build`

## Camera Functionality

The biometric verification system includes live camera capture features:
- Works in HTTPS environments or localhost
- Falls back to simulation mode if camera access is denied
- Supports fingerprint, face recognition, and signature capture

## Security Note

This is an educational demonstration system. For production use:
- Implement proper authentication and authorization
- Add backend API integration
- Ensure HTTPS deployment
- Follow data privacy regulations