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
