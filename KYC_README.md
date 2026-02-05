# Sumsub KYC Integration

This project integrates Sumsub's KYC verification process for user identity verification.

## Setup

1. Get your Sumsub API credentials from the Sumsub dashboard:
   - `SUMSUB_APP_TOKEN`
   - `SUMSUB_SECRET_KEY`
   - `SUMSUB_WEBHOOK_SECRET`

2. Add these to your `.env` file:
   ```
   SUMSUB_APP_TOKEN=your_app_token
   SUMSUB_SECRET_KEY=your_secret_key
   SUMSUB_WEBHOOK_SECRET=your_webhook_secret
   ```

## API Endpoints

### Profile Creation with KYC
- **POST** `/profile`
- Automatically initiates KYC after profile creation
- Request body: `{ fullName, address, images, phone, country }`

### Manual KYC Initiation
- **POST** `/kyc/initiate`
- Initiates KYC for an existing profile
- Requires authentication

### Get KYC Status
- **GET** `/kyc/status`
- Returns current KYC status
- Requires authentication

### Webhook
- **POST** `/kyc/webhook`
- Handles Sumsub webhook notifications
- Updates KYC status based on verification results

## Flow

1. User signs up and logs in
2. User creates profile → KYC automatically initiated
3. User redirected to Sumsub SDK URL for verification
4. Sumsub processes documents and sends webhook
5. System updates KYC status

## Models

- **Profile**: Contains user profile info + KYC reference
- **KYC**: Detailed KYC tracking with documents and status

## Status Values

- `PENDING`: KYC initiated but not completed
- `SUBMITTED`: User submitted documents
- `APPROVED`: KYC passed
- `REJECTED`: KYC failed