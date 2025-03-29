export interface OutlineServer {
  id: string;
  name: string;
  apiUrl: string;
  certSha256: string;
  port?: number;
  keys?: OutlineKey[];
  count_keys?: number;
}

export interface OutlineKey {
  id: string;
  name: string;
  password: string;
  port: number;
  method: string;
  accessUrl: string;
  createdAt: string;
  dataLimit?: {
    bytes: number;
  };
}

export interface ServerConfig {
  servers: OutlineServer[];
} 