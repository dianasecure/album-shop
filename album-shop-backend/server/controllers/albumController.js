// Debug logging setup
const DEBUG = true;
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const log = (message, data = null) => {
    if (DEBUG) {
        console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
        if (data) console.log(data);
    }
};


// Validation function for album data
function validateAlbum(album) {
    log('Validating album data:', album);
    const errors = [];
    
    if (!album.title || typeof album.title !== 'string' || album.title.trim() === '') {
        errors.push('Title is required and must be a non-empty string');
    }
    
    if (!album.artist || typeof album.artist !== 'string' || album.artist.trim() === '') {
        errors.push('Artist is required and must be a non-empty string');
    }
    
    if (!album.genre || typeof album.genre !== 'string' || album.genre.trim() === '') {
        errors.push('Genre is required and must be a non-empty string');
    }
    
    if (!album.year || isNaN(album.year) || album.year < 1900 || album.year > new Date().getFullYear() + 1) {
        errors.push('Year is required and must be a valid year');
    }
    
    if (!album.price || isNaN(album.price) || album.price <= 0) {
        errors.push('Price is required and must be a positive number');
    }
    
    if (!album.format || !['CD', 'Vinyl', 'Digital'].includes(album.format)) {
        errors.push('Format must be CD, Vinyl, or Digital');
    }
    
    if (errors.length > 0) {
        log('Validation errors found:', errors);
    } else {
        log('Album validation successful');
    }
    
    return errors;
}

// Get all albums with filtering and sorting
export async function getAlbums(req, res) {
    const filters = {};
    const { genre, artist, format, minPrice, maxPrice, minYear, maxYear, sortBy, order } = req.query;

    if (genre) filters.genre = { contains: genre, mode: 'insensitive' };
    if (artist) filters.artist = { contains: artist, mode: 'insensitive' };
    if (format) filters.format = format;
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.gte = parseFloat(minPrice);
        if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }
    if (minYear || maxYear) {
        filters.year = {};
        if (minYear) filters.year.gte = parseInt(minYear);
        if (maxYear) filters.year.lte = parseInt(maxYear);
    }

    const albums = await prisma.album.findMany({
        where: filters,
        include: { songs: true, image: true },
        orderBy: sortBy ? { [sortBy]: order === 'desc' ? 'desc' : 'asc' } : undefined
    });

    res.json(albums);
}


// Get a single album by ID
export async function getAlbumById(req, res) {
    const { id } = req.params;

    const album = await prisma.album.findUnique({
        where: { id: Number(id) },
        include: { songs: true, image: true }
    });

    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }

    res.json(album);
}


// Add a new album
export async function addAlbum(req, res) {
    const { title, artist, genre, year, price, format, image, songs } = req.body;

    try {
        const newAlbum = await prisma.album.create({
            data: {
                title,
                artist,
                genre,
                year: Number(year),
                price: parseFloat(price),
                format,
                image: {
                    create: image?.map(url => ({ url })) || []
                },
                songs: {
                    create: songs?.map(song => ({
                        name: song.name,
                        duration: song.duration
                    })) || []
                }
            },
            include: { image: true, songs: true }
        });

        res.status(201).json(newAlbum);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to create album" });
    }
}


// Update an album
export async function updateAlbum(req, res) {
    const { id } = req.params;
    const { title, artist, genre, year, price, format, image, songs } = req.body;

    try {
        const updated = await prisma.album.update({
            where: { id: Number(id) },
            data: {
                title,
                artist,
                genre,
                year,
                price,
                format,
                image: image ? {
                    deleteMany: {},
                    create: image.map(url => ({ url }))
                } : undefined,
                // To update songs properly, you'd likely delete old and recreate
                songs: songs ? {
                    deleteMany: {},
                    create: songs.map(song => ({
                        name: song.name,
                        duration: song.duration
                    }))
                } : undefined
            },
            include: { songs: true }
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to update album" });
    }
}


// Delete an album
export async function deleteAlbum(req, res) {
    const { id } = req.params;

    try {
        await prisma.album.delete({
            where: { id: Number(id) }
        });

        res.json({ message: "Album deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Album not found or already deleted" });
    }
}

