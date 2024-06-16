# Use the dockurr/windows image as the base image
FROM dockurr/windows:latest

# Set the working directory inside the container
WORKDIR C:/app

# Install Node.js
RUN powershell -Command `
    # $ErrorActionPreference = 'Stop'; `
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; `
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi" -OutFile "nodejs.msi"; `
    Start-Process msiexec.exe -ArgumentList '/i', 'nodejs.msi', '/quiet', '/norestart' -NoNewWindow -Wait; `
    Remove-Item -Force nodejs.msi

# Verify Node.js installation
RUN node -v
RUN npm -v

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 10000

# Command to run the application
CMD ["node", "app.js"]
