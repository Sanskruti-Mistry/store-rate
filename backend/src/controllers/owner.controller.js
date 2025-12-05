// src/controllers/owner.controller.js
const prisma = require("../config/prisma");

// GET /owner/my-store
async function getMyStore(req, res) {
  try {
    const ownerId = req.user.id;

    // Find store for this owner
    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: {
        ratings: {
          select: { value: true },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ error: "No store found for this owner" });
    }

    const ratings = store.ratings || [];
    const avgRating =
      ratings.length === 0
        ? null
        : ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

    const { ratings: _, ...rest } = store;

    return res.json({
      ...rest,
      avgRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("getMyStore error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /owner/my-store/ratings
async function getMyStoreRatings(req, res) {
  try {
    const ownerId = req.user.id;

    // Make sure owner has a store
    const store = await prisma.store.findFirst({
      where: { ownerId },
    });

    if (!store) {
      return res.status(404).json({ error: "No store found for this owner" });
    }

    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNumber = parseInt(page) || 1;
    const perPage = parseInt(pageSize) || 10;
    const skip = (pageNumber - 1) * perPage;
    const orderDirection = sortOrder === "asc" ? "asc" : "desc";

    let orderBy = {};
    if (sortBy === "value") {
      orderBy = { value: orderDirection };
    } else if (sortBy === "createdAt") {
      orderBy = { createdAt: orderDirection };
    } else {
      orderBy = { createdAt: "desc" };
    }

    const [totalCount, ratings] = await Promise.all([
      prisma.rating.count({
        where: { storeId: store.id },
      }),
      prisma.rating.findMany({
        where: { storeId: store.id },
        orderBy,
        skip,
        take: perPage,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return res.json({
      storeId: store.id,
      data: ratings,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize: perPage,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("getMyStoreRatings error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getMyStore,
  getMyStoreRatings,
};
