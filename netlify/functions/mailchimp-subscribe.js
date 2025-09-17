const https = require('https');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the request body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  // Extract form data
  const {
    firstName,
    lastName,
    email,
    recaptchaToken,
    honeypot
  } = data;

  // Check honeypot field (should be empty)
  if (honeypot) {
    // Bot detected - return success to fool bots
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Thank you for subscribing!' })
    };
  }

  // Validate required fields
  if (!firstName || !lastName || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }

  // Validate name patterns (block random strings)
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  const hasVowels = /[aeiouAEIOU]/;
  const notRandomString = /^(?!.*([a-z])\1{3,})(?!.*[bcdfghjklmnpqrstvwxyz]{5,})/i;

  if (!nameRegex.test(firstName) || !hasVowels.test(firstName) || !notRandomString.test(firstName)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please enter a valid first name' })
    };
  }

  if (!nameRegex.test(lastName) || !hasVowels.test(lastName) || !notRandomString.test(lastName)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please enter a valid last name' })
    };
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please enter a valid email address' })
    };
  }

  // Verify reCAPTCHA token with Google
  if (recaptchaToken) {
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    try {
      const recaptchaResponse = await verifyRecaptcha(recaptchaToken, recaptchaSecret);

      if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'reCAPTCHA verification failed' })
        };
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'reCAPTCHA verification error' })
      };
    }
  }

  // Determine the correct redirect URL based on environment
  const siteUrl = process.env.URL || process.env.DEPLOY_URL || 'https://notcorruptgames.com';
  const redirectUrl = `${siteUrl}/thank-you.html`;

  // Prepare Mailchimp data
  const mailchimpData = new URLSearchParams({
    'u': '227c9d3aa3744fbf2443ef518',
    'id': 'b8c91d7fd8',
    'f_id': '00fbc2e1f0',
    'FNAME': firstName,
    'LNAME': lastName,
    'EMAIL': email,
    'tags': '715',
    'REDIRECT': redirectUrl
  });

  // Submit to Mailchimp
  return new Promise((resolve) => {
    const options = {
      hostname: 'media.us15.list-manage.com',
      path: '/subscribe/post',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(mailchimpData.toString())
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        // Check if subscription was successful
        if (res.statusCode === 200 || res.statusCode === 302) {
          resolve({
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              success: true,
              message: 'Successfully subscribed to VIP list!'
            })
          });
        } else {
          resolve({
            statusCode: res.statusCode,
            body: JSON.stringify({
              error: 'Subscription failed. Please try again.'
            })
          });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Mailchimp request error:', error);
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: 'Server error. Please try again.' })
      });
    });

    req.write(mailchimpData.toString());
    req.end();
  });
};

// Helper function to verify reCAPTCHA
function verifyRecaptcha(token, secret) {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams({
      secret: secret,
      response: token
    });

    const options = {
      hostname: 'www.google.com',
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data.toString())
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data.toString());
    req.end();
  });
}