import { NextRequest } from 'next/server';

export function createMockRequest(
  body?: any,
  url = 'http://localhost:3000/api/test',
  method = 'GET',
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(new URL(url), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}