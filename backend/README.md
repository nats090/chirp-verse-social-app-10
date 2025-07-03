
# Social Media Backend

This is the backend API for the social media MERN application.

## Setup Instructions

1. Install dependencies:
```bash
cd backend
npm install
```

2. Environment Variables:
- The `.env` file is already configured with your MongoDB connection string
- Make sure to change the JWT_SECRET in production

3. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Posts
- GET `/api/posts` - Get all posts
- POST `/api/posts` - Create a new post (requires auth)
- PUT `/api/posts/:id` - Update a post (requires auth)
- DELETE `/api/posts/:id` - Delete a post (requires auth)
- PUT `/api/posts/:id/like` - Like/unlike a post (requires auth)
- POST `/api/posts/:id/comments` - Add comment to post (requires auth)
- GET `/api/posts/:id/comments` - Get comments for a post

### Users
- GET `/api/users/profile` - Get user profile (requires auth)
- PUT `/api/users/profile` - Update user profile (requires auth)
- GET `/api/users/posts` - Get user's posts (requires auth)

## Database Schema

### User
- username (required, unique)
- email (required, unique)
- password (required, hashed)
- bio (optional)
- profileImage (optional)
- followersCount (default: 0)
- followingCount (default: 0)
- postsCount (default: 0)

### Post
- author (username)
- authorId (User ObjectId)
- content (required, max 280 chars)
- likes (default: 0)
- likedBy (array of User ObjectIds)
- comments (array of comment objects)
- timestamp

### Comment
- author (username)
- content (required, max 200 chars)
- timestamp

## Notes

- All protected routes require JWT token in Authorization header
- Passwords are hashed using bcrypt
- MongoDB connection string is already configured
- CORS is enabled for frontend integration
