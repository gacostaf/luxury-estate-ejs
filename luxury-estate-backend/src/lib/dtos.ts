// ===================== INTERFACES =====================

export interface TenantDTO {
  id: number;
  name: string;
  slug: string;
  domain: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  isActive: boolean;
}

export interface TenantSettingsDTO {
  id: number;
  tenantId: number;
  companyName: string | null;
  tagline: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialLinkedin: string | null;
  socialTwitter: string | null;
  googleAnalyticsId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface PersonDTO {
  id: number;
  tenantId: number;
  personTypeId: number;
  personType?: PersonTypeDTO;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  isLead: boolean;
  isClient: boolean;
  isAssociate: boolean;
  isDisqualified: boolean;
  disqualificationStatusId: number | null;
  disqualificationStatus?: DisqualificationStatusDTO;
  disqualificationReasonId: number | null;
  disqualificationReason?: DisqualificationReasonDTO;
  addressId: number | null;
  address?: AddressDTO;
  associate?: AssociateDTO;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDTO {
  id: number;
  tenantId: number;
  recipient: string | null;
  organization: string | null;
  addressStreet: string;
  addressCityId: number;
  addressRegionId: number;
  postalCode: string;
  addressCountryId: number;
  cityName?: string;
  regionCode?: string;
  countryCode?: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeDTO {
  id: number;
  phone: string | null;
  addressId: number | null;
  address?: AddressDTO;
  associates?: AssociateDTO[];
}

export interface ImageDTO {
  id: number;
  uri: string;
  isPersonal: boolean;
}

export interface VideoDTO {
  id: number;
  uri: string;
  isPersonal: boolean;
}

export interface PropertyImageDTO {
  id: number;
  tenantId: number;
  propertyId: number;
  imageId: number;
  isBanner: boolean;
  image?: ImageDTO;
}

export interface PropertyVideoDTO {
  id: number;
  propertyId: number;
  videoId: number;
  video?: VideoDTO;
}

export interface PropertyDTO {
  id: number;
  tenantId: number;
  name: string;
  title: string;
  description: string;
  summary: string | null;
  bannerImageId: number | null;
  bannerImage?: ImageDTO;
  featuredImage: string | null;
  seoUrl: string | null;
  slug: string | null;
  publishDate: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  areaSqFt: number | null;
  streetAddress: string | null;
  addressLocality: string | null;
  addressRegion: string | null;
  postalCode: string | null;
  addressCountry: string | null;
  garageSpaces: number | null;
  garages: number | null;
  builtYear: number | null;
  propertyTypeId: number;
  propertyType?: PropertyTypeDTO;
  propertyStatusId: number;
  propertyStatus?: PropertyStatusDTO;
  lotSize: number | null;
  hoaFees: number | null;
  mlsId: string | null;
  latitude: number | null;
  longitude: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  virtualTourUrl: string | null;
  videoTourUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  agencyId: number | null;
  agency?: AgencyDTO;
  agentId: number | null;
  agent?: PersonDTO;
  addressId: number | null;
  address?: AddressDTO;
  images: PropertyImageDTO[];
  videos: PropertyVideoDTO[];
}

export interface AssociateDTO {
  id: number;
  tenantId: number;
  associateTypeId: number;
  associateType?: AssociateTypeDTO;
  personId: number;
  person?: PersonDTO;
  personRoleId: number | null;
  personRole?: PersonRoleDTO;
  agencyId: number | null;
  agency?: AgencyDTO;
  officeId: number | null;
  office?: OfficeDTO;
  department: string | null;
  licenseNumber: string | null;
  startDate: string | null;
  endDate: string | null;
  supervisorId: number | null;
  supervisor?: AssociateDTO;
  commissionPlanId: number | null;
  bio: string | null;
  isPublicProfile: boolean;
  contactMethodId: number | null;
  contactMethod?: ContactMethodDTO;
  photoId: number | null;
  videoId: number | null;
  photo?: ImageDTO;
  video?: VideoDTO;
  fbHandle: string | null;
  igHandle: string | null;
  linkedinHandle: string | null;
}

export interface AgencyDTO {
  id: number;
  tenantId: number;
  name: string;
  slug: string;
  description: string | null;
  logoImageId: number | null;
  bannerImageId: number | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  addressId: number | null;
  address?: AddressDTO;
  logoImage?: ImageDTO;
  bannerImage?: ImageDTO;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  associates?: AssociateDTO[];
  properties?: PropertyDTO[];
}

export interface BlogPostDTO {
  id: number;
  tenantId: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  featuredImageId: number | null;
  featuredImage?: ImageDTO;
  authorPersonId: number;
  authorPerson?: PersonDTO;
  createdAt: string;
  updatedAt: string;
}

export interface AuthAccountDTO {
  id: number;
  tenantId: number;
  personId: number;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyReviewDTO {
  id: number;
  tenantId: number;
  propertyId: number;
  personId: number;
  associateId: number | null;
  moderationStatusId: number | null;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isPublished: boolean;
  helpfulCount: number;
  moderationNote: string | null;
  moderatedById: number | null;
  moderatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  person?: PersonDTO;
  moderationStatus?: { id: number; name: string } | null;
}

export interface ReviewModerationStatusesDTO {
  id: number;
  name: string;
}

export interface ContactMethodDTO {
  id: number;
  tenantId: number;
  code: string;
  name: string;
  description: string | null;
}

export interface LeadSourceDTO {
  id: number;
  tenantId: number;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ContactRequestDTO {
  id: number;
  tenantId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  jobTitle: string | null;
  requestTypeId: number;
  requestType?: { id: number; name: string; code: string } | null;
  subject: string | null;
  message: string;
  contactMethodId: number | null;
  contactMethod?: ContactMethodDTO | null;
  leadSourceId: number | null;
  leadSource?: LeadSourceDTO | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerUrl: string | null;
  landingPageUrl: string | null;
  requestStatusId: number;
  requestStatus?: { id: number; name: string; code: string } | null;
  marketingConsent: boolean;
  ipAddress: string | null;
  assignedAssociateId: number | null;
  assignedTo?: { id: number; personId: number } | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface PersonTypeDTO {
  id: number;
  tenantId: number;
  name: string;
  code?: string;
  description: string | null;
}

export interface PropertyTypeDTO {
  id: number;
  tenantId: number;
  name: string;
  code?: string;
  description: string | null;
}

export interface PropertyStatusDTO {
  id: number;
  tenantId: number;
  name: string;
  code?: string;
  description: string | null;
}

export interface AssociateTypeDTO {
  id: number;
  tenantId: number;
  name: string;
  description: string | null;
}

export interface DisqualificationStatusDTO {
  id: number;
  tenantId: number;
  name: string;
}

export interface DisqualificationReasonDTO {
  id: number;
  tenantId: number;
  reason: string;
  description: string | null;
  statusId: number;
  status?: DisqualificationStatusDTO;
}

export interface RoleDTO {
  id: number;
  tenantId: number;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  sortOrder: number;
}

export interface PermissionDTO {
  id: number;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  isActive: boolean;
  isSystem: boolean;
  sortOrder: number;
}

export interface PersonRoleDTO {
  id: number;
  tenantId: number;
  personId: number;
  roleId: number;
  role?: RoleDTO;
}

export interface PersonPermissionDTO {
  id: number;
  personId: number;
  permissionId: number;
  permission?: PermissionDTO;
}

// ===================== UTILITY =====================

function toDecimal(val: any): number | null {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val);
  if (typeof val.toNumber === 'function') return val.toNumber();
  return null;
}

function toIsoString(val: any): string | null {
  if (val == null) return null;
  if (typeof val === 'string') return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val.toISOString === 'function') return val.toISOString();
  return null;
}

// ===================== MAPPER FUNCTIONS =====================

export function toPersonDTO(p: any): PersonDTO {
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Unknown';
  return {
    id: p.id,
    personTypeId: p.personTypeId,
    personType: p.personType ? toPersonTypeDTO(p.personType) : undefined,
    fullName,
    firstName: p.firstName ?? null,
    lastName: p.lastName ?? null,
    phone: p.phone ?? null,
    email: p.email ?? null,
    isLead: p.isLead ?? false,
    isClient: p.isClient ?? false,
    isAssociate: p.isAssociate ?? false,
    isDisqualified: p.isDisqualified ?? false,
    disqualificationStatusId: p.disqualificationStatusId ?? null,
    disqualificationStatus: p.disqualificationStatus ? toDisqualificationStatusDTO(p.disqualificationStatus) : undefined,
    disqualificationReasonId: p.disqualificationReasonId ?? null,
    disqualificationReason: p.disqualificationReason ? toDisqualificationReasonDTO(p.disqualificationReason) : undefined,
    addressId: p.addressId ?? null,
    address: p.address ? toAddressDTO(p.address) : undefined,
    associate: p.associate ? toAssociateDTO(p.associate) : undefined,
    createdAt: toIsoString(p.createdAt) ?? '',
    updatedAt: toIsoString(p.updatedAt) ?? '',
  };
}

export function toPersonDTOList(people: any[]): PersonDTO[] {
  return people.map(toPersonDTO);
}

export function toAddressDTO(a: any): AddressDTO {
  return {
    id: a.id,
    recipient: a.recipient ?? null,
    organization: a.organization ?? null,
    addressStreet: a.addressStreet,
    addressCityId: a.addressCityId,
    addressRegionId: a.addressRegionId,
    postalCode: a.postalCode,
    addressCountryId: a.addressCountryId,
    cityName: a.city?.cityName,
    regionCode: a.region?.stateCode,
    countryCode: a.country?.code002,
    latitude: toDecimal(a.latitude),
    longitude: toDecimal(a.longitude),
    createdAt: toIsoString(a.createdAt) ?? '',
    updatedAt: toIsoString(a.updatedAt) ?? '',
  };
}

export function toAddressDTOList(addresses: any[]): AddressDTO[] {
  return addresses.map(toAddressDTO);
}

export function toOfficeDTO(o: any): OfficeDTO {
  return {
    id: o.id,
    phone: o.phone ?? null,
    addressId: o.addressId ?? null,
    address: o.address ? toAddressDTO(o.address) : undefined,
    associates: o.associates ? toAssociateDTOList(o.associates) : undefined,
  };
}

export function toOfficeDTOList(offices: any[]): OfficeDTO[] {
  return offices.map(toOfficeDTO);
}

export function toImageDTO(img: any): ImageDTO {
  return {
    id: img.id,
    uri: img.uri,
    isPersonal: img.isPersonal ?? false,
  };
}

export function toVideoDTO(v: any): VideoDTO {
  return {
    id: v.id,
    uri: v.uri,
    isPersonal: v.isPersonal ?? false,
  };
}

export function toPropertyImageDTO(pi: any): PropertyImageDTO {
  return {
    id: pi.id,
    propertyId: pi.propertyId,
    imageId: pi.imageId,
    isBanner: pi.isBanner ?? false,
    image: pi.image ? toImageDTO(pi.image) : undefined,
  };
}

export function toPropertyVideoDTO(pv: any): PropertyVideoDTO {
  return {
    id: pv.id,
    propertyId: pv.propertyId,
    videoId: pv.videoId,
    video: pv.video ? toVideoDTO(pv.video) : undefined,
  };
}

export function toPropertyDTO(p: any): PropertyDTO {
  return {
    id: p.id,
    name: p.name,
    title: p.name,
    description: p.description,
    summary: p.summary ?? null,
    bannerImageId: p.bannerImageId ?? null,
    bannerImage: p.bannerImage ? toImageDTO(p.bannerImage) : undefined,
    featuredImage: p.bannerImage?.uri ?? null,
    seoUrl: p.seoUrl ?? null,
    slug: p.seoUrl ?? null,
    publishDate: toIsoString(p.publishDate),
    price: toDecimal(p.price),
    bedrooms: p.bedrooms ?? null,
    bathrooms: p.bathrooms ?? null,
    areaSqft: toDecimal(p.areaSqft),
    areaSqFt: toDecimal(p.areaSqft),
    streetAddress: p.streetAddress ?? null,
    addressLocality: p.addressLocality ?? null,
    addressRegion: p.addressRegion ?? null,
    postalCode: p.postalCode ?? null,
    addressCountry: p.addressCountry ?? null,
    garageSpaces: p.garageSpaces ?? null,
    garages: p.garageSpaces ?? null,
    builtYear: p.builtYear ?? null,
    propertyTypeId: p.propertyTypeId,
    propertyType: p.propertyType ? toPropertyTypeDTO(p.propertyType) : undefined,
    propertyStatusId: p.propertyStatusId,
    propertyStatus: p.propertyStatus ? toPropertyStatusDTO(p.propertyStatus) : undefined,
    lotSize: toDecimal(p.lotSize),
    hoaFees: toDecimal(p.hoaFees),
    mlsId: p.mlsId ?? null,
    latitude: toDecimal(p.latitude),
    longitude: toDecimal(p.longitude),
    isFeatured: p.isFeatured ?? false,
    isPublished: p.isPublished ?? false,
    virtualTourUrl: p.virtualTourUrl ?? null,
    videoTourUrl: p.videoTourUrl ?? null,
    metaTitle: p.metaTitle ?? null,
    metaDescription: p.metaDescription ?? null,
    agencyId: p.agencyId ?? null,
    agency: p.agency ? toAgencyDTO(p.agency) : undefined,
    agentId: p.agentId ?? null,
    agent: p.agent ? toPersonDTO(p.agent) : undefined,
    addressId: p.addressId ?? null,
    address: p.address ? toAddressDTO(p.address) : undefined,
    images: p.propertyImages ? p.propertyImages.map(toPropertyImageDTO) : [],
    videos: p.propertyVideos ? p.propertyVideos.map(toPropertyVideoDTO) : [],
  };
}

export function toPropertyDTOList(properties: any[]): PropertyDTO[] {
  return properties.map(toPropertyDTO);
}

export function toAssociateDTO(a: any): AssociateDTO {
  return {
    id: a.id,
    associateTypeId: a.associateTypeId,
    associateType: a.associateType ? toAssociateTypeDTO(a.associateType) : undefined,
    personId: a.personId,
    person: a.person ? toPersonDTO(a.person) : undefined,
    personRoleId: a.personRoleId ?? null,
    personRole: a.personRole ? toPersonRoleDTO(a.personRole) : undefined,
    agencyId: a.agencyId ?? null,
    agency: a.agency ? toAgencyDTO(a.agency) : undefined,
    officeId: a.officeId ?? null,
    office: a.office ? toOfficeDTO(a.office) : undefined,
    department: a.department ?? null,
    licenseNumber: a.licenseNumber ?? null,
    startDate: toIsoString(a.startDate),
    endDate: toIsoString(a.endDate),
    supervisorId: a.supervisorId ?? null,
    supervisor: a.supervisor ? toAssociateDTO(a.supervisor) : undefined,
    commissionPlanId: a.commissionPlanId ?? null,
    bio: a.bio ?? null,
    isPublicProfile: a.isPublicProfile ?? true,
    contactMethodId: a.contactMethodId ?? null,
    contactMethod: a.contactMethod ? toContactMethodDTO(a.contactMethod) : undefined,
    photoId: a.photoId ?? null,
    videoId: a.videoId ?? null,
    photo: a.photo ? toImageDTO(a.photo) : undefined,
    video: a.video ? toVideoDTO(a.video) : undefined,
    fbHandle: a.fbHandle ?? null,
    igHandle: a.igHandle ?? null,
    linkedinHandle: a.linkedinHandle ?? null,
  };
}

export function toAssociateDTOList(associates: any[]): AssociateDTO[] {
  return associates.map(toAssociateDTO);
}

export function toAgencyDTO(a: any): AgencyDTO {
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    description: a.description ?? null,
    logoImageId: a.logoImageId ?? null,
    bannerImageId: a.bannerImageId ?? null,
    phone: a.phone ?? null,
    email: a.email ?? null,
    websiteUrl: a.websiteUrl ?? null,
    facebookUrl: a.facebookUrl ?? null,
    instagramUrl: a.instagramUrl ?? null,
    linkedinUrl: a.linkedinUrl ?? null,
    addressId: a.addressId ?? null,
    address: a.address ? toAddressDTO(a.address) : undefined,
    logoImage: a.logoImage ? toImageDTO(a.logoImage) : undefined,
    bannerImage: a.bannerImage ? toImageDTO(a.bannerImage) : undefined,
    isFeatured: a.isFeatured ?? false,
    isVerified: a.isVerified ?? false,
    createdAt: toIsoString(a.createdAt) ?? '',
    updatedAt: toIsoString(a.updatedAt) ?? '',
    associates: a.associates ? toAssociateDTOList(a.associates) : undefined,
    properties: a.properties ? toPropertyDTOList(a.properties) : undefined,
  };
}

export function toAgencyDTOList(agencies: any[]): AgencyDTO[] {
  return agencies.map(toAgencyDTO);
}

export function toBlogPostDTO(bp: any): BlogPostDTO {
  return {
    id: bp.id,
    title: bp.title,
    slug: bp.slug,
    excerpt: bp.excerpt ?? null,
    content: bp.content,
    published: bp.published ?? false,
    featuredImageId: bp.featuredImageId ?? null,
    featuredImage: bp.featuredImage ? toImageDTO(bp.featuredImage) : undefined,
    authorPersonId: bp.authorPersonId,
    authorPerson: bp.authorPerson ? toPersonDTO(bp.authorPerson) : undefined,
    createdAt: toIsoString(bp.createdAt) ?? '',
    updatedAt: toIsoString(bp.updatedAt) ?? '',
  };
}

export function toBlogPostDTOList(posts: any[]): BlogPostDTO[] {
  return posts.map(toBlogPostDTO);
}

export function toAuthAccountDTO(aa: any): AuthAccountDTO {
  return {
    id: aa.id,
    personId: aa.personId,
    email: aa.email,
    emailVerified: aa.emailVerified ?? false,
    isActive: aa.isActive ?? true,
    lastLoginAt: toIsoString(aa.lastLoginAt),
    createdAt: toIsoString(aa.createdAt) ?? '',
    updatedAt: toIsoString(aa.updatedAt) ?? '',
  };
}

export function toContactMethodDTO(cm: any): ContactMethodDTO {
  return {
    id: cm.id,
    code: cm.code,
    name: cm.name,
    description: cm.description ?? null,
  };
}

export function toLeadSourceDTO(ls: any): LeadSourceDTO {
  return {
    id: ls.id,
    code: ls.code,
    name: ls.name,
    description: ls.description ?? null,
    isActive: ls.isActive ?? true,
    sortOrder: ls.sortOrder ?? 0,
  };
}

export function toContactRequestDTO(cr: any): ContactRequestDTO {
  return {
    id: cr.id,
    firstName: cr.firstName,
    lastName: cr.lastName,
    email: cr.email,
    phone: cr.phone ?? null,
    companyName: cr.companyName ?? null,
    jobTitle: cr.jobTitle ?? null,
    requestTypeId: cr.requestTypeId,
    requestType: cr.requestType ? { id: cr.requestType.id, name: cr.requestType.name, code: cr.requestType.code } : undefined,
    subject: cr.subject ?? null,
    message: cr.message,
    contactMethodId: cr.contactMethodId ?? null,
    contactMethod: cr.contactMethod ? toContactMethodDTO(cr.contactMethod) : undefined,
    leadSourceId: cr.leadSourceId ?? null,
    leadSource: cr.leadSource ? toLeadSourceDTO(cr.leadSource) : undefined,
    utmSource: cr.utmSource ?? null,
    utmMedium: cr.utmMedium ?? null,
    utmCampaign: cr.utmCampaign ?? null,
    referrerUrl: cr.referrerUrl ?? null,
    landingPageUrl: cr.landingPageUrl ?? null,
    requestStatusId: cr.requestStatusId,
    requestStatus: cr.requestStatus ? { id: cr.requestStatus.id, name: cr.requestStatus.name, code: cr.requestStatus.code } : undefined,
    marketingConsent: cr.marketingConsent ?? false,
    ipAddress: cr.ipAddress ?? null,
    assignedAssociateId: cr.assignedAssociateId ?? null,
    assignedTo: cr.assignedTo ? { id: cr.assignedTo.id, personId: cr.assignedTo.personId } : undefined,
    createdAt: toIsoString(cr.createdAt) ?? '',
    updatedAt: toIsoString(cr.updatedAt) ?? '',
    resolvedAt: cr.resolvedAt ? toIsoString(cr.resolvedAt) : null,
  };
}

export function toContactRequestDTOList(items: any[]): ContactRequestDTO[] {
  return items.map(toContactRequestDTO);
}

export function toPropertyReviewDTO(pr: any): PropertyReviewDTO {
  return {
    id: pr.id,
    propertyId: pr.propertyId,
    personId: pr.personId,
    associateId: pr.associateId ?? null,
    moderationStatusId: pr.moderationStatusId ?? null,
    rating: pr.rating,
    title: pr.title ?? null,
    comment: pr.comment ?? null,
    isVerified: pr.isVerified ?? false,
    isPublished: pr.isPublished ?? false,
    helpfulCount: pr.helpfulCount ?? 0,
    moderationNote: pr.moderationNote ?? null,
    moderatedById: pr.moderatedById ?? null,
    moderatedAt: pr.moderatedAt ? toIsoString(pr.moderatedAt) : null,
    createdAt: toIsoString(pr.createdAt) ?? '',
    updatedAt: toIsoString(pr.updatedAt) ?? '',
    person: pr.person ? toPersonDTO(pr.person) : undefined,
    moderationStatus: pr.moderationStatus ? { id: pr.moderationStatus.id, name: pr.moderationStatus.name } : undefined,
  };
}

export function toPropertyReviewDTOList(reviews: any[]): PropertyReviewDTO[] {
  return reviews.map(toPropertyReviewDTO);
}

export function toPersonTypeDTO(pt: any): PersonTypeDTO {
  return { id: pt.id, name: pt.name, code: pt.code, description: pt.description ?? null };
}

export function toPropertyTypeDTO(pt: any): PropertyTypeDTO {
  return { id: pt.id, name: pt.name, code: pt.code, description: pt.description ?? null };
}

export function toPropertyStatusDTO(ps: any): PropertyStatusDTO {
  return { id: ps.id, name: ps.name, code: ps.code, description: ps.description ?? null };
}

export function toAssociateTypeDTO(at: any): AssociateTypeDTO {
  return {
    id: at.id,
    name: at.name,
    description: at.description ?? null,
  };
}

export function toDisqualificationStatusDTO(ds: any): DisqualificationStatusDTO {
  return { id: ds.id, name: ds.name };
}

export function toDisqualificationReasonDTO(dr: any): DisqualificationReasonDTO {
  return {
    id: dr.id,
    reason: dr.reason,
    description: dr.description ?? null,
    statusId: dr.statusId,
    status: dr.status ? toDisqualificationStatusDTO(dr.status) : undefined,
  };
}

export function toRoleDTO(r: any): RoleDTO {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    description: r.description ?? null,
    isActive: r.isActive ?? true,
    isSystem: r.isSystem ?? false,
    sortOrder: r.sortOrder ?? 0,
  };
}

export function toPermissionDTO(p: any): PermissionDTO {
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    description: p.description ?? null,
    category: p.category ?? null,
    isActive: p.isActive ?? true,
    isSystem: p.isSystem ?? false,
    sortOrder: p.sortOrder ?? 0,
  };
}

export function toPersonRoleDTO(pr: any): PersonRoleDTO {
  return {
    id: pr.id,
    personId: pr.personId,
    roleId: pr.roleId,
    role: pr.role ? toRoleDTO(pr.role) : undefined,
  };
}

export function toPersonPermissionDTO(pp: any): PersonPermissionDTO {
  return {
    id: pp.id,
    personId: pp.personId,
    permissionId: pp.permissionId,
    permission: pp.permission ? toPermissionDTO(pp.permission) : undefined,
  };
}

// --- Tour Request ---

export interface TourRequestDTO {
  id: number;
  tenantId: number;
  propertyId: number;
  clientPersonId: number | null;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string | null;
  primaryAssociateId: number;
  secondaryAssociateId: number | null;
  tourTypeId: number;
  tourStatusId: number;
  scheduledDate: string;
  clientMessage: string | null;
  associateNotes: string | null;
  contactMethodId: number | null;
  contactMethod?: ContactMethodDTO | null;
  leadSourceId: number | null;
  leadSource?: LeadSourceDTO | null;
  createdAt: string;
  updatedAt: string;
  property?: PropertyDTO;
  clientPerson?: PersonDTO;
  primaryAssociate?: AssociateDTO;
  secondaryAssociate?: AssociateDTO | null;
  tourStatus?: { id: number; name: string; code: string } | null;
}

export function toTourRequestDTO(tr: any): TourRequestDTO {
  return {
    id: tr.id,
    propertyId: tr.propertyId,
    clientPersonId: tr.clientPersonId ?? null,
    clientFirstName: tr.clientFirstName,
    clientLastName: tr.clientLastName,
    clientEmail: tr.clientEmail,
    clientPhone: tr.clientPhone ?? null,
    primaryAssociateId: tr.primaryAssociateId,
    secondaryAssociateId: tr.secondaryAssociateId ?? null,
    tourTypeId: tr.tourTypeId,
    tourStatusId: tr.tourStatusId,
    scheduledDate: toIsoString(tr.scheduledDate) ?? '',
    clientMessage: tr.clientMessage ?? null,
    associateNotes: tr.associateNotes ?? null,
    contactMethodId: tr.contactMethodId ?? null,
    contactMethod: tr.contactMethod ? toContactMethodDTO(tr.contactMethod) : undefined,
    leadSourceId: tr.leadSourceId ?? null,
    leadSource: tr.leadSource ? toLeadSourceDTO(tr.leadSource) : undefined,
    createdAt: toIsoString(tr.createdAt) ?? '',
    updatedAt: toIsoString(tr.updatedAt) ?? '',
    property: tr.property ? toPropertyDTO(tr.property) : undefined,
    clientPerson: tr.clientPerson ? toPersonDTO(tr.clientPerson) : undefined,
    primaryAssociate: tr.primaryAssociate ? toAssociateDTO(tr.primaryAssociate) : undefined,
    secondaryAssociate: tr.secondaryAssociate ? toAssociateDTO(tr.secondaryAssociate) : undefined,
    tourStatus: tr.tourStatus ? { id: tr.tourStatus.id, name: tr.tourStatus.name, code: tr.tourStatus.code } : undefined,
  };
}

export function toTourRequestDTOList(items: any[]): TourRequestDTO[] {
  return items.map(toTourRequestDTO);
}

// --- Property Inquiry ---

export interface PropertyInquiryDTO {
  id: number;
  tenantId: number;
  propertyId: number;
  associateId: number;
  personId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string | null;
  contactMethodId: number | null;
  contactMethod?: ContactMethodDTO | null;
  leadSourceId: number | null;
  leadSource?: LeadSourceDTO | null;
  createdAt: string;
  updatedAt: string;
  property?: PropertyDTO;
  associate?: AssociateDTO;
  person?: PersonDTO;
}

export function toPropertyInquiryDTO(p: any): PropertyInquiryDTO {
  return {
    id: p.id,
    propertyId: p.propertyId,
    associateId: p.associateId,
    personId: p.personId ?? null,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone ?? null,
    message: p.message ?? null,
    contactMethodId: p.contactMethodId ?? null,
    contactMethod: p.contactMethod ? toContactMethodDTO(p.contactMethod) : undefined,
    leadSourceId: p.leadSourceId ?? null,
    leadSource: p.leadSource ? toLeadSourceDTO(p.leadSource) : undefined,
    createdAt: toIsoString(p.createdAt) ?? '',
    updatedAt: toIsoString(p.updatedAt) ?? '',
    property: p.property ? toPropertyDTO(p.property) : undefined,
    associate: p.associate ? toAssociateDTO(p.associate) : undefined,
    person: p.person ? toPersonDTO(p.person) : undefined,
  };
}

export function toPropertyInquiryDTOList(items: any[]): PropertyInquiryDTO[] {
  return items.map(toPropertyInquiryDTO);
}

// --- Newsletter ---

export interface NewsletterIssueDTO {
  id: number;
  tenantId: number;
  title: string;
  slug: string;
  issueNumber: number | null;
  summary: string | null;
  coverImageId: number | null;
  publishedAt: string | null;
  isPublished: boolean;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
  coverImage?: ImageDTO;
  createdBy?: PersonDTO;
  sections?: NewsletterSectionDTO[];
  contents?: NewsletterContentDTO[];
  campaigns?: NewsletterCampaignDTO[];
}

export interface NewsletterSectionDTO {
  id: number;
  newsletterIssueId: number;
  title: string;
  sortOrder: number;
  content: string | null;
}

export interface NewsletterContentDTO {
  id: number;
  newsletterIssueId: number;
  newsletterContentTypeId: number;
  referenceId: number;
  sortOrder: number;
  newsletterContentType?: NewsletterContentTypeDTO;
}

export interface NewsletterContentTypeDTO {
  id: number;
  tenantId: number;
  name: string;
  description: string | null;
}

export interface NewsletterCampaignDTO {
  id: number;
  tenantId: number;
  newsletterIssueId: number;
  sentAt: string | null;
  recipientsCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
}

export interface NewsletterSubscriptionDTO {
  id: number;
  tenantId: number;
  personId: number;
  isSubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
  source: string | null;
  leadSourceId: number | null;
  leadSource?: LeadSourceDTO | null;
  person?: PersonDTO;
  categories?: NewsletterSubscriptionCategoryDTO[];
}

export interface NewsletterCategoryDTO {
  id: number;
  tenantId: number;
  name: string;
}

export interface NewsletterSubscriptionCategoryDTO {
  id: number;
  newsletterSubscriptionId: number;
  newsletterCategoryId: number;
  newsletterCategory?: NewsletterCategoryDTO;
}

export function toNewsletterIssueDTO(ni: any): NewsletterIssueDTO {
  return {
    id: ni.id,
    title: ni.title,
    slug: ni.slug,
    issueNumber: ni.issueNumber ?? null,
    summary: ni.summary ?? null,
    coverImageId: ni.coverImageId ?? null,
    publishedAt: ni.publishedAt ? toIsoString(ni.publishedAt) : null,
    isPublished: ni.isPublished ?? false,
    createdById: ni.createdById ?? null,
    createdAt: toIsoString(ni.createdAt) ?? '',
    updatedAt: toIsoString(ni.updatedAt) ?? '',
    coverImage: ni.coverImage ? toImageDTO(ni.coverImage) : undefined,
    createdBy: ni.createdBy ? toPersonDTO(ni.createdBy) : undefined,
    sections: ni.sections ? ni.sections.map(toNewsletterSectionDTO) : undefined,
    contents: ni.contents ? ni.contents.map(toNewsletterContentDTO) : undefined,
    campaigns: ni.campaigns ? ni.campaigns.map(toNewsletterCampaignDTO) : undefined,
  };
}

export function toNewsletterSectionDTO(ns: any): NewsletterSectionDTO {
  return {
    id: ns.id,
    newsletterIssueId: ns.newsletterIssueId,
    title: ns.title,
    sortOrder: ns.sortOrder ?? 0,
    content: ns.content ?? null,
  };
}

export function toNewsletterContentDTO(nc: any): NewsletterContentDTO {
  return {
    id: nc.id,
    newsletterIssueId: nc.newsletterIssueId,
    newsletterContentTypeId: nc.newsletterContentTypeId,
    referenceId: nc.referenceId,
    sortOrder: nc.sortOrder ?? 0,
    newsletterContentType: nc.newsletterContentType ? toNewsletterContentTypeDTO(nc.newsletterContentType) : undefined,
  };
}

export function toNewsletterContentTypeDTO(nct: any): NewsletterContentTypeDTO {
  return {
    id: nct.id,
    name: nct.name,
    description: nct.description ?? null,
  };
}

export function toNewsletterCampaignDTO(nc: any): NewsletterCampaignDTO {
  return {
    id: nc.id,
    newsletterIssueId: nc.newsletterIssueId,
    sentAt: nc.sentAt ? toIsoString(nc.sentAt) : null,
    recipientsCount: nc.recipientsCount ?? 0,
    openCount: nc.openCount ?? 0,
    clickCount: nc.clickCount ?? 0,
    createdAt: toIsoString(nc.createdAt) ?? '',
  };
}

export function toNewsletterSubscriptionDTO(ns: any): NewsletterSubscriptionDTO {
  return {
    id: ns.id,
    personId: ns.personId,
    isSubscribed: ns.isSubscribed ?? true,
    subscribedAt: toIsoString(ns.subscribedAt) ?? '',
    unsubscribedAt: ns.unsubscribedAt ? toIsoString(ns.unsubscribedAt) : null,
    source: ns.source ?? null,
    leadSourceId: ns.leadSourceId ?? null,
    leadSource: ns.leadSource ? toLeadSourceDTO(ns.leadSource) : undefined,
    person: ns.person ? toPersonDTO(ns.person) : undefined,
    categories: ns.categories ? ns.categories.map(toNewsletterSubscriptionCategoryDTO) : undefined,
  };
}

export function toNewsletterCategoryDTO(nc: any): NewsletterCategoryDTO {
  return {
    id: nc.id,
    name: nc.name,
  };
}

export function toNewsletterSubscriptionCategoryDTO(nsc: any): NewsletterSubscriptionCategoryDTO {
  return {
    id: nsc.id,
    newsletterSubscriptionId: nsc.newsletterSubscriptionId,
    newsletterCategoryId: nsc.newsletterCategoryId,
    newsletterCategory: nsc.newsletterCategory ? toNewsletterCategoryDTO(nsc.newsletterCategory) : undefined,
  };
}

export function toNewsletterIssueDTOList(items: any[]): NewsletterIssueDTO[] {
  return items.map(toNewsletterIssueDTO);
}

export function toNewsletterSubscriptionDTOList(items: any[]): NewsletterSubscriptionDTO[] {
  return items.map(toNewsletterSubscriptionDTO);
}

export function toNewsletterCategoryDTOList(items: any[]): NewsletterCategoryDTO[] {
  return items.map(toNewsletterCategoryDTO);
}

export function toNewsletterContentTypeDTOList(items: any[]): NewsletterContentTypeDTO[] {
  return items.map(toNewsletterContentTypeDTO);
}

// ===================== TENANT MAPPER =====================

export function toTenantDTO(t: any): TenantDTO {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    domain: t.domain ?? null,
    logoUrl: t.logoUrl ?? null,
    faviconUrl: t.faviconUrl ?? null,
    primaryColor: t.primaryColor ?? null,
    isActive: t.isActive ?? true,
  };
}

export function toTenantSettingsDTO(ts: any): TenantSettingsDTO {
  return {
    id: ts.id,
    tenantId: ts.tenantId,
    companyName: ts.companyName ?? null,
    tagline: ts.tagline ?? null,
    contactEmail: ts.contactEmail ?? null,
    contactPhone: ts.contactPhone ?? null,
    address: ts.address ?? null,
    socialFacebook: ts.socialFacebook ?? null,
    socialInstagram: ts.socialInstagram ?? null,
    socialLinkedin: ts.socialLinkedin ?? null,
    socialTwitter: ts.socialTwitter ?? null,
    googleAnalyticsId: ts.googleAnalyticsId ?? null,
    metaTitle: ts.metaTitle ?? null,
    metaDescription: ts.metaDescription ?? null,
  };
}
