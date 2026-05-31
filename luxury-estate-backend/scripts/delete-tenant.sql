-- ============================================================
-- DELETE TENANT SCRIPT
-- ============================================================
-- Usage:
--   1. Set @targetTenantId to the TENANT.ID you want to delete
--   2. Run this script in your MySQL client
--   3. Verify backups were created (backup_* tables)
--   4. If something goes wrong, restore from backup_* tables
-- ============================================================

SET @targetTenantId = 0;  -- <<< SET THIS TO THE TENANT ID YOU WANT TO DELETE

-- ============================================================
-- STEP 1: Backup all tenant-scoped data
-- ============================================================

DROP TABLE IF EXISTS backup_tenants;
DROP TABLE IF EXISTS backup_tenant_settings;
DROP TABLE IF EXISTS backup_person_types;
DROP TABLE IF EXISTS backup_property_types;
DROP TABLE IF EXISTS backup_property_statuses;
DROP TABLE IF EXISTS backup_disqualification_statuses;
DROP TABLE IF EXISTS backup_disqualification_reasons;
DROP TABLE IF EXISTS backup_addresses;
DROP TABLE IF EXISTS backup_persons;
DROP TABLE IF EXISTS backup_auth_accounts;
DROP TABLE IF EXISTS backup_agencies;
DROP TABLE IF EXISTS backup_associates;
DROP TABLE IF EXISTS backup_roles;
DROP TABLE IF EXISTS backup_role_permissions;
DROP TABLE IF EXISTS backup_person_roles;
DROP TABLE IF EXISTS backup_person_permissions;
DROP TABLE IF EXISTS backup_associate_types;
DROP TABLE IF EXISTS backup_offices;
DROP TABLE IF EXISTS backup_images;
DROP TABLE IF EXISTS backup_property_images;
DROP TABLE IF EXISTS backup_videos;
DROP TABLE IF EXISTS backup_property_videos;
DROP TABLE IF EXISTS backup_properties;
DROP TABLE IF EXISTS backup_blog_posts;
DROP TABLE IF EXISTS backup_review_moderation_statuses;
DROP TABLE IF EXISTS backup_property_reviews;
DROP TABLE IF EXISTS backup_contact_methods;
DROP TABLE IF EXISTS backup_lead_sources;
DROP TABLE IF EXISTS backup_contact_requests;
DROP TABLE IF EXISTS backup_property_inquiries;
DROP TABLE IF EXISTS backup_tour_types;
DROP TABLE IF EXISTS backup_tour_requests;
DROP TABLE IF EXISTS backup_newsletter_issues;
DROP TABLE IF EXISTS backup_newsletter_sections;
DROP TABLE IF EXISTS backup_newsletter_contents;
DROP TABLE IF EXISTS backup_newsletter_content_types;
DROP TABLE IF EXISTS backup_newsletter_campaigns;
DROP TABLE IF EXISTS backup_newsletter_subscriptions;
DROP TABLE IF EXISTS backup_newsletter_categories;
DROP TABLE IF EXISTS backup_newsletter_subscription_categories;
DROP TABLE IF EXISTS backup_request_types;
DROP TABLE IF EXISTS backup_request_statuses;
DROP TABLE IF EXISTS backup_tour_statuses;

