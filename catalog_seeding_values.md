# Catalog Seeding Values

## Person Types

| Code | Name | Description |
|------|------|-------------|
| CLIENT | CLIENT | client type |
| AGENT | AGENT | agent type |
| BROKER | BROKER | broker type |
| REALTOR | REALTOR | realtor type |
| VP | VP | vp type |
| OWNER | OWNER | owner type |
| EXTERNAL_AGENT | EXTERNAL_AGENT | external_agent type |

## Property Types

| Code | Name | Description |
|------|------|-------------|
| house | house | house property type |
| condo | condo | condo property type |
| villa | villa | villa property type |
| townhouse | townhouse | townhouse property type |
| penthouse | penthouse | penthouse property type |
| land | land | land property type |

## Property Statuses

| Code | Name | Description |
|------|------|-------------|
| for_sale | for_sale | for sale property status |
| for_rent | for_rent | for rent property status |
| sold | sold | sold property status |
| pending | pending | pending property status |

## Associate Types

| Code | Name | Description |
|------|------|-------------|
| AGENT | AGENT | agent role |
| BROKER | BROKER | broker role |
| REALTOR | REALTOR | realtor role |
| VP | VP | vp role |
| MANAGER | MANAGER | manager role |
| ADMIN | ADMIN | admin role |

## Disqualification Statuses

| Code | Name |
|------|------|
| not_a_fit_budget | NOT A FIT/BUDGET |
| lost_to_competition | LOST TO COMPETITION |
| unresponsive_dead | UNRESPONSIVE / DEAD |
| postponed_nurture | POSTPONED (NURTURE) |

## Contact Methods

| Code | Name | Description |
|------|------|-------------|
| EMAIL | Email | Email communication |
| PHONE | Phone | Phone call |
| SMS | SMS | Text message (SMS) |
| WHATSAPP | WhatsApp | WhatsApp messaging |
| TELEGRAM | Telegram | Telegram messaging |
| PORTAL | Portal | Client portal |

## Lead Sources

| Code | Name | Description |
|------|------|-------------|
| WEBSITE | Website | Direct website visit |
| REFERRAL | Referral | Referred by existing client or partner |
| SOCIAL_MEDIA | Social Media | Social media platform |
| EMAIL_MARKETING | Email Marketing | Email marketing campaign |
| PHONE_INQUIRY | Phone Inquiry | Incoming phone call inquiry |
| WALK_IN | Walk-In | Walk-in to office |
| OPEN_HOUSE | Open House | Open house event |
| ZILLOW | Zillow | Zillow listing referral |
| REALTOR_COM | Realtor.com | Realtor.com listing referral |
| GOOGLE | Google | Google search or ads |
| FACEBOOK | Facebook | Facebook ads or page |
| INSTAGRAM | Instagram | Instagram ads or page |
| LINKEDIN | LinkedIn | LinkedIn ads or profile |
| YOUTUBE | YouTube | YouTube channel or ads |
| OTHER | Other | Other source |

## Review Moderation Statuses

| Code | Name | Description |
|------|------|-------------|
| PENDING | PENDING | pending moderation status |
| APPROVED | APPROVED | approved moderation status |
| REJECTED | REJECTED | rejected moderation status |
| FLAGGED | FLAGGED | flagged moderation status |

## Tour Types

| Code | Name | Description |
|------|------|-------------|
| in_person | In-Person Tour | In-Person Tour |
| virtual | Virtual Tour | Virtual Tour |
| private_showing | Private Showing | Private Showing |
| open_house | Open House Visit | Open House Visit |
| broker_tour | Broker Tour | Broker Tour |
| video_walkthrough | Video Walkthrough | Video Walkthrough |
| new_construction | New Construction Tour | New Construction Tour |
| investment | Investment Property Tour | Investment Property Tour |

## Tour Statuses

| Code | Name | Description |
|------|------|-------------|
| PENDING | PENDING | pending tour status |
| CONFIRMED | CONFIRMED | confirmed tour status |
| COMPLETED | COMPLETED | completed tour status |
| CANCELLED | CANCELLED | cancelled tour status |
| NO_SHOW | NO_SHOW | no_show tour status |

## Request Types

| Code | Name | Description |
|------|------|-------------|
| GENERAL | GENERAL | general request type |
| SALES | SALES | sales request type |
| SUPPORT | SUPPORT | support request type |
| PARTNERSHIP | PARTNERSHIP | partnership request type |

## Request Statuses

| Code | Name | Description |
|------|------|-------------|
| NEW | NEW | new request status |
| OPEN | OPEN | open request status |
| HOLD | HOLD | hold request status |
| CLOSED | CLOSED | closed request status |

## Newsletter Content Types

