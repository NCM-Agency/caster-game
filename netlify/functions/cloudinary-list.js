// Cloudinary List Media Function - No Dependencies!
// Lists all uploaded images from Cloudinary

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get config from environment
    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dztstxsnd';
    const API_KEY = process.env.CLOUDINARY_API_KEY || '821548158487669';
    const API_SECRET = process.env.CLOUDINARY_API_SECRET;

    if (!API_SECRET) {
      // For public listing, we can use the search API without authentication
      // This is less secure but works for listing public images
      const publicUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/caster-website.json`;
      
      try {
        const response = await fetch(publicUrl);
        if (response.ok) {
          const data = await response.json();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              assets: data.resources || []
            })
          };
        }
      } catch (e) {
        // Fallback to basic response if public list doesn't work
      }
    }

    // If we have API credentials, use authenticated API
    if (API_SECRET) {
      // Create auth string
      const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
      
      // Call Cloudinary Admin API
      const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
      
      const response = await fetch(apiUrl + '?type=upload&prefix=caster-website/&max_results=500', {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media library');
      }

      const data = await response.json();
      
      // Format the response
      const assets = (data.resources || []).map(asset => ({
        src: asset.secure_url,
        name: asset.public_id.split('/').pop(),
        width: asset.width,
        height: asset.height,
        format: asset.format,
        size: asset.bytes,
        created: asset.created_at,
        thumbnail: asset.secure_url.replace('/upload/', '/upload/w_150,h_150,c_thumb/')
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ assets })
      };
    }

    // Fallback: return empty list if no credentials
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        assets: [],
        message: 'Configure API_SECRET for full media library access'
      })
    };

  } catch (error) {
    console.error('List media error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to list media',
        details: error.message 
      })
    };
  }
};