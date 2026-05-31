import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-jwt-secret-do-not-use-in-production'
);

const ISSUER = 'luxury-estate';
const AUDIENCE = 'luxury-estate-api';

export interface JwtPayload {
  personId: number;
  email: string;
  tenantId: number;
}

export async function signToken(payload: JwtPayload, expiresIn = '24h'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(expiresIn)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return {
      personId: payload.personId as number,
      email: payload.email as string,
      tenantId: payload.tenantId as number,
    };
  } catch {
    return null;
  }
}
