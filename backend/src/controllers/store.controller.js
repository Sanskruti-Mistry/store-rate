// src/controllers/store.controller.js
const prisma = require("../config/prisma");
const {
  validateName,
  validateAddress,
  validateEmail,
} = require("../utils/validation");

// GET /stores  (for logged-in users)
async function listStoresForUser(req, res) {
  try {
    const {
      search,
      sortBy = "name",
      sortOrder = "asc",
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

    let orderBy = {};
    const orderDirection = sortOrder === "desc" ? "desc" : "asc";

    if (["name", "email", "createdAt"].includes(sortBy)) {
      orderBy[sortBy] = orderDirection;
    } else {
      orderBy = { name: "asc" };
    }

    const [totalCount, stores] = await Promise.all([
      prisma.store.count({ where }),
      prisma.store.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          ratings: {
            select: { value: true, userId: true },
          },
        },
      }),
    ]);

    const userId = req.user.id;

    const data = stores.map((store) => {
      const ratings = store.ratings || [];
      const avgRating =
        ratings.length === 0
          ? null
          : ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

      const myRatingObj = ratings.find((r) => r.userId === userId);
      const myRating = myRatingObj ? myRatingObj.value : null;

      const { ratings: _, ...rest } = store;
      return { ...rest, avgRating, myRating };
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
    console.error("listStoresForUser error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /stores/:id  (details + avg + my rating)
async function getStoreByIdForUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid store id" });
    }

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        ratings: {
          select: { value: true, userId: true },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const ratings = store.ratings || [];
    const avgRating =
      ratings.length === 0
        ? null
        : ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

    const myRatingObj = ratings.find((r) => r.userId === req.user.id);
    const myRating = myRatingObj ? myRatingObj.value : null;

    const { ratings: _, ...rest } = store;

    return res.json({
      ...rest,
      avgRating,
      myRating,
    });
  } catch (error) {
    console.error("getStoreByIdForUser error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// POST /stores/:id/ratings  (USER rate or update rating)
async function rateStore(req, res) {
  try {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({ error: "Invalid store id" });
    }

    const { value } = req.body;
    const ratingValue = parseInt(value);

    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res
        .status(400)
        .json({ error: "Rating value must be an integer between 1 and 5" });
    }

    // Verify store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const userId = req.user.id;

    // Upsert rating (create or update)
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        value: ratingValue,
      },
      create: {
        value: ratingValue,
        userId,
        storeId,
      },
    });

    // Recalculate avg rating
    const agg = await prisma.rating.aggregate({
      _avg: { value: true },
      where: { storeId },
    });

    const avgRating = agg._avg.value;

    return res.json({
      message: "Rating saved successfully",
      rating: {
        id: rating.id,
        value: rating.value,
        storeId,
        userId,
      },
      avgRating,
    });
  } catch (error) {
    console.error("rateStore error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /stores/:id/my-rating  (USER)
async function getMyRatingForStore(req, res) {
  try {
    const storeId = parseInt(req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({ error: "Invalid store id" });
    }

    const userId = req.user.id;

    const rating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      select: {
        id: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!rating) {
      return res
        .status(404)
        .json({ error: "No rating found for this store by current user" });
    }

    return res.json({
      storeId,
      userId,
      rating,
    });
  } catch (error) {
    console.error("getMyRatingForStore error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  listStoresForUser,
  getStoreByIdForUser,
  rateStore,
  getMyRatingForStore,
};
