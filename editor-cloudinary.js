// Cloudinary Integration for GrapesJS - No Dependencies!
// This file handles all Cloudinary operations for the visual editor

class CloudinaryManager {
  constructor(editor) {
    this.editor = editor;
    this.cloudName = 'dztstxsnd';
    this.uploadPreset = 'caster-unsigned';
    this.setupAssetManager();
  }

  // Initialize the asset manager
  setupAssetManager() {
    const editor = this.editor;
    const assetManager = editor.AssetManager;
    
    // Simple approach - just load existing assets
    console.log('CloudinaryManager initialized');
    
    // Skip the custom upload handler for now to avoid errors
    // We'll add it back once the editor loads properly
    
    // Don't load media library on init as it's causing 500 errors
    // this.loadMediaLibrary();
  }

  // Optimize image before upload
  async optimizeImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Create canvas for optimization
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate optimal dimensions
          const MAX_WIDTH = 2000;
          const MAX_HEIGHT = 2000;
          let width = img.width;
          let height = img.height;
          
          // Resize if needed
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }
          
          // Draw optimized image
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64
          const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.9);
          resolve({
            data: dataUrl,
            width: width,
            height: height
          });
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Upload to Cloudinary via Netlify Function
  async uploadToCloudinary(imageData, filename) {
    try {
      // Detect folder based on filename
      const folder = this.detectFolder(filename);
      
      // Call our Netlify function
      const response = await fetch('/.netlify/functions/cloudinary-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageData.data,
          filename: filename,
          folder: folder
        })
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      // Return asset object for GrapesJS
      return {
        src: result.url,
        type: 'image',
        name: filename,
        width: result.width,
        height: result.height,
        thumbnail: result.thumbnail
      };
      
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  // Load existing media library
  async loadMediaLibrary() {
    try {
      this.showNotification('Loading media library...', 'info');
      
      const response = await fetch('/.netlify/functions/cloudinary-list');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.assets && data.assets.length > 0) {
          // Add all existing assets to asset manager
          const formattedAssets = data.assets.map(asset => ({
            src: asset.src,
            type: 'image',
            name: asset.name,
            width: asset.width,
            height: asset.height,
            thumbnail: asset.thumbnail
          }));
          
          this.editor.AssetManager.add(formattedAssets);
          this.showNotification(`Loaded ${data.assets.length} images`, 'success');
        } else {
          this.showNotification('Media library is empty', 'info');
        }
      }
    } catch (error) {
      console.error('Failed to load media library:', error);
      this.showNotification('Could not load media library', 'warning');
    }
  }

  // Detect folder based on filename
  detectFolder(filename) {
    const name = filename.toLowerCase();
    
    if (name.includes('hero')) return 'heroes';
    if (name.includes('card')) return 'characters';
    if (name.includes('bg') || name.includes('background')) return 'backgrounds';
    if (name.includes('team') || name.includes('img_')) return 'team';
    if (name.includes('banner')) return 'banners';
    if (name.includes('logo')) return 'logos';
    
    return 'misc';
  }

  // Show notification to user
  showNotification(message, type = 'info') {
    // Check if notification element exists
    let notif = document.getElementById('cloudinary-notification');
    
    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'cloudinary-notification';
      notif.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        font-weight: 500;
        z-index: 10000;
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(notif);
    }
    
    // Set styles based on type
    const styles = {
      info: 'background: #3498db; color: white;',
      success: 'background: #2ecc71; color: white;',
      warning: 'background: #f39c12; color: white;',
      error: 'background: #e74c3c; color: white;'
    };
    
    notif.style.cssText += styles[type] || styles.info;
    notif.textContent = message;
    notif.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notif.style.display = 'none';
    }, 3000);
  }

  // Direct upload to Cloudinary (client-side for unsigned preset)
  async directUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', `caster-website/${this.detectFolder(file.name)}`);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!response.ok) {
        throw new Error('Direct upload failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Direct upload error:', error);
      // Fallback to Netlify function
      return null;
    }
  }
}

// Export for use in editor.html
window.CloudinaryManager = CloudinaryManager;