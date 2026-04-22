// Drizzle schema for BioSync Studio + Impulso BioCycle.
// Uses pgvector via customType to avoid extra dep. Run `CREATE EXTENSION vector;`
// once manually before `pnpm db:push` (pgvector must be enabled on the Postgres
// instance — supported on Azure DB for PostgreSQL Flexible Server, Neon, Supabase).

import {
  bigint,
  customType,
  index,
  integer,
  pgTable,
  real,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Custom pgvector type ------------------------------------------------------

export const vector = (dimensions: number) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]) {
      return JSON.stringify(value);
    },
    fromDriver(value: string) {
      return JSON.parse(value) as number[];
    },
  });

// Waitlist (landing signup) -------------------------------------------------

export const waitlistTable = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 320 }).notNull(),
    lang: varchar("lang", { length: 8 }).notNull().default("es"),
    status: varchar("status", { length: 32 }).notNull().default("pending_form"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailIdx: uniqueIndex("waitlist_email_unique").on(t.email),
  }),
);

export type Waitlist = typeof waitlistTable.$inferSelect;
export type InsertWaitlist = typeof waitlistTable.$inferInsert;

export const waitlistResponsesTable = pgTable("waitlist_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  waitlistId: uuid("waitlist_id")
    .notNull()
    .references(() => waitlistTable.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 64 }).notNull(),
  country: varchar("country", { length: 8 }).notNull(),
  sector: varchar("sector", { length: 64 }).notNull(),
  painText: text("pain_text").notNull(),
  solutions: text("solutions").array().notNull().default([]),
  timeline: varchar("timeline", { length: 32 }).notNull(),
  callIntent: varchar("call_intent", { length: 32 }).notNull(),
  score: integer("score").notNull(),
  tier: varchar("tier", { length: 8 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type WaitlistResponse = typeof waitlistResponsesTable.$inferSelect;

// Reddit posts (Apify scrape) -----------------------------------------------

export const redditPostsTable = pgTable(
  "reddit_posts",
  {
    id: serial("id").primaryKey(),
    sourceId: varchar("source_id", { length: 16 }).notNull(),
    subreddit: varchar("subreddit", { length: 128 }).notNull(),
    title: text("title").notNull(),
    bodyText: text("body_text"),
    url: varchar("url", { length: 512 }).notNull(),
    author: varchar("author", { length: 128 }),
    score: integer("score").default(0),
    numComments: integer("num_comments").default(0),
    createdUtc: bigint("created_utc", { mode: "number" }),
    scrapedAt: timestamp("scraped_at", { withTimezone: true }).defaultNow().notNull(),
    queryUsed: varchar("query_used", { length: 256 }),
    audience: varchar("audience", { length: 32 }), // 'biomfg' | 'waste-general'
    classification: varchar("classification", { length: 64 }),
    severityScore: smallint("severity_score"),
    isBiosyncFit: smallint("is_biosync_fit"), // 0 | 1 | null
    processed: smallint("processed").notNull().default(0),
  },
  (t) => ({
    sourceIdIdx: uniqueIndex("reddit_posts_source_id_unique").on(t.sourceId),
    subredditIdx: index("reddit_posts_subreddit_idx").on(t.subreddit),
    audienceIdx: index("reddit_posts_audience_idx").on(t.audience),
  }),
);

export type RedditPost = typeof redditPostsTable.$inferSelect;

// Embeddings (pgvector for RAG) ---------------------------------------------

const embeddingVector = vector(1536);

export const embeddingsTable = pgTable(
  "embeddings",
  {
    id: serial("id").primaryKey(),
    sourceType: varchar("source_type", { length: 32 }).notNull(), // 'reddit' | 'corpus' | 'research'
    sourceId: varchar("source_id", { length: 64 }).notNull(),
    chunkIdx: integer("chunk_idx").notNull().default(0),
    text: text("text").notNull(),
    embedding: embeddingVector("embedding").notNull(),
    metadata: text("metadata"), // JSON string (cheap — < 10K rows for MVP)
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    sourceIdx: index("embeddings_source_idx").on(t.sourceType, t.sourceId),
  }),
);

export type Embedding = typeof embeddingsTable.$inferSelect;

// Pain clusters (aggregation for dashboard widget) --------------------------

export const painClustersTable = pgTable("pain_clusters", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 64 }).notNull(),
  count: integer("count").notNull().default(0),
  severityAvg: real("severity_avg").notNull().default(0),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow().notNull(),
});

export type PainCluster = typeof painClustersTable.$inferSelect;
