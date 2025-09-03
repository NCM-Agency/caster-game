# GitHub Token Setup for Netlify

## Prerequisites
- GitHub account with access to NCM-Agency/caster-game repository
- Admin access to Netlify site

## Step 1: Generate GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name: "Caster GrapesJS Editor"
4. Set expiration (recommend 90 days for security, or custom)
5. Select the following scopes:
   - **repo** (Full control of private repositories)
     - ✅ repo:status
     - ✅ repo_deployment
     - ✅ public_repo
     - ✅ repo:invite
     - ✅ security_events
   
6. Click "Generate token"
7. **IMPORTANT**: Copy the token immediately (you won't see it again!)

## Step 2: Add Token to Netlify Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to: Site Configuration → Environment Variables
3. Click "Add a variable" 
4. Add the following:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: [paste your token from Step 1]
   - **Scopes**: Keep default (all deploy contexts)

5. Also verify these are set (should already be from Cloudinary setup):
   - `GITHUB_OWNER` = NCM-Agency (optional, defaults to this)
   - `GITHUB_REPO` = caster-game (optional, defaults to this)
   - `GITHUB_BRANCH` = master (optional, defaults to this)

6. Click "Save"

## Step 3: Test the Integration

1. Visit your deployed site: https://[your-site].netlify.app/editor.html
2. Make a small change in the visual editor
3. Click "💾 Save to GitHub"
4. Check for success notification
5. Verify commit appears in GitHub: https://github.com/NCM-Agency/caster-game/commits/master

## Security Notes

- **Token Rotation**: Set a reminder to rotate the token before expiration
- **Minimal Scope**: We only need repo access, don't grant unnecessary permissions
- **Never Commit**: Never put the token in code or commit it to the repository
- **Revoke if Compromised**: If token is exposed, revoke it immediately in GitHub settings

## Troubleshooting

### "GitHub integration not configured" error
- Token is not set in Netlify environment variables
- Redeploy the site after adding the token

### "Failed to update file on GitHub" error
- Token doesn't have proper permissions (needs full repo scope)
- Token has expired
- Repository name or owner is incorrect

### "Failed to get current file from GitHub" error
- The file path is incorrect (should be Website/index.html)
- Branch name is wrong (should be master, not main)
- Token doesn't have read permissions

## Alternative: GitHub App (More Secure)

For production use, consider creating a GitHub App instead of a personal token:
1. Creates more granular permissions
2. Doesn't expire
3. Better audit trail
4. Can be restricted to specific repositories

See: https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app