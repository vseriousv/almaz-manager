import { NextRequest, NextResponse } from 'next/server';
import { ServerConfig } from '@/types/server';
// This directive ensures that the code will only run on the server
import 'server-only';

// Path to the configuration file
const CONFIG_DIR = ''; 
const CONFIG_FILENAME = 'almaz-servers.json';

// Use root directory instead of tmp subdirectory
import path from 'path';
const CONFIG_FILE_PATH = path.join(process.cwd(), CONFIG_FILENAME);

// Get server configuration from file
export async function GET(request: NextRequest) {
  try {
    const fs = await import('fs-extra');
    
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const configStr = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      const config = JSON.parse(configStr);
      return NextResponse.json(config);
    } else {
      // If the file doesn't exist, return an empty configuration
      return NextResponse.json({ servers: [] });
    }
  } catch (error) {
    console.error('Error getting servers from file:', error);
    return NextResponse.json({ error: 'Failed to read servers configuration' }, { status: 500 });
  }
}

// Save server configuration to file
export async function POST(request: NextRequest) {
  try {
    console.log("API: Starting to save server configuration");
    const fs = await import('fs-extra');
    const path = await import('path');
    const config = await request.json();
    
    console.log("API: Path to configuration file:", CONFIG_FILE_PATH);
    console.log("API: Current directory:", process.cwd());
    console.log("API: fs-extra is available:", typeof fs.writeFileSync);
    
    // Check if the directory exists, create it if necessary
    // No need to check directory since we're using the root
    
    // Output content for debugging
    console.log("API: Data to save:", JSON.stringify(config));
    
    await fs.writeJSON(CONFIG_FILE_PATH, config, { spaces: 2 });
    console.log("API: Configuration successfully saved to file");
    
    // Check if the file exists after saving
    const fileExists = fs.existsSync(CONFIG_FILE_PATH);
    const savedData = fileExists ? fs.readFileSync(CONFIG_FILE_PATH, 'utf8') : 'File not found';
    console.log("API: File exists after saving, content:", savedData);
    
    return NextResponse.json({
      success: true,
      message: 'Servers configuration saved',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to save servers configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const fs = await import('fs-extra');
    const config = await request.json();
    
    // Check if the data is valid
    if (!config || !Array.isArray(config.servers)) {
      return NextResponse.json(
        { error: 'Invalid configuration format' },
        { status: 400 }
      );
    }
    
    // Save new configuration
    await fs.writeJSON(CONFIG_FILE_PATH, config, { spaces: 2 });
    
    return NextResponse.json({
      success: true,
      message: 'Servers configuration updated',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update servers configuration' },
      { status: 500 }
    );
  }
}