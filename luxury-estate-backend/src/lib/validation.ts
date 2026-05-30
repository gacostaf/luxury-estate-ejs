import { z } from 'zod';

export const addressSchema = z.object({
  recipient: z.string().max(255).optional(),
  organization: z.string().max(255).optional(),
  addressStreet: z.string().min(1).max(500),
  addressCityId: z.number().int().positive(),
  addressRegionId: z.number().int().positive(),
  postalCode: z.string().max(20),
  addressCountryId: z.number().int().positive(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const officeSchema = z.object({
  phone: z.string().optional(),
  addressId: z.number().int().positive().optional(),
});

export const imageSchema = z.object({
  uri: z.string().url().max(2048),
  isPersonal: z.boolean().default(false),
});

export const videoSchema = z.object({
  uri: z.string().url().max(2048),
  isPersonal: z.boolean().default(false),
});

export const propertyImageSchema = z.object({
  propertyId: z.number().int().positive(),
  imageId: z.number().int().positive(),
  isBanner: z.boolean().default(false),
});

export const propertyVideoSchema = z.object({
  propertyId: z.number().int().positive(),
  videoId: z.number().int().positive(),
});

export const personSchema = z.object({
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  personTypeId: z.number().int().positive(),
  isLead: z.boolean().optional().default(false),
  isClient: z.boolean().optional().default(false),
  isAssociate: z.boolean().optional().default(false),
  isDisqualified: z.boolean().optional().default(false),
  disqualificationStatusId: z.number().int().positive().optional().nullable(),
  disqualificationReasonId: z.number().int().positive().optional().nullable(),
  addressId: z.number().int().positive().optional().nullable(),
});

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
  agentId: z.number().int().positive().optional().nullable(),
  agencyId: z.number().int().positive().optional().nullable(),
  addressId: z.number().int().positive().optional().nullable(),
  bannerImageId: z.number().int().positive().optional().nullable(),
  seoUrl: z.string().max(255).optional().nullable(),
  publishDate: z.string().datetime().optional().nullable(),
});

export const associateSchema = z.object({
  personId: z.number().int().positive(),
  associateTypeId: z.number().int().positive(),
  personRoleId: z.number().int().positive().optional().nullable(),
  agencyId: z.number().int().positive().optional().nullable(),
  officeId: z.number().int().positive().optional().nullable(),
  department: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  supervisorId: z.number().int().positive().optional().nullable(),
  commissionPlanId: z.number().int().positive().optional().nullable(),
  bio: z.string().optional().nullable(),
  isPublicProfile: z.boolean().optional().default(true),
  contactMethodId: z.number().int().positive().optional().nullable(),
  photoId: z.number().int().positive().optional().nullable(),
  videoId: z.number().int().positive().optional().nullable(),
  fbHandle: z.string().max(2048).optional().nullable(),
  igHandle: z.string().max(2048).optional().nullable(),
  linkedinHandle: z.string().max(2048).optional().nullable(),
});

export const agencySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  logoImageId: z.number().int().positive().optional().nullable(),
  bannerImageId: z.number().int().positive().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  websiteUrl: z.string().url().max(2048).optional().nullable(),
  facebookUrl: z.string().url().max(2048).optional().nullable(),
  instagramUrl: z.string().url().max(2048).optional().nullable(),
  linkedinUrl: z.string().url().max(2048).optional().nullable(),
  addressId: z.number().int().positive().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
  isVerified: z.boolean().optional().default(false),
});

export const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  published: z.boolean().optional().default(false),
  featuredImageId: z.number().int().positive().optional().nullable(),
  authorPersonId: z.number().int().positive(),
});

export const authAccountSchema = z.object({
  personId: z.number().int().positive(),
  email: z.string().email(),
  passwordHash: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  personId: z.number().int().positive(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const contactRequestSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().nullable(),
  companyName: z.string().max(150).optional().nullable(),
  jobTitle: z.string().max(100).optional().nullable(),
  requestTypeId: z.number().int().positive(),
  subject: z.string().max(255).optional().nullable(),
  message: z.string().min(1),
  contactMethodId: z.number().int().positive().optional().nullable(),
  leadSourceId: z.number().int().positive().optional().nullable(),
  utmSource: z.string().max(100).optional().nullable(),
  utmMedium: z.string().max(100).optional().nullable(),
  utmCampaign: z.string().max(100).optional().nullable(),
  referrerUrl: z.string().optional().nullable(),
  landingPageUrl: z.string().optional().nullable(),
  requestStatusId: z.number().int().positive().optional().default(1),
  marketingConsent: z.boolean().optional().default(false),
  ipAddress: z.string().max(45).optional().nullable(),
  assignedAssociateId: z.number().int().positive().optional().nullable(),
});

export const contactMethodSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
});

