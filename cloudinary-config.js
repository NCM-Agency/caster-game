// CLOUDINARY CONFIGURATION
// ⚠️ SECURITY WARNING: This file contains sensitive API credentials
// ⚠️ NEVER commit this file to GitHub - it's in .gitignore
// ⚠️ This is for local development ONLY

// Instructions:
// 1. Fill in your Cloudinary credentials below
// 2. Save this file
// 3. The credentials will be used by the editor
// 4. For production, add these to Netlify Environment Variables

const CLOUDINARY_CONFIG = {
  // From your Cloudinary Dashboard
  cloud_name: 'dztstxsnd',    // e.g., 'dxxxxx'
  api_key: '821548158487669',          // e.g., '123456789012345'
  api_secret: 'Vhl2lP_RkeoccCL40TV-PsMJlqM',    // e.g., 'abcdefghijk...' (KEEP SECRET!)
  
  // Upload preset (create this in Cloudinary Dashboard > Settings > Upload)
  upload_preset: 'caster-unsigned',  // You'll create this in Cloudinary
  
  // Optional: Folder structure
  folder: 'caster-website',
  
  // Security settings
  secure: true,  // Always use HTTPS
  
  // Optimization settings
  default_transformations: {
    quality: 'auto:best',
    fetch_format: 'auto',  // Serves WebP/AVIF when supported
    dpr: 'auto'
  }
};

// Export for use in editor
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CLOUDINARY_CONFIG;
}