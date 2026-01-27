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
