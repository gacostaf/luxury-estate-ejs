# 🗄️ Database Setup & Architecture Guide

This document contains the finalized database schema, entity relationships, and seed configuration for the **Luxury Estate Realtor Listings** application.

> 🔑 **Key Update:** `lat` and `long` fields have been corrected to `DECIMAL(9,6)` for precise geospatial coordinates.

---

## 📐 Entity-Relationship Diagram

```mermaid
erDiagram
    PROPERTY_TYPES ||--o{ PROPERTIES : "1:N"
    PROPERTY_STATUS ||--o{ PROPERTIES : "1:N"
    CREW ||--o{ PROPERTIES : "1:N (Agent)"
    PERSON_TYPES ||--o{ PERSON : "1:N"
    PERSON ||--o| CREW : "1:1"
    PERSON ||--o| EMPLOYEE : "1:1"
    IMAGES ||--o{ PROPERTY_IMAGES : "1:N"
    VIDEOS ||--o{ PROPERTY_VIDEOS : "1:N"
    PROPERTIES ||--o{ PROPERTY_IMAGES : "1:N"
    PROPERTIES ||--o{ PROPERTY_VIDEOS : "1:N"
    PROPERTIES ||--o| IMAGES : "1:1 (Banner)"
    COUNTRIES ||--o{ STATES : "1:N"
    COUNTRIES ||--o{ ZIPCODES : "1:N"

    PROPERTIES {
        int id PK
        varchar name
        text description
        varchar summary
        int banner_image_id FK
        varchar seo_url
        timestamp publish_date
        int price
        int bedrooms
        int bathrooms
        int area_sqft
        varchar address
        int garage_spaces
        int built_year
        int property_type FK
        int property_status FK
        int lot_size
        int hoa_fees
        varchar mls_id
        varchar city
        varchar state
        varchar zip
        decimal(9,6) lat
        decimal(9,6) long
        int energy_rating
        int agent_id FK
        varchar agent_name
        varchar agent_phone
        varchar agent_email
    }
    PROPERTY_TYPES { int id PK, varchar name UK }
    PROPERTY_STATUS { int id PK, varchar name UK }
    PERSON_TYPES { int id PK, varchar name UK }
    PERSON { int id PK, int person_type FK, varchar name, varchar phone, varchar email, text description }
    CREW { int person_id PK_FK, bool is_lead, bool is_client, bool is_crew }
    EMPLOYEE { int person_id PK_FK, varchar department, int photo_id, int video_id, varchar fb_handle, varchar ig_handle, varchar linkedin_handle }
    IMAGES { int id PK, varchar uri, bool is_personal }
    VIDEOS { int id PK, varchar uri, bool is_personal }
    PROPERTY_IMAGES { int id PK, int property_id FK, int image_id FK, bool is_banner }
    PROPERTY_VIDEOS { int id PK, int property_id FK, int video_id FK }
    COUNTRIES { varchar(3) codenum PK, varchar name, varchar(2) code002, varchar(3) code003, varchar tld }
    STATES { int id PK, varchar(3) country_codenum FK, varchar(5) state_code, varchar(30) territory }
    ZIPCODES { int id PK, varchar(3) country_codenum, varchar(5) zip_code, varchar state_region }
    OFFICE { int office_id PK, varchar phone, varchar address_1, varchar address_2, varchar address_3, varchar city, varchar county, varchar state, varchar country }