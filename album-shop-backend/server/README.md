# Album Shop RESTful API

A RESTful API for managing an album shop with in-memory data storage.

## Features

- CRUD operations for albums
- Filtering and sorting capabilities
- Data validation
- CORS support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Server

```bash
# Start the server
npm start
# or
yarn start

# Start with nodemon for development
npm run dev
# or
yarn dev
```

The server will start on port 5000 by default.

## API Endpoints

### Get All Albums

```
GET /api/albums
```

Query Parameters:
- `genre`: Filter by genre (case-insensitive partial match)
- `artist`: Filter by artist (case-insensitive partial match)
- `format`: Filter by format (exact match: CD, Vinyl, Digital)
- `minPrice`: Filter by minimum price
- `maxPrice`: Filter by maximum price
- `minYear`: Filter by minimum year
- `maxYear`: Filter by maximum year
- `sortBy`: Sort by field (title, artist, genre, year, price)
- `order`: Sort order (asc, desc)

Example:
```
GET /api/albums?genre=Pop&minPrice=20&sortBy=price&order=desc
```

### Get Album by ID

```
GET /api/albums/:id
```

Example:
```
GET /api/albums/1
```

### Create Album

```
POST /api/albums
```

Request Body:
```json
{
  "title": "Album Title",
  "artist": "Artist Name",
  "genre": "Genre",
  "year": 2024,
  "price": 29.99,
  "format": "CD",
  "image": "path/to/image.jpg",
  "songs": [
    {
      "name": "Song Title",
      "duration": "3:45"
    }
  ]
}
```

### Update Album

```
PUT /api/albums/:id
```

Request Body (partial updates allowed):
```json
{
  "price": 34.99,
  "format": "Vinyl"
}
```

### Delete Album

```
DELETE /api/albums/:id
```

## Data Validation

The API validates the following fields:
- `title`: Required, non-empty string
- `artist`: Required, non-empty string
- `genre`: Required, non-empty string
- `year`: Required, valid year (between 1900 and current year + 1)
- `price`: Required, positive number
- `format`: Required, must be one of: CD, Vinyl, Digital

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 404: Not Found

Error responses include a message or array of validation errors. 