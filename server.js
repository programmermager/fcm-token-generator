const express = require('express');
const { JWT } = require('google-auth-library');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// API endpoint to generate FCM token
app.post('/generate-token', async (req, res) => {
  console.log('Received request to generate token');
  try {
    // Extract service account details from request body
    const { serviceAccount, projectId } = req.body;
    
    console.log('Request body received:', { 
      projectId, 
      serviceAccountReceived: !!serviceAccount 
    });
    
    if (!serviceAccount || !projectId) {
      console.log('Missing required parameters');
      return res.status(400).json({ 
        error: 'Missing required parameters. Please provide serviceAccount and projectId.' 
      });
    }

    // Validate service account has required fields
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      console.log('Invalid service account format');
      return res.status(400).json({ 
        error: 'Invalid service account. Must include client_email and private_key.' 
      });
    }

    console.log('Creating JWT client...');
    // Create a JWT client with the service account credentials
    const client = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    console.log('Authorizing JWT client...');
    // Get the access token
    const tokens = await client.authorize();
    
    console.log('Token generated successfully');
    // Return the token and project details
    res.json({
      success: true,
      projectId,
      access_token: tokens.access_token,
      token_type: tokens.token_type,
      expires_in: tokens.expires_in
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ 
      error: 'Failed to generate token', 
      message: error.message 
    });
  }
});

// Simple health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check request received');
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`FCM Token Generator API running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`Generate token endpoint: http://localhost:${PORT}/generate-token`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});