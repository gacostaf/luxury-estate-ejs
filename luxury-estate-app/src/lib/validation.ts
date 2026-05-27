import { z } from 'zod'; // ✅ Add this line at the very top

// Address Schema
export const addressSchema = z.object({
  recipient: z.string().max(255).optional(),
  organization: z.string().max(255).optional(),
  streetAddress: z.string().min(1).max(500),
  addressLocality: z.string().min(1).max(200),
  addressRegion: z.string().min(1).max(100),
  postalCode: z.string().max(20),
  addressCountry: z.string().length(2),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Office Schema
export const officeSchema = z.object({
  phone: z.string().optional(),
  addressId: z.number().int().positive().optional(),
});

// Image Schema
export const imageSchema = z.object({
  uri: z.string().url().max(2048),
  isPersonal: z.boolean().default(false),
});

// Video Schema
export const videoSchema = z.object({
  uri: z.string().url().max(2048),
  isPersonal: z.boolean().default(false),
});

// PropertyImage Junction Schema
export const propertyImageSchema = z.object({
  propertyId: z.number().int().positive(),
  imageId: z.number().int().positive(),
  isBanner: z.boolean().default(false),
});

// PropertyVideo Junction Schema
export const propertyVideoSchema = z.object({
  propertyId: z.number().int().positive(),
  videoId: z.number().int().positive(),
});

// Person Schema
export const personSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  description: z.string().optional().nullable(),
  personTypeId: z.number().int().positive(),
  isLead: z.boolean().optional().default(false),
  isClient: z.boolean().optional().default(false),
  isEmployee: z.boolean().optional().default(false),
  isDisqualified: z.boolean().optional().default(false),
  disqualificationStatusId: z.number().int().positive().optional().nullable(),
  disqualificationReasonId: z.number().int().positive().optional().nullable(),
  addressId: z.number().int().positive().optional().nullable(),
});

// Property Schema
export const propertySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().optional().nullable(),
  propertyTypeId: z.number().int().positive(),
  propertyStatusId: z.number().int().positive(),
  streetAddress: z.string().max(500).optional().nullable(),
  addressLocality: z.string().max(200).optional().nullable(),
  addressRegion: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  addressCountry: z.string().length(2).optional().nullable(),
  price: z.number().positive().optional().nullable(),
  bedrooms: z.number().int().positive().optional().nullable(),
  bathrooms: z.number().int().positive().optional().nullable(),
  areaSqft: z.number().positive().optional().nullable(),
  garageSpaces: z.number().int().positive().optional().nullable(),
  builtYear: z.number().int().positive().optional().nullable(),
  lotSize: z.number().positive().optional().nullable(),
  hoaFees: z.number().positive().optional().nullable(),
  mlsId: z.string().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  energyRating: z.number().int().min(0).max(100).optional().nullable(),
  agentId: z.number().int().positive().optional().nullable(),
  addressId: z.number().int().positive().optional().nullable(),
  bannerImageId: z.number().int().positive().optional().nullable(),
  seoUrl: z.string().max(255).optional().nullable(),
  publishDate: z.string().datetime().optional().nullable(),
});

// Combined Employee Schema (Person + Employee + Office in one transaction)
export const combinedEmployeeSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  description: z.string().optional().nullable(),
  personTypeId: z.number().int().positive(),
  isLead: z.boolean().optional().default(false),
  isClient: z.boolean().optional().default(false),
  isEmployee: z.boolean().optional().default(true),
  isDisqualified: z.boolean().optional().default(false),
  addressId: z.number().int().positive().optional().nullable(),
  department: z.string().optional().nullable(),
  photoId: z.number().int().positive().optional().nullable(),
  videoId: z.number().int().positive().optional().nullable(),
  fbHandle: z.string().max(2048).optional().nullable(),
  igHandle: z.string().max(2048).optional().nullable(),
  linkedinHandle: z.string().max(2048).optional().nullable(),
  officeId: z.number().int().positive().optional().nullable(),
  officeName: z.string().optional().nullable(),
  officePhone: z.string().optional().nullable(),
  officeAddressId: z.number().int().positive().optional().nullable(),
});

// Employee Standard Schema (create employee for existing person)
export const employeeStandardSchema = z.object({
  personId: z.number().int().positive(),
  department: z.string().optional().nullable(),
  officeId: z.number().int().positive().optional().nullable(),
  photoId: z.number().int().positive().optional().nullable(),
  videoId: z.number().int().positive().optional().nullable(),
  fbHandle: z.string().max(2048).optional().nullable(),
  igHandle: z.string().max(2048).optional().nullable(),
  linkedinHandle: z.string().max(2048).optional().nullable(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type OfficeInput = z.infer<typeof officeSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type PropertyImageInput = z.infer<typeof propertyImageSchema>;
export type PropertyVideoInput = z.infer<typeof propertyVideoSchema>;
export type PersonInput = z.infer<typeof personSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type CombinedEmployeeInput = z.infer<typeof combinedEmployeeSchema>;
export type EmployeeStandardInput = z.infer<typeof employeeStandardSchema>;