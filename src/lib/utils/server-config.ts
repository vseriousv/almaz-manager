import { OutlineServer } from "@/types/server";
import { logger } from "./logger";

// Constant for key in localStorage
const LOCAL_STORAGE_KEY = 'almaz-servers';

// Get server configuration
export async function getServersConfig(): Promise<{ servers: OutlineServer[] }> {
  // Client side
  if (typeof window !== 'undefined') {
    const configStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (configStr) {
      try {
        return JSON.parse(configStr);
      } catch (e) {
        console.error('Error parsing server config from localStorage:', e);
        return { servers: [] };
      }
    }
    return { servers: [] };
  }
  
  // Server side
  try {
    // Dynamically import fs only on server
    const fs = await import('fs-extra');
    const path = await import('path');
    
    // For testing, use root directory instead of tmp subdirectory
    const CONFIG_FILE_PATH = path.join(process.cwd(), 'almaz-servers.json');
    
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const configStr = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      try {
        return JSON.parse(configStr);
      } catch (e) {
        console.error('Error parsing server config from file:', e);
        return { servers: [] };
      }
    }
    return { servers: [] };
  } catch (e) {
    console.error('Error reading server config file:', e);
    return { servers: [] };
  }
}

// Save server configuration
export async function saveServersConfig(config: { servers: OutlineServer[] }): Promise<void> {
  console.log("Starting to save server configuration");
  
  // Client side
  if (typeof window !== 'undefined') {
    console.log("Saving on client side");
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    console.log("Configuration saved to localStorage");
    
    // Force sending configuration to server
    console.log("Sending configuration to server...");
    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Configuration successfully sent to server:", data);
    } catch (e) {
      console.error('Error saving configuration to server:', e);
    }
    
    return;
  }
  
  // Server side
  try {
    console.log("Saving on server side");
    const fs = await import('fs-extra');
    const path = await import('path');
    
    // For testing, use root directory instead of tmp subdirectory
    const CONFIG_FILE_PATH = path.join(process.cwd(), 'almaz-servers.json');
    
    console.log("Path to configuration file:", CONFIG_FILE_PATH);
    console.log("Current directory:", process.cwd());
    
    // Make sure fs-extra is available
    console.log("fs-extra is available:", typeof fs.writeFileSync);
    
    await fs.writeJSON(CONFIG_FILE_PATH, config, { spaces: 2 });
    console.log("Configuration successfully saved to file");
  } catch (e) {
    console.error('Error saving configuration to file:', e);
  }
}

// Synchronize configuration between client and server
export async function syncServersConfig(): Promise<void> {
  if (typeof window === 'undefined') {
    return; // Don't execute on server
  }
  
  try {
    // Get server configuration
    const response = await fetch('/api/servers');
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data && data.servers) {
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Error syncing servers configuration:', e);
  }
}

// Add new server
export async function addServer(server: OutlineServer): Promise<void> {
  const config = await getServersConfig();
  
  // Add new server
  config.servers.push(server);
  
  // Save
  await saveServersConfig(config);
  
  // Force save on server via API
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
    } catch (e) {
      console.error('Error saving server to API:', e);
    }
  }
}

// Update server
export async function updateServer(serverId: string, updatedServer: OutlineServer): Promise<void> {
  const config = await getServersConfig();
  
  const index = config.servers.findIndex(s => s.id === serverId);
  if (index !== -1) {
    config.servers[index] = updatedServer;
    await saveServersConfig(config);
  }
}

// Delete server
export async function deleteServer(serverId: string): Promise<void> {
  const config = await getServersConfig();
  
  const index = config.servers.findIndex(s => s.id === serverId);
  if (index !== -1) {
    config.servers.splice(index, 1);
    await saveServersConfig(config);
  }
}

// Parse configuration from access.txt text file
// File format: apiUrl,certSha256
export async function parseAccessFile(fileContent: string): Promise<{ apiUrl: string, certSha256: string } | null> {
  const lines = fileContent.split('\n');
  for (const line of lines) {
    const [apiUrl, certSha256] = line.split(',');
    if (apiUrl && certSha256) {
      return { apiUrl, certSha256 };
    }
  }
  return null;
}

// Import configuration from JSON (as in original Almaz manager)
export async function importFromJson(jsonContent: string): Promise<OutlineServer[] | null> {
  try {
    const data = JSON.parse(jsonContent);
    
    // Check that the structure matches the expected one
    if (!Array.isArray(data)) {
      return null;
    }
    
    return data.map((item, index) => {
      return {
        id: item.id || `imported-${index}`,
        name: item.name || `Server ${index + 1}`,
        apiUrl: item.apiUrl,
        certSha256: item.certSha256,
        port: item.port || 0
      };
    });
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
} 