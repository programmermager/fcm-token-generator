# FCM Token Generator API

A simple API service that generates Firebase Cloud Messaging (FCM) tokens using service account credentials provided in the request body.

## Features

- Generate FCM tokens on-demand without hardcoding service account credentials
- Pass service account JSON and project ID in the request body
- Secure token generation for Firebase Cloud Messaging

---

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# Start with auto-reload during development
npm run dev
```

---

## API Usage

### Generate FCM Token

**Endpoint:** `POST /generate-token`

**Request Body:**

- NOTE: you can get serviceAccount from firebase console -> project settings -> service accounts -> generate new private key

```json
{
  "projectId": "your-firebase-project-id",
  "serviceAccount": {
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "your-private-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxx%40your-project.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
}
```

**Response:**

```json
{
  "success": true,
  "projectId": "your-firebase-project-id",
  "access_token": "ya29.c.b0...",
  "token_type": "Bearer",
  "expires_in": 3599
}
```

After that, you can find out sample to send push notif using postman here https://www.postman.com/awesome-notifications/fcm-examples/request/sxxqqht/push-silent-data?tab=body

use the access_token to send push notif to specific device by adding this to header

```
Authorization: Bearer ya29.c.b0...
```

---

### Health Check

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "ok"
}
```

---

## Security Considerations

- This API should be deployed with proper authentication mechanisms
- Consider using HTTPS to encrypt data in transit
- Be careful with service account credentials as they provide access to your Firebase project

---

## License

ISC
