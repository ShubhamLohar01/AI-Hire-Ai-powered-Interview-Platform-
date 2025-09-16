// Simple script to check Vapi usage
// Run with: node check-vapi-usage.js

const fetch = require('node-fetch');

async function checkVapiUsage() {
  try {
    const response = await fetch('https://api.vapi.ai/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Vapi Account Info:', data);
    
    // Look for usage information in the response
    if (data.usage) {
      console.log('Current Usage:', data.usage);
    }
    
    if (data.limits) {
      console.log('Plan Limits:', data.limits);
    }

  } catch (error) {
    console.error('Error checking Vapi usage:', error);
  }
}

checkVapiUsage();

