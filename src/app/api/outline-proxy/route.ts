/**
 * API route for proxying requests to Outline API
 * This allows us to bypass certificate issues that may occur
 * when making direct requests from the browser to Outline servers' API
 */

import { NextRequest, NextResponse } from 'next/server';
import 'server-only';
import https from 'https';
import http from 'http';

export async function GET(request: NextRequest) {
  const targetURL = request.nextUrl.searchParams.get('targetURL');
  
  if (!targetURL) {
    return NextResponse.json({ error: 'URL not specified' }, { status: 400 });
  }
  
  console.log(`Proxying GET request to ${targetURL}`);
  
  try {
    const response = await makeRequestWithoutCertCheck(targetURL);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error proxying GET request:', error);
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { error: `Error proxying request: ${error.message || error}` },
      { status: statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  const targetURL = request.nextUrl.searchParams.get('targetURL');
  
  if (!targetURL) {
    return NextResponse.json({ error: 'URL not specified' }, { status: 400 });
  }
  
  try {
    const body = await request.json();
    console.log(`Proxying POST request to ${targetURL}`);
    console.log('Request body:', JSON.stringify(body));
    
    const response = await makeRequestWithoutCertCheck(targetURL, 'POST', body);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error proxying POST request:', error);
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { error: `Error proxying request: ${error.message || error}` },
      { status: statusCode }
    );
  }
}

export async function PUT(request: NextRequest) {
  const targetURL = request.nextUrl.searchParams.get('targetURL');
  
  if (!targetURL) {
    return NextResponse.json({ error: 'URL not specified' }, { status: 400 });
  }
  
  try {
    const body = await request.json().catch(() => ({}));
    console.log(`Proxying PUT request to ${targetURL}`);
    console.log('Request body:', JSON.stringify(body));
    
    const response = await makeRequestWithoutCertCheck(targetURL, 'PUT', body);
    // If successful response without content, return empty object
    if (response === null) {
      return NextResponse.json({});
    }
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error proxying PUT request:', error);
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { error: `Error proxying request: ${error.message || error}` },
      { status: statusCode }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const targetURL = request.nextUrl.searchParams.get('targetURL');
  
  if (!targetURL) {
    return NextResponse.json({ error: 'URL not specified' }, { status: 400 });
  }
  
  console.log(`Proxying DELETE request to ${targetURL}`);
  
  try {
    const response = await makeRequestWithoutCertCheck(targetURL, 'DELETE');
    // If successful response without content, return empty object
    if (response === null) {
      return NextResponse.json({});
    }
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error proxying DELETE request:', error);
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { error: `Error proxying request: ${error.message || error}` },
      { status: statusCode }
    );
  }
}

/**
 * Performs an HTTP request ignoring certificate validation
 */
async function makeRequestWithoutCertCheck(
  url: string,
  method: string = 'GET',
  body?: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: `${urlObj.pathname}${urlObj.search}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      rejectUnauthorized: false, // Ignore certificate validation
    };
    
    console.log(`Executing request to ${urlObj.hostname}:${options.port}${options.path}, method: ${method}`);
    if (body) {
      console.log('Request body:', JSON.stringify(body));
    }
    
    const requestFn = urlObj.protocol === 'https:' ? https.request : http.request;
    
    const req = requestFn(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Response received, status: ${res.statusCode}, data:`, data.substring(0, 200) + (data.length > 200 ? '...' : ''));
        
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          // If no data or empty string, return null
          if (!data || data.trim() === '') {
            resolve(null);
            return;
          }
          
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (e) {
            console.error('Error parsing JSON:', e, 'Data:', data);
            // If JSON is invalid but request was successful, return empty object
            resolve({});
          }
        } else {
          console.error(`HTTP Error: ${res.statusCode} ${res.statusMessage}, response body:`, data);
          const error = new Error(`HTTP Error: ${res.statusCode} ${res.statusMessage}`);
          (error as any).statusCode = res.statusCode;
          reject(error);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('Request error:', e);
      reject(e);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
} 