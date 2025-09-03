// Cloudinary Upload Function - No Dependencies Required!
// This handles secure image uploads without exposing API secrets

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers for editor access
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { image, filename, folder } = JSON.parse(event.body);

    // Validate input
    if (!image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image data provided' })
      };
    }

    // Get Cloudinary config from environment variables
    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dztstxsnd';
    const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'caster-unsigned';
    
    // Build upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    // Prepare form data for Cloudinary
    const formData = new URLSearchParams();
    formData.append('file', image);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    // Optional parameters
    if (folder) {
      formData.append('folder', `caster-website/${folder}`);
    } else {
      formData.append('folder', 'caster-website');
    }
    
    if (filename) {
      // Remove extension and sanitize
      const publicId = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
      formData.append('public_id', publicId);
    }

    // Add transformations for optimization
    formData.append('transformation', JSON.stringify([
      { quality: 'auto:best', fetch_format: 'auto' }
    ]));

    // Upload to Cloudinary
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Upload failed');
    }

    // Return optimized response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        thumbnail: result.secure_url.replace('/upload/', '/upload/w_150,h_150,c_thumb/')
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Upload failed', 
        details: error.message 
      })
    };
  }
};