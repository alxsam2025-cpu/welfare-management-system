# Install Prerequisites - Windows

You need to install Node.js and Git before you can deploy your welfare management system.

## Step 1: Install Node.js

### Method 1: Direct Download (Recommended)
1. Go to https://nodejs.org/
2. Download the **LTS version** (currently Node.js 20.x)
3. Run the downloaded installer (.msi file)
4. Follow the installation wizard with default settings
5. **Restart PowerShell** after installation

### Method 2: Using Windows Package Manager (if you have winget)
```powershell
winget install OpenJS.NodeJS
```

### Verify Node.js Installation
After installation and restarting PowerShell:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.9.0
10.1.0
```

## Step 2: Install Git for Windows

### Method 1: Direct Download
1. Go to https://git-scm.com/download/win
2. Download the latest version
3. Run the installer with default settings
4. **Restart PowerShell** after installation

### Method 2: Using Windows Package Manager
```powershell
winget install --id Git.Git -e --source winget
```

### Verify Git Installation
```powershell
git --version
```

You should see something like:
```
git version 2.42.0.windows.2
```

## Step 3: Test Everything Works

Run these commands in PowerShell:
```powershell
node --version
npm --version
git --version
```

All three should return version numbers without errors.

## Step 4: Now You Can Continue with Deployment

Once you have Node.js and Git installed, you can run:

```powershell
# Install project dependencies
npm install

# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit - Welfare Management System"
```

## Troubleshooting

### If 'npm' is still not recognized after installing Node.js:
1. Restart PowerShell completely (close and reopen)
2. Check if Node.js is in your PATH:
   ```powershell
   $env:PATH -split ';' | Select-String "nodejs"
   ```
3. If not found, Node.js might have installed to a different location

### If you get permission errors:
1. Run PowerShell as Administrator
2. Or use:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Alternative: Use Node.js Installer from Microsoft Store
1. Open Microsoft Store
2. Search for "Node.js"
3. Install the official Node.js package

## Next Steps After Installation

1. ✅ Install Node.js and Git (this guide)
2. 📦 Run `npm install` to install dependencies
3. 🌐 Set up GitHub repository
4. 🚀 Deploy to Vercel
5. 🗄️ Set up database
6. 👤 Create admin user

Follow the main deployment guide once these prerequisites are installed!
