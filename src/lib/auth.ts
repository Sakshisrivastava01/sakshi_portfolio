import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    // Fallback for development if not set
    return new TextEncoder().encode("fallback-dev-secret-key-do-not-use-in-prod");
  }
  return new TextEncoder().encode(secret);
};

export const signToken = async (payload: any) => {
  return await new SignJWT({
    ...payload,
    role: "authenticated",
    aud: "authenticated",
    iss: "supabase",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setSubject("admin-user")
    .setExpirationTime("24h")
    .sign(getJwtSecretKey());
};

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return verified.payload;
  } catch (error) {
    return null;
  }
};