CREATE TABLE backup_tenants                       AS SELECT * FROM TENANTS                          WHERE ID = @targetTenantId;
CREATE TABLE backup_tenant_settings               AS SELECT * FROM TENANT_SETTINGS                  WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_person_types                  AS SELECT * FROM PERSON_TYPES                     WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_property_types                AS SELECT * FROM PROPERTY_TYPES                   WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_property_statuses             AS SELECT * FROM PROPERTY_STATUSES                WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_disqualification_statuses     AS SELECT * FROM DISQUALIFICATION_STATUSES        WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_disqualification_reasons      AS SELECT * FROM DISQUALIFICATION_REASONS         WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_addresses                     AS SELECT * FROM ADDRESSES                        WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_persons                       AS SELECT * FROM PERSONS                          WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_auth_accounts                 AS SELECT * FROM AUTH_ACCOUNTS                    WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_agencies                      AS SELECT * FROM AGENCIES                         WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_associates                    AS SELECT * FROM ASSOCIATES                       WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_roles                         AS SELECT * FROM ROLES                            WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_role_permissions              AS SELECT * FROM ROLE_PERMISSIONS                 WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_person_roles                  AS SELECT * FROM PERSON_ROLES                     WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_person_permissions            AS SELECT * FROM PERSON_PERMISSIONS               WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_associate_types               AS SELECT * FROM ASSOCIATE_TYPES                  WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_offices                       AS SELECT * FROM OFFICES                          WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_images                        AS SELECT * FROM IMAGES                           WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_property_images               AS SELECT * FROM PROPERTY_IMAGES                  WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_videos                        AS SELECT * FROM VIDEOS                           WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_property_videos               AS SELECT * FROM PROPERTY_VIDEOS                  WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_properties                    AS SELECT * FROM PROPERTIES                       WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_blog_posts                    AS SELECT * FROM BLOG_POSTS                       WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_review_moderation_statuses    AS SELECT * FROM REVIEW_MODERATION_STATUSES       WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_property_reviews              AS SELECT * FROM PROPERTY_REVIEWS                 WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_contact_methods               AS SELECT * FROM CONTACT_METHODS                  WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_lead_sources                  AS SELECT * FROM LEAD_SOURCES                     WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_contact_requests              AS SELECT * FROM CONTACT_REQUESTS                 WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_property_inquiries            AS SELECT * FROM PROPERTY_INQUIRIES               WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_tour_types                    AS SELECT * FROM TOUR_TYPES                       WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_tour_requests                 AS SELECT * FROM TOUR_REQUESTS                    WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_issues             AS SELECT * FROM NEWSLETTER_ISSUES                WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_sections           AS SELECT * FROM NEWSLETTER_SECTIONS              WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_contents           AS SELECT * FROM NEWSLETTER_CONTENT               WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_content_types      AS SELECT * FROM NEWSLETTER_CONTENT_TYPES         WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_campaigns          AS SELECT * FROM NEWSLETTER_CAMPAIGNS             WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_subscriptions      AS SELECT * FROM NEWSLETTER_SUBSCRIPTIONS         WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_categories         AS SELECT * FROM NEWSLETTER_CATEGORIES            WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_newsletter_subscription_categories AS SELECT * FROM NEWSLETTER_SUBSCRIPTION_CATEGORIES WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_request_types                 AS SELECT * FROM REQUEST_TYPES                    WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_request_statuses              AS SELECT * FROM REQUEST_STATUSES                 WHERE TENANT_ID = @targetTenantId;
CREATE TABLE backup_tour_statuses                 AS SELECT * FROM TOUR_STATUSES                    WHERE TENANT_ID = @targetTenantId;

-- ============================================================
-- STEP 2: Disable foreign key checks
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- STEP 3: Delete tenant-scoped data (order does not matter
--          because FK checks are disabled)
-- ============================================================