| Code | Name | Description |
|------|------|-------------|
| property | Property | property content type |
| blog_post | Blog Post | blog_post content type |
| market_report | Market Report | market_report content type |

## Newsletter Categories

| Code | Name |
|------|------|
| market_trends | Market Trends |
| investment | Investment |
| lifestyle | Lifestyle |

## Disqualification Reasons

Referenced by `statusId` from `DisqualificationStatus`:

| Reason | Description |
|--------|-------------|
| Budget | The prospect cannot afford your product or service |
| No Authority | The contact is not a decision-maker |
| No Need | The lead does not have a problem your solution solves |
| Lost to Competition | Competitor Choice |
| Better Pricing | They went with a cheaper alternative |
| Unresponsive / Dead | The prospect stopped replying |
| Bad Data | The email bounced or phone disconnected |
| Bad Timing | The lead is interested but cannot buy now |
| Lack of Resources | Company experienced restructuring |

## Recommended Role Seed Values

| Code | Name |
|------|------|
| ADMINISTRATOR | Administrator |
| BROKER | Broker |
| MANAGING_BROKER | Managing Broker |
| ASSOCIATE | Associate |
| MARKETING_MANAGER | Marketing Manager |
| CONTENT_EDITOR | Content Editor |
| CUSTOMER | Customer |

## Example Role Records

| Code | Name | Description | isSystem | sortOrder |
|------|------|-------------|----------|-----------|
| ADMINISTRATOR | Administrator | Administrator role | true | 10 |
| BROKER | Broker | Broker role | true | 20 |
| MANAGING_BROKER | Managing Broker | Managing Broker role | false | 25 |
| ASSOCIATE | Associate | Associate role | false | 30 |
| MARKETING_MANAGER | Marketing Manager | Marketing Manager role | false | 35 |
| CONTENT_EDITOR | Content Editor | Content Editor role | false | 40 |
| CUSTOMER | Customer | Customer role | false | 50 |

## Recommended Permission Categories

| Category |
|----------|
| Properties |
| Agencies |
| Associates |
| Blog |
| Newsletter |
| Tours |
| Inquiries |
| Users |
| Roles |
| System |

## Recommended Permission Codes

### Properties

| Code | Name |
|------|------|
| PROPERTY_VIEW | View Properties |
| PROPERTY_CREATE | Create Properties |
| PROPERTY_UPDATE | Update Properties |
| PROPERTY_DELETE | Delete Properties |
| PROPERTY_PUBLISH | Publish Properties |

### Agencies

| Code | Name |
|------|------|
| AGENCY_VIEW | View Agencies |
| AGENCY_CREATE | Create Agencies |
| AGENCY_UPDATE | Update Agencies |
| AGENCY_DELETE | Delete Agencies |

### Associates

| Code | Name |
|------|------|
| ASSOCIATE_VIEW | View Associates |
| ASSOCIATE_CREATE | Create Associates |
| ASSOCIATE_UPDATE | Update Associates |
| ASSOCIATE_DELETE | Delete Associates |

### Blog

| Code | Name |
|------|------|
| BLOG_VIEW | View Blog Posts |
| BLOG_CREATE | Create Blog Posts |
| BLOG_UPDATE | Update Blog Posts |
| BLOG_DELETE | Delete Blog Posts |
| BLOG_PUBLISH | Publish Blog Posts |

### Newsletter

| Code | Name |
|------|------|
| NEWSLETTER_VIEW | View Newsletters |
| NEWSLETTER_CREATE | Create Newsletters |
| NEWSLETTER_UPDATE | Update Newsletters |
| NEWSLETTER_DELETE | Delete Newsletters |
| NEWSLETTER_SEND | Send Newsletters |

### Tours

| Code | Name |
|------|------|
| TOUR_VIEW | View Tours |
| TOUR_CREATE | Create Tours |
| TOUR_UPDATE | Update Tours |
| TOUR_DELETE | Delete Tours |
| TOUR_CONFIRM | Confirm Tours |
| TOUR_CANCEL | Cancel Tours |

### Property Inquiries

| Code | Name |
|------|------|
| INQUIRY_VIEW | View Inquiries |
| INQUIRY_CREATE | Create Inquiries |
| INQUIRY_UPDATE | Update Inquiries |
| INQUIRY_DELETE | Delete Inquiries |

### Users

| Code | Name |
|------|------|
| USER_VIEW | View Users |
| USER_CREATE | Create Users |
| USER_UPDATE | Update Users |
| USER_DELETE | Delete Users |

### Roles

| Code | Name |
|------|------|
| ROLE_VIEW | View Roles |
| ROLE_CREATE | Create Roles |
| ROLE_UPDATE | Update Roles |
| ROLE_DELETE | Delete Roles |

### System

| Code | Name |
|------|------|
| SYSTEM_ADMIN | System Admin |
