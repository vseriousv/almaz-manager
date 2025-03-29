import { NextRequest, NextResponse } from "next/server";
import { OutlineServer } from "@/types/server";
import { OutlineApiClient } from "@/lib/utils/outline-api";

// Handler for getting server information
export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { apiUrl, certSha256 } = body;

    if (!apiUrl || !certSha256) {
      return NextResponse.json(
        { error: "API URL and certificate are required" },
        { status: 400 }
      );
    }

    // Create a temporary server object for connection testing
    const tempServer: OutlineServer = {
      id: "temp",
      name: "Temporary server",
      apiUrl,
      certSha256,
    };

    const apiClient = new OutlineApiClient(tempServer);
    
    // Try to get server information
    const serverInfo = await apiClient.getServerInfo();
    
    // If successful, return server data
    return NextResponse.json({
      success: true,
      data: serverInfo,
    });
  } catch (error) {
    console.error("Error connecting to server:", error);
    
    return NextResponse.json(
      { 
        error: "Unable to connect to server. Check API URL and certificate." 
      },
      { status: 500 }
    );
  }
} 