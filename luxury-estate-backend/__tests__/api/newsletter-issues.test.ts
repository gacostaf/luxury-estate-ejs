import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listIssues, POST as createIssue } from '@/app/api/newsletter-issues/route';
import { GET as getIssue, PATCH as updateIssue, DELETE as deleteIssue } from '@/app/api/newsletter-issues/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

function slug(name: string) {
  return `${name}-${Date.now()}`;
}

describe('Newsletter Issues API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/newsletter-issues', () => {
    it('should return empty list when no issues exist', async () => {
      const res = await listIssues(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return list of issues', async () => {
      await prisma.newsletterIssue.create({
        data: { title: 'Test Issue', slug: slug('test-issue'), createdById: adminPersonId, tenantId: 1 },
      });
      const res = await listIssues(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].title).toBe('Test Issue');
    });

    it('should filter by isPublished', async () => {
      await prisma.newsletterIssue.create({
        data: { title: 'Published', slug: slug('published'), isPublished: true, createdById: adminPersonId, tenantId: 1 },
      });
      await prisma.newsletterIssue.create({
        data: { title: 'Draft', slug: slug('draft'), isPublished: false, createdById: adminPersonId, tenantId: 1 },
      });
      const req = createMockRequest(undefined, 'http://localhost/api/newsletter-issues?isPublished=true', 'GET');
      const res = await listIssues(req);
      const json = await res.json();
      expect(json.data).toHaveLength(1);
      expect(json.data[0].isPublished).toBe(true);
    });
  });

  describe('POST /api/newsletter-issues', () => {
    it('should create a newsletter issue', async () => {
      const payload = {
        title: 'Q1 2026 Report',
        slug: slug('q1-2026-report'),
        issueNumber: 1,
        summary: 'First quarter market analysis',
        isPublished: false,
        createdById: adminPersonId,
      };
      const req = createMockRequest(payload, undefined, 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await createIssue(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.title).toBe('Q1 2026 Report');
      expect(json.data.slug).toBe(payload.slug);
    });

    it('should return 401 without auth', async () => {
      const payload = { title: 'Test', slug: slug('test') };
      const req = createMockRequest(payload, undefined, 'POST');
      const res = await createIssue(req);
      expect(res.status).toBe(401);
    });

    it('should return 400 for missing required fields', async () => {
      const req = createMockRequest({ title: 'No slug' }, undefined, 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await createIssue(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/newsletter-issues/[id]', () => {
    it('should return issue by id', async () => {
      const issue = await prisma.newsletterIssue.create({
        data: { title: 'Test', slug: slug('test'), createdById: adminPersonId, tenantId: 1 },
      });
      const res = await getIssue(createMockRequest(), params(String(issue.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(issue.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getIssue(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/newsletter-issues/[id]', () => {
    it('should update an issue', async () => {
      const issue = await prisma.newsletterIssue.create({
        data: { title: 'Old Title', slug: slug('old-title'), createdById: adminPersonId, tenantId: 1 },
      });
      const req = createMockRequest(
        { title: 'New Title' },
        undefined, 'PATCH',
        { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' }
      );
      const res = await updateIssue(req, params(String(issue.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.title).toBe('New Title');
    });
  });

  describe('DELETE /api/newsletter-issues/[id]', () => {
    it('should delete an issue', async () => {
      const issue = await prisma.newsletterIssue.create({
        data: { title: 'To Delete', slug: slug('to-delete'), createdById: adminPersonId, tenantId: 1 },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await deleteIssue(req, params(String(issue.id)));
      expect(res.status).toBe(200);
      const deleted = await prisma.newsletterIssue.findUnique({ where: { id: issue.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await deleteIssue(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
