"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMessageSchema = exports.insertDreamSchema = exports.registerSchema = exports.loginSchema = exports.insertUserSchema = exports.dreamTasksRelations = exports.dreamsRelations = exports.userRelations = exports.marketItems = exports.conversations = exports.passwordResetTokens = exports.postComments = exports.postLikes = exports.newsFeedPosts = exports.galleryPosts = exports.champions = exports.transactions = exports.notifications = exports.messages = exports.connections = exports.dreamTasks = exports.dreamMembers = exports.dreams = exports.users = exports.authProviderEnum = exports.notificationTypeEnum = exports.recurrenceEnum = exports.durationUnitEnum = exports.dreamPrivacyEnum = exports.dreamTypeEnum = exports.subscriptionTierEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
/* eslint-disable */
/* @ts-nocheck */
exports.subscriptionTierEnum = (0, pg_core_1.pgEnum)("subscription_tier", [
    "free",
    "bronze",
    "silver",
    "gold",
    "platinum",
]);
exports.dreamTypeEnum = (0, pg_core_1.pgEnum)("dream_type", [
    "personal",
    "challenge",
    "group",
]);
exports.dreamPrivacyEnum = (0, pg_core_1.pgEnum)("dream_privacy", [
    "public",
    "connections",
    "private",
]);
exports.durationUnitEnum = (0, pg_core_1.pgEnum)("duration_unit", [
    "days",
    "weeks",
    "months",
    "years",
]);
exports.recurrenceEnum = (0, pg_core_1.pgEnum)("recurrence", [
    "daily",
    "weekly",
    "semi-weekly",
    "monthly",
    "semi-monthly",
]);
exports.notificationTypeEnum = (0, pg_core_1.pgEnum)("notification_type", [
    "achievement",
    "social",
    "system",
    "reward",
    "transaction",
]);
exports.authProviderEnum = (0, pg_core_1.pgEnum)("auth_provider", [
    "email",
    "google",
    "facebook",
    "phone",
]);
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password"),
    authProvider: (0, exports.authProviderEnum)("auth_provider").default("email"),
    firebaseUid: (0, pg_core_1.text)("firebase_uid").unique(),
    googleId: (0, pg_core_1.text)("google_id"),
    facebookId: (0, pg_core_1.text)("facebook_id"),
    fullName: (0, pg_core_1.text)("full_name"),
    phoneNumber: (0, pg_core_1.text)("phone_number"),
    city: (0, pg_core_1.text)("city"),
    country: (0, pg_core_1.text)("country"),
    profileImage: (0, pg_core_1.text)("profile_image"),
    bio: (0, pg_core_1.text)("bio"),
    isVendor: (0, pg_core_1.boolean)("is_vendor").default(false),
    vendorBusinessName: (0, pg_core_1.text)("vendor_business_name"),
    vendorDescription: (0, pg_core_1.text)("vendor_description"),
    subscriptionTier: (0, exports.subscriptionTierEnum)("subscription_tier").default("free"),
    subscriptionExpiresAt: (0, pg_core_1.timestamp)("subscription_expires_at"),
    coins: (0, pg_core_1.integer)("coins").default(100),
    trophies: (0, pg_core_1.integer)("trophies").default(0),
    awards: (0, pg_core_1.integer)("awards").default(0),
    totalPoints: (0, pg_core_1.integer)("total_points").default(0),
    dailySpinsLeft: (0, pg_core_1.integer)("daily_spins_left").default(3),
    lastSpinDate: (0, pg_core_1.timestamp)("last_spin_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.dreams = (0, pg_core_1.pgTable)("dreams", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    type: (0, exports.dreamTypeEnum)("type").notNull().default("personal"),
    privacy: (0, exports.dreamPrivacyEnum)("privacy").default("public"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    startDate: (0, pg_core_1.timestamp)("start_date"),
    targetDate: (0, pg_core_1.timestamp)("target_date"),
    duration: (0, pg_core_1.integer)("duration"),
    durationUnit: (0, exports.durationUnitEnum)("duration_unit"),
    recurrence: (0, exports.recurrenceEnum)("recurrence"),
    progress: (0, pg_core_1.integer)("progress").default(0),
    isCompleted: (0, pg_core_1.boolean)("is_completed").default(false),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    routineDescription: (0, pg_core_1.text)("routine_description"),
    designNotes: (0, pg_core_1.text)("design_notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.dreamMembers = (0, pg_core_1.pgTable)("dream_members", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    dreamId: (0, pg_core_1.varchar)("dream_id")
        .notNull()
        .references(() => exports.dreams.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    role: (0, pg_core_1.text)("role").default("member"),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow(),
});
exports.dreamTasks = (0, pg_core_1.pgTable)("dream_tasks", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    dreamId: (0, pg_core_1.varchar)("dream_id")
        .notNull()
        .references(() => exports.dreams.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    dueDate: (0, pg_core_1.timestamp)("due_date"),
    reminderDate: (0, pg_core_1.timestamp)("reminder_date"),
    isCompleted: (0, pg_core_1.boolean)("is_completed").default(false),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    order: (0, pg_core_1.integer)("order").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.connections = (0, pg_core_1.pgTable)("connections", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    followerId: (0, pg_core_1.varchar)("follower_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    followingId: (0, pg_core_1.varchar)("following_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    senderId: (0, pg_core_1.varchar)("sender_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    receiverId: (0, pg_core_1.varchar)("receiver_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    content: (0, pg_core_1.text)("content").notNull(),
    isRead: (0, pg_core_1.boolean)("is_read").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    type: (0, exports.notificationTypeEnum)("type").default("system"),
    isRead: (0, pg_core_1.boolean)("is_read").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.transactions = (0, pg_core_1.pgTable)("transactions", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    amount: (0, pg_core_1.integer)("amount").notNull(),
    type: (0, pg_core_1.text)("type").notNull(),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.champions = (0, pg_core_1.pgTable)("champions", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    tier: (0, pg_core_1.text)("tier").notNull(),
    month: (0, pg_core_1.integer)("month"),
    year: (0, pg_core_1.integer)("year").notNull(),
    dreamsCompleted: (0, pg_core_1.integer)("dreams_completed").default(0),
    points: (0, pg_core_1.integer)("points").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.galleryPosts = (0, pg_core_1.pgTable)("gallery_posts", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    dreamId: (0, pg_core_1.varchar)("dream_id").references(() => exports.dreams.id, {
        onDelete: "set null",
    }),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    caption: (0, pg_core_1.text)("caption"),
    likes: (0, pg_core_1.integer)("likes").default(0),
    views: (0, pg_core_1.integer)("views").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.newsFeedPosts = (0, pg_core_1.pgTable)("news_feed_posts", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    dreamId: (0, pg_core_1.varchar)("dream_id").references(() => exports.dreams.id, {
        onDelete: "set null",
    }),
    content: (0, pg_core_1.text)("content").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url"),
    likes: (0, pg_core_1.integer)("likes").default(0),
    comments: (0, pg_core_1.integer)("comments").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.postLikes = (0, pg_core_1.pgTable)("post_likes", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    postId: (0, pg_core_1.varchar)("post_id")
        .notNull()
        .references(() => exports.newsFeedPosts.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.postComments = (0, pg_core_1.pgTable)("post_comments", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    postId: (0, pg_core_1.varchar)("post_id")
        .notNull()
        .references(() => exports.newsFeedPosts.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    content: (0, pg_core_1.text)("content").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.passwordResetTokens = (0, pg_core_1.pgTable)("password_reset_tokens", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    token: (0, pg_core_1.text)("token").notNull().unique(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    usedAt: (0, pg_core_1.timestamp)("used_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.conversations = (0, pg_core_1.pgTable)("conversations", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    participant1Id: (0, pg_core_1.varchar)("participant1_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    participant2Id: (0, pg_core_1.varchar)("participant2_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    lastMessageAt: (0, pg_core_1.timestamp)("last_message_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.marketItems = (0, pg_core_1.pgTable)("market_items", {
    id: (0, pg_core_1.varchar)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    dreamId: (0, pg_core_1.varchar)("dream_id").references(() => exports.dreams.id, {
        onDelete: "set null",
    }),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    price: (0, pg_core_1.integer)("price"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    dreams: many(exports.dreams),
    sentMessages: many(exports.messages, { relationName: "sentMessages" }),
    receivedMessages: many(exports.messages, { relationName: "receivedMessages" }),
    notifications: many(exports.notifications),
    transactions: many(exports.transactions),
    followers: many(exports.connections, { relationName: "followers" }),
    following: many(exports.connections, { relationName: "following" }),
    galleryPosts: many(exports.galleryPosts),
    newsFeedPosts: many(exports.newsFeedPosts),
}));
exports.dreamsRelations = (0, drizzle_orm_1.relations)(exports.dreams, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.dreams.userId],
        references: [exports.users.id],
    }),
    members: many(exports.dreamMembers),
    tasks: many(exports.dreamTasks),
}));
exports.dreamTasksRelations = (0, drizzle_orm_1.relations)(exports.dreamTasks, ({ one }) => ({
    dream: one(exports.dreams, {
        fields: [exports.dreamTasks.dreamId],
        references: [exports.dreams.id],
    }),
}));
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    email: true,
    username: true,
    password: true,
    fullName: true,
});
exports.loginSchema = zod_1.z.object({
    emailOrUsername: zod_1.z.string().min(1, "Email or username is required"),
    password: zod_1.z.string().min(6),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
    fullName: zod_1.z.string().optional(),
});
exports.insertDreamSchema = (0, drizzle_zod_1.createInsertSchema)(exports.dreams).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertMessageSchema = (0, drizzle_zod_1.createInsertSchema)(exports.messages).omit({
    id: true,
    createdAt: true,
    isRead: true,
});
