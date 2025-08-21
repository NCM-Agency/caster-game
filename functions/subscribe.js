// Netlify Function to handle Mailchimp subscriptions
exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Prepare Mailchimp submission
    const mailchimpUrl = 'https://media.us15.list-manage.com/subscribe/post';
    const params = new URLSearchParams({
      u: '227c9d3aa3744fbf2443ef518',
      id: 'b8c91d7fd8',
      FNAME: data.FNAME,
      LNAME: data.LNAME,
      EMAIL: data.EMAIL,
      tags: '715',
      b_227c9d3aa3744fbf2443ef518_b8c91d7fd8: '' // honeypot field
    });

    // Submit to Mailchimp
    const response = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    // Return success regardless (Mailchimp doesn't return useful status)
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Subscribed successfully' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};