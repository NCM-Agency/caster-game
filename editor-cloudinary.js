// Cloudinary Integration for GrapesJS - Direct Upload
// This file handles all Cloudinary operations for the visual editor

class CloudinaryManager {
  constructor(editor) {
    this.editor = editor;
    this.cloudName = 'dztstxsnd';
    this.uploadPreset = 'caster-unsigned';
    this.setupAssetManager();
    this.setupDragAndDrop();
  }

  // Initialize the asset manager
  setupAssetManager() {
    const editor = this.editor;
    const assetManager = editor.AssetManager;
    
    console.log('CloudinaryManager initialized');
    
    // Set up custom upload when asset manager opens
    editor.on('run:open-assets', () => {
      setTimeout(() => {
        // Find or create upload button
        const modal = editor.Modal;
        const container = modal.getContentEl();
        let uploadZone = container.querySelector('.gjs-am-assets-header');
        
        if (!uploadZone) {
          uploadZone = container.querySelector('.gjs-am-assets');
        }
        
        if (uploadZone && !uploadZone.querySelector('.cloudinary-upload-zone')) {
          // Create a better upload interface
          const uploadDiv = document.createElement('div');
          uploadDiv.className = 'cloudinary-upload-zone';
          uploadDiv.style.cssText = `
            border: 2px dashed #d4af37;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 10px;
            cursor: pointer;
            background: rgba(212, 175, 55, 0.1);
            transition: all 0.3s ease;
          `;
          uploadDiv.innerHTML = `
            <div style="color: #d4af37; font-weight: bold; margin-bottom: 10px;">
              📤 Click or Drag Images Here to Upload to Cloudinary
            </div>
            <div style="color: #8b4a9c; font-size: 12px;">
              Images will be optimized and hosted permanently
            </div>
            <input type="file" multiple accept="image/*" style="display: none;" />
          `;
          
          const fileInput = uploadDiv.querySelector('input');
          
          // Click to upload
          uploadDiv.addEventListener('click', () => fileInput.click());
          
          // Drag and drop
          uploadDiv.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadDiv.style.background = 'rgba(212, 175, 55, 0.3)';
          });
          
          uploadDiv.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadDiv.style.background = 'rgba(212, 175, 55, 0.1)';
          });
          
          uploadDiv.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadDiv.style.background = 'rgba(212, 175, 55, 0.1)';
            const files = e.dataTransfer.files;
            await this.handleFileUpload(files);
          });
          
          // File input change
          fileInput.addEventListener('change', async (e) => {
            await this.handleFileUpload(e.target.files);
            e.target.value = '';
          });
          
          // Insert at the top
          uploadZone.insertBefore(uploadDiv, uploadZone.firstChild);
        }
      }, 200);
    });
  }
  
  // Setup drag and drop for the entire canvas
  setupDragAndDrop() {
    const editor = this.editor;
    
    // Allow dragging images directly onto the canvas
    editor.on('load', () => {
      const canvas = editor.Canvas.getBody();
      
      canvas.addEventListener('dragover', (e) => {
        // Check if dragging files
        if (e.dataTransfer.types.includes('Files')) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
      });
      
      canvas.addEventListener('drop', async (e) => {
        // Check if dropping files
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          
          const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
          );
          
          if (files.length > 0) {
            // Upload to Cloudinary
            const uploadedImages = await this.handleFileUpload(files);
            
            // Add images to the drop location
            if (uploadedImages && uploadedImages.length > 0) {
              const component = editor.getSelected();
              
              uploadedImages.forEach(img => {
                // If a component is selected, try to set its src
                if (component && component.get('type') === 'image') {
                  component.set('src', img.src);
                } else {
                  // Otherwise add as new image component at drop location
                  editor.addComponents(`<img src="${img.src}" style="max-width: 100%;" />`);
                }
              });
              
              this.showNotification('✓ Images added to canvas!', 'success');
            }
          }
        }
      });
    });
  }
  
  // Handle file uploads
  async handleFileUpload(files) {
    if (!files || !files.length) return [];
    
    const assetManager = this.editor.AssetManager;
    const uploadedImages = [];
    
    for (const file of files) {
      try {
        this.showNotification(`Uploading ${file.name} to Cloudinary...`, 'info');
        
        // Direct upload to Cloudinary using unsigned preset
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);
        formData.append('folder', 'caster-website');
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          
          // Create optimized URL with Cloudinary transformations
          const optimizedUrl = data.secure_url.replace(
            '/upload/',
            '/upload/q_auto,f_auto,w_2000/'
          );
          
          const imageAsset = {
            src: optimizedUrl,
            name: file.name,
            type: 'image'
          };
          
          // Add to asset manager
          assetManager.add(imageAsset);
          uploadedImages.push(imageAsset);
          
          this.showNotification(`✓ ${file.name} uploaded successfully!`, 'success');
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        
        // Fallback to base64 if Cloudinary fails
        this.showNotification(`⚠️ Cloudinary failed, using local storage for ${file.name}`, 'warning');
        
        const base64 = await this.fileToBase64(file);
        const imageAsset = {
          src: base64,
          name: file.name,
          type: 'image'
        };
        
        assetManager.add(imageAsset);
        uploadedImages.push(imageAsset);
      }
    }
    
    return uploadedImages;
  }
  
  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
}

// Export for use in editor.html
window.CloudinaryManager = CloudinaryManager;