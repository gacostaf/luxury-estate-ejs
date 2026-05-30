# Catalog Seeding Values

## Person Types

| Code | Name |
|------|------|
| CLIENT | CLIENT |
| AGENT | AGENT |
| BROKER | BROKER |
| REALTOR | REALTOR |
| VP | VP |
| OWNER | OWNER |
| EXTERNAL_AGENT | EXTERNAL_AGENT |

## Property Types

| Code | Name |
|------|------|
| house | house |
| condo | condo |
| villa | villa |
| townhouse | townhouse |
| penthouse | penthouse |
| land | land |

## Property Statuses

| Code | Name |
|------|------|
| for_sale | for_sale |
| for_rent | for_rent |
| sold | sold |
| pending | pending |

## Associate Types

| Code | Name | Description |
|------|------|-------------|
| AGENT | AGENT | AGENT role |
| BROKER | BROKER | BROKER role |
| REALTOR | REALTOR | REALTOR role |
| VP | VP | VP role |
| MANAGER | MANAGER | MANAGER role |
| ADMIN | ADMIN | ADMIN role |

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

| Code | Name |
|------|------|
| PENDING | PENDING |
| APPROVED | APPROVED |
| REJECTED | REJECTED |
| FLAGGED | FLAGGED |

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

| Code | Name |
|------|------|
| PENDING | PENDING |
| CONFIRMED | CONFIRMED |
| COMPLETED | COMPLETED |
| CANCELLED | CANCELLED |
| NO_SHOW | NO_SHOW |

## Request Types

| Code | Name |
|------|------|
| GENERAL | GENERAL |
| SALES | SALES |
| SUPPORT | SUPPORT |
| PARTNERSHIP | PARTNERSHIP |

## Request Statuses

| Code | Name |
|------|------|
| NEW | NEW |
| OPEN | OPEN |
| HOLD | HOLD |
| CLOSED | CLOSED |

## Newsletter Content Types

| Code | Name |
|------|------|
| property | Property |
| blog_post | Blog Post |
| market_report | Market Report |

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
