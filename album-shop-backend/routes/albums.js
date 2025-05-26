import express from "express";
import { 
    getAlbums, 
    getAlbumById, 
    addAlbum, 
    updateAlbum, 
    deleteAlbum 
} from "../controllers/albumController.js";

const router = express.Router();

// GET /api/albums - Get all albums (with filtering and sorting)
router.get("/", getAlbums);

// POST /api/albums - Create a new album
router.post("/", addAlbum);

// GET /api/albums/:id - Get a single album by ID
router.get("/:id", getAlbumById);

// PUT /api/albums/:id - Update an album
router.put("/:id", updateAlbum);

// DELETE /api/albums/:id - Delete an album
router.delete("/:id", deleteAlbum);

export default router;