export const leadSourceSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
});

export const propertyReviewSchema = z.object({
  propertyId: z.number().int().positive(),
  personId: z.number().int().positive(),
  associateId: z.number().int().positive().optional().nullable(),
  moderationStatusId: z.number().int().positive().optional().nullable(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional().nullable(),
  comment: z.string().optional().nullable(),
  isVerified: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
  helpfulCount: z.number().int().min(0).optional().default(0),
  moderationNote: z.string().optional().nullable(),
  moderatedById: z.number().int().positive().optional().nullable(),
  moderatedAt: z.string().datetime().optional().nullable(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type OfficeInput = z.infer<typeof officeSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type PropertyImageInput = z.infer<typeof propertyImageSchema>;
export type PropertyVideoInput = z.infer<typeof propertyVideoSchema>;
export type PersonInput = z.infer<typeof personSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type AssociateInput = z.infer<typeof associateSchema>;
export type AgencyInput = z.infer<typeof agencySchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type AuthAccountInput = z.infer<typeof authAccountSchema>;
export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
export type ContactMethodInput = z.infer<typeof contactMethodSchema>;
export type LeadSourceInput = z.infer<typeof leadSourceSchema>;
export const tourRequestSchema = z.object({
  propertyId: z.number().int().positive(),
  clientPersonId: z.number().int().positive().optional().nullable(),
  clientFirstName: z.string().min(1).max(100),
  clientLastName: z.string().min(1).max(100),
  clientEmail: z.string().email().max(255),
  clientPhone: z.string().max(50).optional().nullable(),
  primaryAssociateId: z.number().int().positive(),
  secondaryAssociateId: z.number().int().positive().optional().nullable(),
  tourTypeId: z.number().int().positive(),
  tourStatusId: z.number().int().positive(),
  scheduledDate: z.string().datetime(),
  clientMessage: z.string().optional().nullable(),
  associateNotes: z.string().optional().nullable(),
  contactMethodId: z.number().int().positive().optional().nullable(),
  leadSourceId: z.number().int().positive().optional().nullable(),
});

export type PropertyReviewInput = z.infer<typeof propertyReviewSchema>;
export type TourRequestInput = z.infer<typeof tourRequestSchema>;

export const newsletterIssueSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  issueNumber: z.number().int().positive().optional().nullable(),
  summary: z.string().optional().nullable(),
  coverImageId: z.number().int().positive().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  isPublished: z.boolean().optional().default(false),
  createdById: z.number().int().positive().optional().nullable(),
});

export const newsletterSectionSchema = z.object({
  newsletterIssueId: z.number().int().positive(),
  title: z.string().min(1).max(255),
  sortOrder: z.number().int().min(0).optional().default(0),
  content: z.string().optional().nullable(),
});

export const newsletterContentSchema = z.object({
  newsletterIssueId: z.number().int().positive(),
  newsletterContentTypeId: z.number().int().positive(),
  referenceId: z.number().int().positive(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const newsletterCampaignSchema = z.object({
  newsletterIssueId: z.number().int().positive(),
  sentAt: z.string().datetime().optional().nullable(),
  recipientsCount: z.number().int().min(0).optional().default(0),
  openCount: z.number().int().min(0).optional().default(0),
  clickCount: z.number().int().min(0).optional().default(0),
});

export const newsletterSubscriptionSchema = z.object({
  personId: z.number().int().positive(),
  isSubscribed: z.boolean().optional().default(true),
  source: z.string().max(100).optional().nullable(),
  leadSourceId: z.number().int().positive().optional().nullable(),
  categoryIds: z.array(z.number().int().positive()).optional().default([]),
});

export const newsletterCategorySchema = z.object({
  code: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

export const newsletterContentTypeSchema = z.object({
  code: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

// --- Property Inquiry ---

export const propertyInquirySchema = z.object({
  propertyId: z.number().int().positive(),
  associateId: z.number().int().positive(),
  personId: z.number().int().positive().optional().nullable(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().nullable(),
  message: z.string().optional().nullable(),
  contactMethodId: z.number().int().positive().optional().nullable(),
  leadSourceId: z.number().int().positive().optional().nullable(),
});

export type PropertyInquiryInput = z.infer<typeof propertyInquirySchema>;

export type NewsletterIssueInput = z.infer<typeof newsletterIssueSchema>;
export type NewsletterSectionInput = z.infer<typeof newsletterSectionSchema>;
export type NewsletterContentInput = z.infer<typeof newsletterContentSchema>;
export type NewsletterCampaignInput = z.infer<typeof newsletterCampaignSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
export type NewsletterCategoryInput = z.infer<typeof newsletterCategorySchema>;
export type NewsletterContentTypeInput = z.infer<typeof newsletterContentTypeSchema>;
