import { OutlineServer } from "@/types/server";

/**
 * Save server configuration to API
 */
export const saveServerConfigToAPI = async (config: { servers: OutlineServer[] }): Promise<any> => {
  try {
    console.log("API Helper: Sending configuration to server...");
    const response = await fetch('/api/servers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Helper: Response from server:", data);
    return data;
  } catch (error) {
    console.error("API Helper: Error sending configuration to server:", error);
    throw error;
  }
};

/**
 * Get server configuration from API
 */
export const getServerConfigFromAPI = async (): Promise<{ servers: OutlineServer[] }> => {
  try {
    console.log("API Helper: Loading configuration from server...");
    const response = await fetch('/api/servers');
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Helper: Configuration received:", data);
    return data;
  } catch (error) {
    console.error("API Helper: Error loading configuration from server:", error);
    return { servers: [] };
  }
}; 