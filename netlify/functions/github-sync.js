// Netlify Function to sync editor changes to GitHub
// This function updates the index.html file in the repository with changes from the editor

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { html, css, js, message = 'Update from visual editor' } = JSON.parse(event.body);
    
    // Get environment variables
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'NCM-Agency';
    const GITHUB_REPO = process.env.GITHUB_REPO || 'caster-game';
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'master';
    
    if (!GITHUB_TOKEN) {
      console.error('GitHub token not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GitHub integration not configured' })
      };
    }

    // GitHub API base URL
    const githubApi = 'https://api.github.com';
    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    // Step 1: Get current file content and SHA
    const fileUrl = `${githubApi}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/Website/index.html?ref=${GITHUB_BRANCH}`;
    
    const currentFileResponse = await fetch(fileUrl, { headers });
    
    if (!currentFileResponse.ok) {
      console.error('Failed to get current file:', await currentFileResponse.text());
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to get current file from GitHub' })
      };
    }
    
    const currentFile = await currentFileResponse.json();
    const currentSha = currentFile.sha;

    // Step 2: Prepare the updated HTML content
    // We need to properly merge the HTML with inline styles and scripts if provided
    let updatedHtml = html;
    
    // If CSS is provided separately, inject it into the HTML
    if (css && css.trim()) {
      // Check if there's already a style tag
      if (updatedHtml.includes('</head>')) {
        // Add the CSS before the closing head tag
        const styleTag = `\n<style>\n${css}\n</style>\n`;
        updatedHtml = updatedHtml.replace('</head>', `${styleTag}</head>`);
      }
    }
    
    // If JS is provided separately, inject it into the HTML
    if (js && js.trim()) {
      // Check if there's already a script tag
      if (updatedHtml.includes('</body>')) {
        // Add the JS before the closing body tag
        const scriptTag = `\n<script>\n${js}\n</script>\n`;
        updatedHtml = updatedHtml.replace('</body>', `${scriptTag}</body>`);
      }
    }

    // Step 3: Encode the content to base64
    const contentBase64 = Buffer.from(updatedHtml).toString('base64');

    // Step 4: Update the file on GitHub
    const updateUrl = `${githubApi}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/Website/index.html`;
    
    const updatePayload = {
      message: `${message} (via GrapesJS editor)`,
      content: contentBase64,
      sha: currentSha,
      branch: GITHUB_BRANCH
    };

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatePayload)
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Failed to update file:', errorText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update file on GitHub', details: errorText })
      };
    }

    const result = await updateResponse.json();

    // Return success with commit details
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        message: 'File updated successfully',
        commit: {
          sha: result.commit.sha,
          url: result.commit.html_url,
          message: result.commit.message
        }
      })
    };

  } catch (error) {
    console.error('GitHub sync error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      })
    };
  }
};