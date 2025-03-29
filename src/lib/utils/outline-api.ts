import { OutlineKey, OutlineServer } from "@/types/server";

// Client for working with Outline API
export class OutlineApiClient {
  private server: OutlineServer;

  constructor(server: OutlineServer) {
    this.server = server;
  }

  // Basic method for making API requests
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.server.apiUrl}/${endpoint}`;
    
    const headers = {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      // In Outline API, Bearer token is not used in the Authorization header
      // API key is already included in the apiUrl
    };

    try {
      // For making requests in the browser, we need to handle certificate errors
      // We send requests to our proxy server, which will ignore certificate issues
      // Create URL for the proxy server
      const proxyURL = `/api/outline-proxy?targetURL=${encodeURIComponent(url)}`;
      
      console.log(`Sending request through proxy: ${proxyURL}, method: ${method}, endpoint: ${endpoint}`);
      
      const response = await fetch(proxyURL, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // If the response is empty or doesn't contain JSON, return null
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as unknown as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`Request error to ${url}:`, error);
      throw error;
    }
  }

  // Get list of keys with pagination support
  async getKeys(limit?: number, offset?: number): Promise<{ keys: OutlineKey[], total: number }> {
    interface GetKeysResponse {
      accessKeys: OutlineKey[];
    }
    
    // Base URL
    let endpoint = "access-keys";
    
    // Add pagination parameters if specified
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());
    
    // If there are parameters, add them to the URL
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    console.log(`Getting keys with parameters: limit=${limit}, offset=${offset}`);
    
    try {
      const response = await this.request<GetKeysResponse>("GET", endpoint);
      
      // In reality, Outline API doesn't support pagination directly,
      // so we handle it on the client side
      let accessKeys = response.accessKeys || [];
      const total = accessKeys.length;
      
      // If pagination parameters are specified, apply them manually
      if (offset !== undefined || limit !== undefined) {
        const start = offset || 0;
        const end = limit ? start + limit : undefined;
        accessKeys = accessKeys.slice(start, end);
      }
      
      return { 
        keys: accessKeys,
        total: total 
      };
    } catch (error) {
      console.error("Error getting keys:", error);
      throw error;
    }
  }

  // Get all server keys without pagination
  async getAllKeys(): Promise<OutlineKey[]> {
    interface GetKeysResponse {
      accessKeys: OutlineKey[];
    }
    
    console.log(`Getting all server keys`);
    
    try {
      const response = await this.request<GetKeysResponse>("GET", "access-keys");
      return response.accessKeys || [];
    } catch (error) {
      console.error("Error getting all keys:", error);
      throw error;
    }
  }

  // Create a new key
  async createKey(name: string, dataLimitBytes?: number): Promise<OutlineKey> {
    const data: { name: string; dataLimit?: { bytes: number } } = { name };
    
    if (dataLimitBytes) {
      data.dataLimit = { bytes: dataLimitBytes };
    }
    
    return this.request<OutlineKey>("POST", "access-keys", data);
  }

  // Delete a key
  async deleteKey(keyId: string): Promise<void> {
    await this.request<void>("DELETE", `access-keys/${keyId}`);
  }

  // Update key name
  async renameKey(keyId: string, name: string): Promise<OutlineKey> {
    return this.request<OutlineKey>("PUT", `access-keys/${keyId}/name`, { name });
  }

  // Set data limit for a key
  async setDataLimit(keyId: string, dataLimitBytes: number): Promise<OutlineKey> {
    return this.request<OutlineKey>("PUT", `access-keys/${keyId}/data-limit`, { 
      bytes: dataLimitBytes 
    });
  }

  // Remove data limit for a key
  async removeDataLimit(keyId: string): Promise<void> {
    await this.request<void>("DELETE", `access-keys/${keyId}/data-limit`);
  }

  // Get server information
  async getServerInfo(): Promise<{ name: string; version: string; portForNewAccessKeys: number }> {
    return this.request<{ name: string; version: string; portForNewAccessKeys: number }>("GET", "server");
  }

  // Update server name
  async setServerName(name: string): Promise<void> {
    console.log(`Updating server name to: "${name}"`);
    try {
      // In Outline API, the endpoint for updating the name is just "name"
      await this.request<void>("PUT", "name", { name });
      console.log(`Server name successfully updated to: "${name}"`);
    } catch (error: any) {
      console.error(`Error updating server name to "${name}":`, error);
      throw new Error(`Failed to update server name: ${error.message || 'Unknown error'}`);
    }
  }

  // Update port for new keys
  async setServerPort(port: number): Promise<void> {
    console.log(`Updating port for new keys to: ${port}`);
    try {
      // In Outline API, the endpoint for updating the port is "port-for-new-access-keys"
      await this.request<void>("PUT", "port-for-new-access-keys", { port });
      console.log(`Port for new keys successfully updated to: ${port}`);
    } catch (error: any) {
      console.error(`Error updating port for new keys to ${port}:`, error);
      throw new Error(`Failed to update port for new keys: ${error.message || 'Unknown error'}`);
    }
  }
} 