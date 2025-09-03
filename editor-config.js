// GitHub Integration for GrapesJS Editor
// This file handles saving changes back to GitHub

const GITHUB_CONFIG = {
    owner: 'NCM-Agency',
    repo: 'caster-game',
    branch: 'master',
    token: '', // Add your GitHub personal access token here (with repo permissions)
};

// GitHub API Helper
class GitHubSaver {
    constructor(config) {
        this.config = config;
        this.apiBase = 'https://api.github.com';
    }

    async getFile(path) {
        const url = `${this.apiBase}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${this.config.token}`
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error fetching file:', error);
            return null;
        }
    }

    async saveFile(path, content, message) {
        const url = `${this.apiBase}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
        
        // Get current file to get the SHA
        const currentFile = await this.getFile(path);
        
        const body = {
            message: message || `Update ${path} via Visual Editor`,
            content: btoa(unescape(encodeURIComponent(content))), // Encode to base64
            branch: this.config.branch
        };
        
        if (currentFile && currentFile.sha) {
            body.sha = currentFile.sha; // Required for updating existing files
        }
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${this.config.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save file');
            }
        } catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
    }
}

// Initialize GitHub saver
const githubSaver = new GitHubSaver(GITHUB_CONFIG);

// Export function to be used in editor.html
async function saveToGitHubAPI(html, css) {
    if (!GITHUB_CONFIG.token) {
        throw new Error('GitHub token not configured. Please add your token to editor-config.js');
    }
    
    try {
        // Save HTML
        await githubSaver.saveFile('index.html', html, 'Update site design via Visual Editor');
        
        // Save CSS (if you want to save CSS separately)
        // await githubSaver.saveFile('styles.css', css, 'Update styles via Visual Editor');
        
        return true;
    } catch (error) {
        console.error('Failed to save to GitHub:', error);
        throw error;
    }
}

// Instructions for setting up GitHub token:
/*
To enable GitHub saving:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Caster Visual Editor"
4. Select scopes: 
   - repo (all)
5. Generate token and copy it
6. Paste the token in the 'token' field above

IMPORTANT: Never commit this file with your token! Add to .gitignore:
editor-config.js

For production, use environment variables or a secure backend service.
*/