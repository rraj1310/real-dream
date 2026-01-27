import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "node:http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { loginSchema, registerSchema } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "real-dream-secret-key";

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { email, username, password, fullName } = result.data;

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
        fullName,
        coins: 100,
      });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { email, password } = result.data;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!user.password) {
        return res.status(401).json({ error: "Please login with your social account" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/google", async (req, res) => {
    try {
      const { googleId, email, fullName, profileImage } = req.body;
      
      if (!googleId || !email) {
        return res.status(400).json({ error: "Google ID and email are required" });
      }

      let user = await storage.getUserByGoogleId(googleId);
      
      if (!user) {
        user = await storage.getUserByEmail(email);
        if (user) {
          user = await storage.updateUser(user.id, { googleId, authProvider: "google" as any });
        } else {
          const username = email.split("@")[0] + "_" + Math.random().toString(36).substring(2, 7);
          user = await storage.createUser({
            email,
            username,
            googleId,
            fullName,
            profileImage,
            authProvider: "google" as any,
            coins: 100,
          });
        }
      }

      if (!user) {
        return res.status(500).json({ error: "Failed to create user" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ error: "Google login failed" });
    }
  });

  app.post("/api/auth/facebook", async (req, res) => {
    try {
      const { facebookId, email, fullName, profileImage } = req.body;
      
      if (!facebookId || !email) {
        return res.status(400).json({ error: "Facebook ID and email are required" });
      }

      let user = await storage.getUserByFacebookId(facebookId);
      
      if (!user) {
        user = await storage.getUserByEmail(email);
        if (user) {
          user = await storage.updateUser(user.id, { facebookId, authProvider: "facebook" as any });
        } else {
          const username = email.split("@")[0] + "_" + Math.random().toString(36).substring(2, 7);
          user = await storage.createUser({
            email,
            username,
            facebookId,
            fullName,
            profileImage,
            authProvider: "facebook" as any,
            coins: 100,
          });
        }
      }

      if (!user) {
        return res.status(500).json({ error: "Failed to create user" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Facebook login error:", error);
      res.status(500).json({ error: "Facebook login failed" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ success: true, message: "If an account exists, a reset link has been sent" });
      }

      if (user.authProvider !== "email") {
        return res.status(400).json({ error: "Please login with your social account" });
      }

      const crypto = await import("crypto");
      const token = crypto.randomBytes(32).toString("hex");
      await storage.createPasswordResetToken(user.id, token);

      res.json({ 
        success: true, 
        message: "Password reset instructions sent to your email",
        resetToken: token,
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      if (resetToken.usedAt) {
        return res.status(400).json({ error: "Reset token already used" });
      }

      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ error: "Reset token has expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(resetToken.userId, { password: hashedPassword });
      await storage.markPasswordResetTokenUsed(resetToken.id);

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.put("/api/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.updateUser(req.user!.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.post("/api/subscription", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { tier } = req.body;
      const validTiers = ["bronze", "silver", "gold", "platinum"];
      
      if (!tier || !validTiers.includes(tier)) {
        return res.status(400).json({ error: "Invalid subscription tier" });
      }

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const user = await storage.updateUser(req.user!.id, {
        subscriptionTier: tier,
        subscriptionExpiresAt: expiresAt,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await storage.createTransaction({
        userId: req.user!.id,
        amount: tier === "bronze" ? -499 : tier === "silver" ? -999 : tier === "gold" ? -1999 : -2999,
        type: "subscription",
        description: `Subscribed to ${tier.toUpperCase()} plan`,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.delete("/api/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteUser(req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  app.get("/api/dreams", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const dreams = await storage.getDreams(req.user!.id);
      res.json(dreams);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dreams" });
    }
  });

  app.post("/api/dreams", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const dream = await storage.createDream({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(dream);
    } catch (error) {
      res.status(500).json({ error: "Failed to create dream" });
    }
  });

  app.get("/api/dreams/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const id = req.params.id as string;
      const dream = await storage.getDream(id);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }
      res.json(dream);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dream" });
    }
  });

  app.put("/api/dreams/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const id = req.params.id as string;
      const dream = await storage.updateDream(id, req.body);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }
      res.json(dream);
    } catch (error) {
      res.status(500).json({ error: "Failed to update dream" });
    }
  });

  app.delete("/api/dreams/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const id = req.params.id as string;
      await storage.deleteDream(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dream" });
    }
  });

  app.get("/api/connections", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const connections = await storage.getConnections(req.user!.id);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to get connections" });
    }
  });

  app.post("/api/connections/:userId/follow", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const targetUserId = req.params.userId as string;
      const isAlreadyFollowing = await storage.isFollowing(req.user!.id, targetUserId);
      if (isAlreadyFollowing) {
        return res.status(400).json({ error: "Already following" });
      }
      await storage.createConnection(req.user!.id, targetUserId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to follow user" });
    }
  });

  app.delete("/api/connections/:userId/unfollow", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const targetUserId = req.params.userId as string;
      await storage.deleteConnection(req.user!.id, targetUserId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to unfollow user" });
    }
  });

  app.get("/api/conversations", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const conversations = await storage.getConversations(req.user!.id);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  app.get("/api/messages", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const messages = await storage.getMessages(req.user!.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.get("/api/messages/:userId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const targetUserId = req.params.userId as string;
      const messages = await storage.getConversation(req.user!.id, targetUserId);
      await storage.markAllMessagesRead(req.user!.id, targetUserId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversation" });
    }
  });

  app.post("/api/messages", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const message = await storage.createMessage({
        ...req.body,
        senderId: req.user!.id,
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.put("/api/messages/read-all", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { otherUserId } = req.body;
      if (otherUserId) {
        await storage.markAllMessagesRead(req.user!.id, otherUserId);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  app.get("/api/notifications", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const notifications = await storage.getNotifications(req.user!.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to get notifications" });
    }
  });

  app.put("/api/notifications/:id/read", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const id = req.params.id as string;
      await storage.markNotificationRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.put("/api/notifications/read-all", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.markAllNotificationsRead(req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.get("/api/wallet", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      const transactions = await storage.getTransactions(req.user!.id);
      res.json({
        coins: user?.coins || 0,
        trophies: user?.trophies || 0,
        awards: user?.awards || 0,
        transactions,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get wallet" });
    }
  });

  app.post("/api/wallet/spin", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const today = new Date().toDateString();
      const lastSpinDate = user.lastSpinDate ? new Date(user.lastSpinDate).toDateString() : null;
      let spinsLeft = user.dailySpinsLeft || 0;

      if (lastSpinDate !== today) {
        spinsLeft = 3;
      }

      if (spinsLeft <= 0) {
        return res.status(400).json({ error: "No spins left today" });
      }

      const prizes = [10, 25, 50, 100, 200, 500];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];

      await storage.updateUser(user.id, {
        coins: (user.coins || 0) + prize,
        dailySpinsLeft: spinsLeft - 1,
        lastSpinDate: new Date(),
      });

      await storage.createTransaction({
        userId: user.id,
        amount: prize,
        type: "spin",
        description: `Won ${prize} coins from lucky spin`,
      });

      res.json({ prize, spinsLeft: spinsLeft - 1 });
    } catch (error) {
      res.status(500).json({ error: "Failed to spin" });
    }
  });

  app.get("/api/champions", async (req, res) => {
    try {
      const { tier, year } = req.query;
      const champions = await storage.getChampions(
        tier as string | undefined,
        year ? parseInt(year as string) : undefined
      );
      res.json(champions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get champions" });
    }
  });

  app.get("/api/wall-of-fame", async (req, res) => {
    try {
      const { period } = req.query;
      const users = await storage.getWallOfFame(period as string || "all");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get wall of fame" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { limit } = req.query;
      const users = await storage.getLeaderboard(limit ? parseInt(limit as string) : 10);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.get("/api/gallery", async (req, res) => {
    try {
      const posts = await storage.getGalleryPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery" });
    }
  });

  app.post("/api/gallery", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const post = await storage.createGalleryPost({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create gallery post" });
    }
  });

  app.get("/api/news-feed", async (req, res) => {
    try {
      const posts = await storage.getNewsFeed();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get news feed" });
    }
  });

  app.post("/api/news-feed", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const post = await storage.createNewsFeedPost({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.post("/api/news-feed/:id/like", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const postId = req.params.id as string;
      await storage.likePost(postId, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  app.get("/api/market", async (req, res) => {
    try {
      const { category } = req.query;
      const items = await storage.getMarketItems(category as string | undefined);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get market items" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = req.params.id as string;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
