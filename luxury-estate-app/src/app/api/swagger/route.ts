import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    schemaFolders: ['src/lib'],
    definition: {
      openapi: '3.0.0',
      info: { title: 'Luxury Estate API', version: '1.0.0', description: 'REST API for luxury real estate platform' },
      servers: [{ url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', description: 'Local Dev' }],
      components: {
        schemas: {
          PersonInput: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } },
          CombinedEmployeeInput: { type: 'object', properties: { name: { type: 'string' }, department: { type: 'string' } } },
          EmployeeStandardInput: { type: 'object', properties: { personId: { type: 'number' }, officeId: { type: 'number' } } },
          PropertyInput: { type: 'object', properties: { name: { type: 'string' }, price: { type: 'number' } } }
        }
      }
    }
  });
  return NextResponse.json(spec);
}