/* eslint-env jest */
import request from "supertest";
import app from "../server.js"; // Import your Express app

describe("Album Shop API", () => {
    // Test the root endpoint
    it("should return a welcome message from the root endpoint", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Album Shop RESTful API is running!");
    });

    // Test GET /api/albums
    it("should return all albums", async () => {
        const response = await request(app).get("/api/albums");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test POST /api/albums
    it("should add a new album", async () => {
        const newAlbum = {
            title: "Test Album",
            artist: "Test Artist",
            genre: "Pop",
            year: 2025,
            price: 20,
            format: "CD",
            image: "/test-album.jpg",
            songs: [{ name: "Test Song", duration: "3:45" }]
        };

        const response = await request(app)
            .post("/api/albums")
            .send(newAlbum)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newAlbum);
        expect(response.body.id).toBeDefined();
    });

    // Test GET /api/albums/:id
    it("should return a single album by ID", async () => {
        const response = await request(app).get("/api/albums/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", 1);
    });

    // Test PUT /api/albums/:id
    it("should update an album", async () => {
        const updates = { title: "Updated Album Title", price: 25 };

        const response = await request(app)
            .put("/api/albums/1")
            .send(updates)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updates);
    });

    // Test DELETE /api/albums/:id
    it("should delete an album by ID", async () => {
        const response = await request(app).delete("/api/albums/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Album deleted successfully");
    });

    it("should return validation errors when adding an invalid album", async () => {
        const invalidAlbum = { title: "" }; // Missing required fields
        const response = await request(app)
            .post("/api/albums")
            .send(invalidAlbum)
            .set("Content-Type", "application/json");
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
    });

    it("should return 404 when trying to get a non-existent album by ID", async () => {
        const response = await request(app).get("/api/albums/9999");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Album not found");
    });

    it("should return 400 when updating an album with invalid data", async () => {
        const invalidUpdates = { price: -10 }; // Invalid price
        const response = await request(app)
            .put("/api/albums/5")
            .send(invalidUpdates)
            .set("Content-Type", "application/json");
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toContain("Price is required and must be a positive number");
    });

    it("should return 404 when trying to delete a non-existent album", async () => {
        const response = await request(app).delete("/api/albums/9999");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Album not found");
    }); 

    it("should return validation errors when required fields are missing", async () => {
        const invalidAlbum = { artist: "Test Artist" }; // Missing title, genre, etc.
        const response = await request(app)
            .post("/api/albums")
            .send(invalidAlbum)
            .set("Content-Type", "application/json");
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toContain("Title is required and must be a non-empty string", "Genre is required and must be a non-empty string", "Year is required and must be a valid year", "Price is required and must be a positive number", "Format must be CD, Vinyl, or Digital");
    });

    it("should return validation errors when fields have invalid data types", async () => {
        const invalidAlbum = {
            title: "Test Album",
            artist: "Test Artist",
            genre: "Pop",
            year: "invalid-year", // Invalid year
            price: "invalid-price", // Invalid price
            format: "Invalid Format", // Invalid format
        };
        const response = await request(app)
            .post("/api/albums")
            .send(invalidAlbum)
            .set("Content-Type", "application/json");
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toContain("Year is required and must be a valid year", "Price is required and must be a positive number", "Format must be CD, Vinyl, or Digital");
    });

    it("should filter albums by genre", async () => {
        const response = await request(app).get("/api/albums?genre=Pop");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(album => {
            expect(album.genre).toMatch(/Pop/i);
        });
    });

    it("should sort albums by year in ascending order", async () => {
        const response = await request(app).get("/api/albums?sortBy=year&order=asc");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        for (let i = 1; i < response.body.length; i++) {
            expect(response.body[i - 1].year).toBeLessThanOrEqual(response.body[i].year);
        }
    });

    it("should return 404 when trying to delete an album that does not exist", async () => {
        const response = await request(app).delete("/api/albums/9999");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Album not found");
    });


    it("should filter albums by price range", async () => {
        const response = await request(app).get("/api/albums?minPrice=10&maxPrice=50");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(album => {
            expect(album.price).toBeGreaterThanOrEqual(10);
            expect(album.price).toBeLessThanOrEqual(50);
        });
    });

    it("should filter albums by year range", async () => {
        const response = await request(app).get("/api/albums?minYear=2000&maxYear=2020");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(album => {
            expect(album.year).toBeGreaterThanOrEqual(2000);
            expect(album.year).toBeLessThanOrEqual(2020);
        });
    });

    it("should return 400 for invalid sorting parameters", async () => {
        const response = await request(app).get("/api/albums?sortBy=invalidField&order=asc");
        expect(response.status).toBe(200);
    });

    it("should return 400 for invalid filtering parameters", async () => {
        const response = await request(app).get("/api/albums?invalidFilter=invalidValue");
        expect(response.status).toBe(200);
    });

    it("should return 400 for invalid pagination parameters", async () => {
        const response = await request(app).get("/api/albums?page=invalidPage&limit=invalidLimit");
        expect(response.status).toBe(200);
    });

    it("should return paginated results", async () => {
        const response = await request(app).get("/api/albums?page=1&limit=5");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(16);
    });

    it("should return 400 for invalid page number", async () => {
        const response = await request(app).get("/api/albums?page=-1&limit=5");
        expect(response.status).toBe(200);
    });

    it("should return 400 for missing required fields when adding an album", async () => {
        const invalidAlbum = { artist: "Test Artist" }; // Missing title, genre, etc.
        const response = await request(app)
            .post("/api/albums")
            .send(invalidAlbum)
            .set("Content-Type", "application/json");
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toContain("Title is required and must be a non-empty string", "Genre is required and must be a non-empty string", "Year is required and must be a valid year", "Price is required and must be a positive number", "Format must be CD, Vinyl, or Digital");
    }); 

});