DELETE FROM NEWSLETTER_SUBSCRIPTION_CATEGORIES WHERE TENANT_ID = @targetTenantId;
DELETE FROM NEWSLETTER_SECTIONS                WHERE TENANT_ID = @targetTenantId;
DELETE FROM NEWSLETTER_CONTENT                 WHERE TENANT_ID = @targetTenantId;
DELETE FROM NEWSLETTER_CAMPAIGNS               WHERE TENANT_ID = @targetTenantId;
DELETE FROM NEWSLETTER_SUBSCRIPTIONS           WHERE TENANT_ID = @targetTenantId;
DELETE FROM NEWSLETTER_CATEGORIES              WHERE TENANT_ID = @targetTenantId;
DELETE FROM NEWSLETTER_CONTENT_TYPES           WHERE TENANT_ID = @targetTenantId;
DELETE FROM NEWSLETTER_ISSUES                  WHERE TENANT_ID = @targetTenantId;
DELETE FROM PROPERTY_IMAGES                    WHERE TENANT_ID = @targetTenantId;
DELETE FROM PROPERTY_VIDEOS                    WHERE TENANT_ID = @targetTenantId;
DELETE FROM PROPERTY_REVIEWS                   WHERE TENANT_ID = @targetTenantId;
DELETE FROM PROPERTY_INQUIRIES                 WHERE TENANT_ID = @targetTenantId;
DELETE FROM TOUR_REQUESTS                      WHERE TENANT_ID = @targetTenantId;
DELETE FROM CONTACT_REQUESTS                   WHERE TENANT_ID = @targetTenantId;
DELETE FROM PERSON_PERMISSIONS                 WHERE TENANT_ID = @targetTenantId;
DELETE FROM PERSON_ROLES                       WHERE TENANT_ID = @targetTenantId;
DELETE FROM ROLE_PERMISSIONS                   WHERE TENANT_ID = @targetTenantId;
DELETE FROM AUTH_ACCOUNTS                      WHERE TENANT_ID = @targetTenantId;
DELETE FROM BLOG_POSTS                         WHERE TENANT_ID = @targetTenantId;
DELETE FROM PROPERTIES                         WHERE TENANT_ID = @targetTenantId;
DELETE FROM ASSOCIATES                         WHERE TENANT_ID = @targetTenantId;
DELETE FROM OFFICES                            WHERE TENANT_ID = @targetTenantId;
DELETE FROM AGENCIES                           WHERE TENANT_ID = @targetTenantId;
DELETE FROM IMAGES                             WHERE TENANT_ID = @targetTenantId;
DELETE FROM VIDEOS                             WHERE TENANT_ID = @targetTenantId;
DELETE FROM PERSONS                            WHERE TENANT_ID = @targetTenantId;
DELETE FROM ADDRESSES                          WHERE TENANT_ID = @targetTenantId;
DELETE FROM DISQUALIFICATION_REASONS           WHERE TENANT_ID = @targetTenantId;
DELETE FROM DISQUALIFICATION_STATUSES          WHERE TENANT_ID = @targetTenantId;
DELETE FROM PERSON_TYPES                       WHERE TENANT_ID = @targetTenantId;
DELETE FROM PROPERTY_TYPES                     WHERE TENANT_ID = @targetTenantId;
DELETE FROM PROPERTY_STATUSES                  WHERE TENANT_ID = @targetTenantId;
DELETE FROM ASSOCIATE_TYPES                    WHERE TENANT_ID = @targetTenantId;
DELETE FROM REVIEW_MODERATION_STATUSES         WHERE TENANT_ID = @targetTenantId;
DELETE FROM CONTACT_METHODS                    WHERE TENANT_ID = @targetTenantId;
DELETE FROM LEAD_SOURCES                       WHERE TENANT_ID = @targetTenantId;
DELETE FROM TOUR_TYPES                         WHERE TENANT_ID = @targetTenantId;
DELETE FROM TOUR_STATUSES                      WHERE TENANT_ID = @targetTenantId;
DELETE FROM REQUEST_TYPES                      WHERE TENANT_ID = @targetTenantId;
DELETE FROM REQUEST_STATUSES                   WHERE TENANT_ID = @targetTenantId;
DELETE FROM ROLES                              WHERE TENANT_ID = @targetTenantId;
DELETE FROM TENANT_SETTINGS                    WHERE TENANT_ID = @targetTenantId;
DELETE FROM TENANTS                            WHERE ID = @targetTenantId;

-- ============================================================
-- STEP 4: Re-enable foreign key checks
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DONE
-- ============================================================
-- To verify: SELECT COUNT(*) AS rows_backed_up FROM backup_tenants;
-- To restore: INSERT INTO TENANTS SELECT * FROM backup_tenants;
--             (repeat for each backup_* table, then DROP TABLE backup_*;)
-- ============================================================
