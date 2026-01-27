import { eq, and, desc, or, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  dreams,
  dreamMembers,
  connections,
  messages,
  notifications,
  transactions,
  champions,
  galleryPosts,
  newsFeedPosts,
  postLikes,
  postComments,
  marketItems,
  type User,
  type Dream,
  type Message,
  type Notification,
  type Transaction,
  type Connection,
  type Champion,
  type GalleryPost,
  type NewsFeedPost,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  getDreams(userId: string): Promise<Dream[]>;
  getDream(id: string): Promise<Dream | undefined>;
  createDream(dream: Partial<Dream>): Promise<Dream>;
  updateDream(id: string, data: Partial<Dream>): Promise<Dream | undefined>;
  deleteDream(id: string): Promise<boolean>;

  getConnections(userId: string): Promise<{ followers: User[]; following: User[] }>;
  createConnection(followerId: string, followingId: string): Promise<Connection>;
  deleteConnection(followerId: string, followingId: string): Promise<boolean>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;

  getMessages(userId: string): Promise<Message[]>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: Partial<Message>): Promise<Message>;
  markMessageRead(id: string): Promise<void>;

  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: Partial<Notification>): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(userId: string): Promise<void>;

  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: Partial<Transaction>): Promise<Transaction>;

  getChampions(tier?: string, year?: number): Promise<Champion[]>;
  getWallOfFame(period: string): Promise<User[]>;
  getLeaderboard(limit: number): Promise<any[]>;

  getGalleryPosts(): Promise<GalleryPost[]>;
  createGalleryPost(post: Partial<GalleryPost>): Promise<GalleryPost>;

  getNewsFeed(userId?: string): Promise<NewsFeedPost[]>;
  createNewsFeedPost(post: Partial<NewsFeedPost>): Promise<NewsFeedPost>;
  likePost(postId: string, userId: string): Promise<void>;

  getMarketItems(category?: string): Promise<any[]>;
}

class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await db.insert(users).values(userData as any).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async getDreams(userId: string): Promise<Dream[]> {
    return db.select().from(dreams).where(eq(dreams.userId, userId)).orderBy(desc(dreams.createdAt));
  }

  async getDream(id: string): Promise<Dream | undefined> {
    const [dream] = await db.select().from(dreams).where(eq(dreams.id, id));
    return dream;
  }

  async createDream(dreamData: Partial<Dream>): Promise<Dream> {
    const [dream] = await db.insert(dreams).values(dreamData as any).returning();
    return dream;
  }

  async updateDream(id: string, data: Partial<Dream>): Promise<Dream | undefined> {
    const [dream] = await db
      .update(dreams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(dreams.id, id))
      .returning();
    return dream;
  }

  async deleteDream(id: string): Promise<boolean> {
    await db.delete(dreams).where(eq(dreams.id, id));
    return true;
  }

  async getConnections(userId: string): Promise<{ followers: User[]; following: User[] }> {
    const followersData = await db
      .select()
      .from(connections)
      .where(eq(connections.followingId, userId));

    const followingData = await db
      .select()
      .from(connections)
      .where(eq(connections.followerId, userId));

    const followerIds = followersData.map((c) => c.followerId);
    const followingIds = followingData.map((c) => c.followingId);

    const followers =
      followerIds.length > 0
        ? await db.select().from(users).where(sql`${users.id} = ANY(${followerIds})`)
        : [];

    const following =
      followingIds.length > 0
        ? await db.select().from(users).where(sql`${users.id} = ANY(${followingIds})`)
        : [];

    return { followers, following };
  }

  async createConnection(followerId: string, followingId: string): Promise<Connection> {
    const [connection] = await db
      .insert(connections)
      .values({ followerId, followingId })
      .returning();
    return connection;
  }

  async deleteConnection(followerId: string, followingId: string): Promise<boolean> {
    await db
      .delete(connections)
      .where(and(eq(connections.followerId, followerId), eq(connections.followingId, followingId)));
    return true;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const [connection] = await db
      .select()
      .from(connections)
      .where(and(eq(connections.followerId, followerId), eq(connections.followingId, followingId)));
    return !!connection;
  }

  async getMessages(userId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData as any).returning();
    return message;
  }

  async markMessageRead(id: string): Promise<void> {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData as any)
      .returning();
    return notification;
  }

  async markNotificationRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData as any)
      .returning();
    return transaction;
  }

  async getChampions(tier?: string, year?: number): Promise<Champion[]> {
    let query = db.select().from(champions);
    if (tier) {
      query = query.where(eq(champions.tier, tier)) as typeof query;
    }
    if (year) {
      query = query.where(eq(champions.year, year)) as typeof query;
    }
    return query.orderBy(desc(champions.points));
  }

  async getWallOfFame(period: string): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.totalPoints)).limit(50);
  }

  async getLeaderboard(limit: number): Promise<any[]> {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        totalPoints: users.totalPoints,
        awards: users.awards,
        profileImage: users.profileImage,
      })
      .from(users)
      .orderBy(desc(users.totalPoints))
      .limit(limit);

    const usersWithDreams = await Promise.all(
      allUsers.map(async (user) => {
        const userDreams = await db
          .select()
          .from(dreams)
          .where(eq(dreams.userId, user.id));
        const completedDreams = userDreams.filter((d) => d.isCompleted).length;
        return {
          ...user,
          dreamsCompleted: completedDreams,
          totalDreams: userDreams.length,
        };
      })
    );

    return usersWithDreams;
  }

  async getGalleryPosts(): Promise<GalleryPost[]> {
    return db.select().from(galleryPosts).orderBy(desc(galleryPosts.createdAt));
  }

  async createGalleryPost(postData: Partial<GalleryPost>): Promise<GalleryPost> {
    const [post] = await db.insert(galleryPosts).values(postData as any).returning();
    return post;
  }

  async getNewsFeed(userId?: string): Promise<NewsFeedPost[]> {
    return db.select().from(newsFeedPosts).orderBy(desc(newsFeedPosts.createdAt)).limit(50);
  }

  async createNewsFeedPost(postData: Partial<NewsFeedPost>): Promise<NewsFeedPost> {
    const [post] = await db.insert(newsFeedPosts).values(postData as any).returning();
    return post;
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const [existing] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));

    if (!existing) {
      await db.insert(postLikes).values({ postId, userId });
      await db
        .update(newsFeedPosts)
        .set({ likes: sql`${newsFeedPosts.likes} + 1` })
        .where(eq(newsFeedPosts.id, postId));
    }
  }

  async getMarketItems(category?: string): Promise<any[]> {
    if (category) {
      return db
        .select()
        .from(marketItems)
        .where(and(eq(marketItems.isActive, true), eq(marketItems.category, category)))
        .orderBy(desc(marketItems.createdAt));
    }
    return db
      .select()
      .from(marketItems)
      .where(eq(marketItems.isActive, true))
      .orderBy(desc(marketItems.createdAt));
  }
}

export const storage = new DatabaseStorage();
