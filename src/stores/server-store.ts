import { create } from 'zustand';
import { OutlineServer } from '@/types/server';
import { addServer, getServersConfig, updateServer, deleteServer } from '@/lib/utils/server-config';

interface ServerStoreState {
  servers: OutlineServer[];
  isLoading: boolean;
  error: string | null;
  
  loadServers: () => Promise<void>;
  addServer: (server: OutlineServer) => Promise<void>;
  updateServer: (id: string, server: OutlineServer) => Promise<void>;
  deleteServer: (id: string) => Promise<void>;
}

export const useServerStore = create<ServerStoreState>((set, get) => ({
  servers: [],
  isLoading: false,
  error: null,
  
  loadServers: async () => {
    set({ isLoading: true, error: null });
    try {
      const config = await getServersConfig();
      set({ servers: config.servers, isLoading: false });
    } catch (error) {
      set({ error: `Failed to load servers: ${error}`, isLoading: false });
    }
  },
  
  addServer: async (server: OutlineServer) => {
    set({ isLoading: true, error: null });
    try {
      // Use the main server addition function
      await addServer(server);
      // Update state
      await get().loadServers();
    } catch (error) {
      set({ error: `Failed to add server: ${error}`, isLoading: false });
    }
  },
  
  updateServer: async (id: string, server: OutlineServer) => {
    set({ isLoading: true, error: null });
    try {
      await updateServer(id, server);
      const updatedServers = get().servers.map(s => 
        s.id === id ? server : s
      );
      set({ servers: updatedServers, isLoading: false });
    } catch (error) {
      set({ error: `Failed to update server: ${error}`, isLoading: false });
    }
  },
  
  deleteServer: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteServer(id);
      const updatedServers = get().servers.filter(s => s.id !== id);
      set({ servers: updatedServers, isLoading: false });
    } catch (error) {
      set({ error: `Failed to delete server: ${error}`, isLoading: false });
    }
  },
})); 