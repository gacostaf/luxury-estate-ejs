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
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token obtained from /api/auth (or use X-User-ID header in dev mode)',
          },
        },
        schemas: {
          // --- Input Schemas ---
          PersonInput: {
            type: 'object', required: ['firstName', 'lastName', 'personTypeId'],
            properties: {
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              email: { type: 'string', format: 'email', example: 'john@example.com' },
              phone: { type: 'string', example: '+1-555-1234' },
              personTypeId: { type: 'integer', example: 1 },
              isAssociate: { type: 'boolean', default: false },
            },
          },
          AssociateInput: {
            type: 'object', required: ['personId', 'associateTypeId'],
            properties: {
              personId: { type: 'integer', example: 1 },
              associateTypeId: { type: 'integer', example: 1 },
              agencyId: { type: 'integer', nullable: true },
              officeId: { type: 'integer', nullable: true },
              personRoleId: { type: 'integer', nullable: true },
              supervisorId: { type: 'integer', nullable: true },
              department: { type: 'string', example: 'Luxury Sales' },
              title: { type: 'string', example: 'Senior Agent' },
              licenseNumber: { type: 'string', example: 'CAL-123456' },
              photoId: { type: 'integer', nullable: true },
              videoId: { type: 'integer', nullable: true },
              contactMethodId: { type: 'integer', nullable: true },
            },
          },
          AgencyInput: {
            type: 'object', required: ['name'],
            properties: {
              name: { type: 'string', example: 'Luxury Estates Inc.' },
              addressId: { type: 'integer', nullable: true },
              logoId: { type: 'integer', nullable: true },
              bannerId: { type: 'integer', nullable: true },
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
            },
          },
          BlogPostInput: {
            type: 'object', required: ['title', 'slug', 'content', 'authorId'],
            properties: {
              title: { type: 'string', example: 'Market Trends 2026' },
              slug: { type: 'string', example: 'market-trends-2026' },
              excerpt: { type: 'string' },
              content: { type: 'string' },
              published: { type: 'boolean', default: false },
              featuredImageId: { type: 'integer', nullable: true },
              authorId: { type: 'integer', example: 1 },
            },
          },
          LoginInput: {
            type: 'object', required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email', example: 'john@example.com' },
              password: { type: 'string', format: 'password', example: 'mypassword' },
            },
          },
          AuthRegisterInput: {
            type: 'object', required: ['personId', 'email', 'password'],
            properties: {
              personId: { type: 'integer', example: 1 },
              email: { type: 'string', format: 'email', example: 'john@example.com' },
              password: { type: 'string', format: 'password', example: 'mypassword' },
            },
          },
          AuthAccountInput: {
            type: 'object', required: ['personId', 'email', 'passwordHash'],
            properties: {
              personId: { type: 'integer', example: 1 },
              email: { type: 'string', format: 'email' },
              passwordHash: { type: 'string' },
              provider: { type: 'string', default: 'credentials' },
            },
          },
          OfficeInput: {
            type: 'object',
            properties: {
              phone: { type: 'string', example: '555-0001' },
              addressId: { type: 'integer', nullable: true },
            },
          },
          AddressInput: {
            type: 'object',
            properties: {
              streetAddress: { type: 'string' },
              addressLocality: { type: 'string' },
              addressRegion: { type: 'string' },
              postalCode: { type: 'string' },
              addressCountry: { type: 'string' },
            },
          },
          ImageInput: {
            type: 'object', required: ['uri'],
            properties: {
              uri: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
              isPersonal: { type: 'boolean', default: false },
            },
          },
          VideoInput: {
            type: 'object', required: ['uri'],
            properties: {
              uri: { type: 'string', format: 'uri', example: 'https://example.com/video.mp4' },
              isPersonal: { type: 'boolean', default: false },
            },
          },
          PropertyInput: {
            type: 'object', required: ['name', 'description', 'propertyTypeId', 'propertyStatusId'],
            properties: {
              name: { type: 'string', example: 'Ocean View Villa' },
              description: { type: 'string' },
              summary: { type: 'string' },
              price: { type: 'number', example: 2500000 },
              bedrooms: { type: 'integer', example: 4 },
              bathrooms: { type: 'integer', example: 3 },
              areaSqft: { type: 'number' },
              propertyTypeId: { type: 'integer' },
              propertyStatusId: { type: 'integer' },
              streetAddress: { type: 'string' },
              addressLocality: { type: 'string' },
              addressRegion: { type: 'string' },
              postalCode: { type: 'string' },
              addressCountry: { type: 'string' },
              garageSpaces: { type: 'integer' },
              builtYear: { type: 'integer' },
              lotSize: { type: 'number' },
              hoaFees: { type: 'number' },
              mlsId: { type: 'string' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
              isFeatured: { type: 'boolean' },
              isPublished: { type: 'boolean' },
              virtualTourUrl: { type: 'string' },
              videoTourUrl: { type: 'string' },
              agencyId: { type: 'integer', nullable: true },
              agentId: { type: 'integer', nullable: true },
              addressId: { type: 'integer', nullable: true },
            },
          },
          ContactMethodInput: {
            type: 'object', required: ['method'],
            properties: { method: { type: 'string', example: 'email' } },
          },
          PropertyImageInput: {
            type: 'object', required: ['propertyId', 'imageId'],
            properties: {
              propertyId: { type: 'integer' },
              imageId: { type: 'integer' },
              isBanner: { type: 'boolean', default: false },
            },
          },
          PropertyVideoInput: {
            type: 'object', required: ['propertyId', 'videoId'],
            properties: {
              propertyId: { type: 'integer' },
              videoId: { type: 'integer' },
            },
          },

          // --- Response Schemas ---
          SuccessResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Not found' },
              detail: { type: 'string' },
            },
          },
          PersonResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              fullName: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              personTypeId: { type: 'integer' },
              isAssociate: { type: 'boolean' },
            },
          },
          AssociateResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              personId: { type: 'integer' },
              associateTypeId: { type: 'integer' },
              agencyId: { type: 'integer', nullable: true },
              officeId: { type: 'integer', nullable: true },
              department: { type: 'string' },
              title: { type: 'string' },
              licenseNumber: { type: 'string' },
              person: { $ref: '#/components/schemas/PersonResponse' },
            },
          },
          AddressResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              streetAddress: { type: 'string' },
              addressLocality: { type: 'string' },
              addressRegion: { type: 'string' },
              postalCode: { type: 'string' },
              addressCountry: { type: 'string' },
            },
          },
          ImageResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              uri: { type: 'string', format: 'uri' },
              isPersonal: { type: 'boolean' },
            },
          },
          VideoResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              uri: { type: 'string', format: 'uri' },
              isPersonal: { type: 'boolean' },
            },
          },
          OfficeResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              phone: { type: 'string', nullable: true },
              addressId: { type: 'integer', nullable: true },
              address: { $ref: '#/components/schemas/AddressResponse' },
            },
          },
          AgencyResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string', nullable: true },
              phone: { type: 'string', nullable: true },
              email: { type: 'string', nullable: true },
              isFeatured: { type: 'boolean' },
              isVerified: { type: 'boolean' },
              address: { $ref: '#/components/schemas/AddressResponse' },
            },
          },
          BlogPostResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              title: { type: 'string' },
              slug: { type: 'string' },
              excerpt: { type: 'string', nullable: true },
              content: { type: 'string' },
              published: { type: 'boolean' },
              authorId: { type: 'integer' },
              author: { $ref: '#/components/schemas/PersonResponse' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          PropertyResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string' },
              summary: { type: 'string', nullable: true },
              price: { type: 'number', nullable: true },
              bedrooms: { type: 'integer', nullable: true },
              bathrooms: { type: 'integer', nullable: true },
              propertyTypeId: { type: 'integer' },
              propertyStatusId: { type: 'integer' },
              streetAddress: { type: 'string', nullable: true },
              addressLocality: { type: 'string', nullable: true },
              addressRegion: { type: 'string', nullable: true },
              isFeatured: { type: 'boolean' },
              isPublished: { type: 'boolean' },
              agent: { $ref: '#/components/schemas/PersonResponse' },
            },
          },
          ContactMethodResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              method: { type: 'string' },
            },
          },
          PropertyImageResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              propertyId: { type: 'integer' },
              imageId: { type: 'integer' },
              isBanner: { type: 'boolean' },
              image: { $ref: '#/components/schemas/ImageResponse' },
            },
          },
          PropertyVideoResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              propertyId: { type: 'integer' },
              videoId: { type: 'integer' },
              video: { $ref: '#/components/schemas/VideoResponse' },
            },
          },
          LoginResponse: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
              personId: { type: 'integer', example: 1 },
              email: { type: 'string', format: 'email', example: 'john@example.com' },
            },
          },
          AuthRegisterResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              email: { type: 'string', format: 'email', example: 'john@example.com' },
            },
          },
        },
      },
    },
  });
  return NextResponse.json(spec);
}
