// src/controllers/admin.controller.js
const bcrypt = require("bcryptjs");
const { Role } = require("@prisma/client");
const prisma = require("../config/prisma");

const {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
} = require("../utils/validation");

// Helper to map string role to enum safely
function parseRole(roleStr) {
  if (!roleStr) return null;
  const upper = String(roleStr).toUpperCase();
  if (upper === "ADMIN") return Role.ADMIN;
  if (upper === "USER") return Role.USER;
  if (upper === "OWNER") return Role.OWNER;
  return null;
}

// POST /admin/users  (create any role user)
async function createUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ error: addressError });

    const targetRole = parseRole(role);
    if (!targetRole) {
      return res.status(400).json({
        error: "Invalid role. Allowed values: ADMIN, USER, OWNER",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.trim() },
    });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        passwordHash,
        address: address || null,
        role: targetRole,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin createUser error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /admin/users  (list users with filters & sorting)
async function listUsers(req, res) {
  try {
    const {
      search,
      role,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      pageSize = 10,
    } = req.query;

    const pageNumber = parseInt(page) || 1;
    const perPage = parseInt(pageSize) || 10;
    const skip = (pageNumber - 1) * perPage;

    const where = {};

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ];
    }

    if (role) {
      const r = parseRole(role);
      if (!r) {
        return res.status(400).json({
          error: "Invalid role filter. Allowed values: ADMIN, USER, OWNER",
        });
      }
      where.role = r;
    }

    let orderBy = {};
    const orderDirection = sortOrder === "asc" ? "asc" : "desc";

    if (["name", "email", "role", "createdAt"].includes(sortBy)) {
      orderBy[sortBy] = orderDirection;
    } else {
      orderBy = { createdAt: "desc" };
    }

    const [totalCount, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          address: true,
          createdAt: true,
        },
      }),
    ]);

    return res.json({
      data: users,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize: perPage,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Admin listUsers error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /admin/users/:id
async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Admin getUserById error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// POST /admin/stores
async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ error: addressError });

    if (email) {
      const emailError = validateEmail(email);
      if (emailError) return res.status(400).json({ error: emailError });
    }

    let ownerConnect = undefined;

    if (ownerId != null) {
      const id = parseInt(ownerId);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ownerId" });
      }

      const owner = await prisma.user.findUnique({
        where: { id },
      });

      if (!owner) {
        return res.status(400).json({ error: "Owner user not found" });
      }

      if (owner.role !== Role.OWNER) {
        return res
          .status(400)
          .json({ error: "ownerId must belong to a user with role OWNER" });
      }

      ownerConnect = { connect: { id } };
    }

    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        address: address.trim(),
        owner: ownerConnect,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    console.error("Admin createStore error:", error);
    if (error.code === "P2002") {
      // Prisma unique constraint error
      return res.status(409).json({ error: "Store email already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /admin/stores
async function listStores(req, res) {
  try {
    const {
      search,
      ownerId,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      pageSize = 10,
    } = req.query;

    const pageNumber = parseInt(page) || 1;
    const perPage = parseInt(pageSize) || 10;
    const skip = (pageNumber - 1) * perPage;

    const where = {};

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ];
    }

    if (ownerId != null) {
      const id = parseInt(ownerId);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ownerId filter" });
      }
      where.ownerId = id;
    }

    let orderBy = {};
    const orderDirection = sortOrder === "asc" ? "asc" : "desc";

    if (["name", "email", "createdAt"].includes(sortBy)) {
      orderBy[sortBy] = orderDirection;
    } else {
      orderBy = { createdAt: "desc" };
    }

    const [totalCount, stores] = await Promise.all([
      prisma.store.count({ where }),
      prisma.store.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          owner: {
            select: { id: true, name: true, email: true, role: true },
          },
          ratings: {
            select: { value: true },
          },
        },
      }),
    ]);

    // Compute avg rating per store
    const data = stores.map((store) => {
      const ratings = store.ratings || [];
      const avgRating =
        ratings.length === 0
          ? null
          : ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

      const { ratings: _, ...rest } = store;
      return { ...rest, avgRating };
    });

    return res.json({
      data,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize: perPage,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Admin listStores error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /admin/dashboard
async function dashboard(req, res) {
  try {
    const [
      totalUsers,
      totalStores,
      totalRatings,
      adminCount,
      ownerCount,
      userCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.user.count({ where: { role: Role.OWNER } }),
      prisma.user.count({ where: { role: Role.USER } }),
    ]);

    return res.json({
      totalUsers,
      totalStores,
      totalRatings,
      usersByRole: {
        ADMIN: adminCount,
        OWNER: ownerCount,
        USER: userCount,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  createStore,
  listStores,
  dashboard,
};
