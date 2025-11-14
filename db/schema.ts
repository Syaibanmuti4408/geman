import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ------------------------
// 🧩 User table
// ------------------------
export const user = sqliteTable("user", {
  id: text("id").primaryKey().notNull(), // Usually uuid
  name: text("name").notNull().default("admin"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// ------------------------
// 🧩 Account table
// ------------------------
export const account = sqliteTable("account", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  providerId: text("provider_id").notNull(), // e.g. "email" / "google"
  accountId: text("account_id").notNull(), // For email login it can be same as email
  password: text("password"), // hashed password
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: integer("access_token_expires_at"),
  refreshTokenExpiresAt: integer("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// ------------------------
// 🧩 Session table
// ------------------------
export const session = sqliteTable("session", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// ------------------------
// 🧩 Verification table
// ------------------------
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey().notNull(),
  identifier: text("identifier").notNull(), // email or userId
  value: text("value").notNull(), // token or code
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// ------------------------
// 🧩 API Keys
// ------------------------
export const apiKeys = sqliteTable("api_keys", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  apiKey: text("api_key").notNull().unique(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isHealthy: integer("is_healthy", { mode: "boolean" }).notNull().default(true),
  lastUsedAt: integer("last_used_at"),
  failureCount: integer("failure_count").notNull().default(0),
  lastFailureAt: integer("last_failure_at"),
  createdAt: integer("created_at").default(Date.now()).notNull(),
});

// ------------------------
// 🧩 API Key Calls
// ------------------------
export const apiKeyCalls = sqliteTable("api_key_calls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyId: integer("key_id")
    .notNull()
    .references(() => apiKeys.id, { onDelete: "cascade" }),
  success: integer("success", { mode: "boolean" }).notNull(),
  statusCode: integer("status_code"),
  createdAt: integer("created_at").default(Date.now()).notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
