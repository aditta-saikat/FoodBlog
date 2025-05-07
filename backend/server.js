// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload")


// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require('./routes/user.routes');
const blogRoutes = require('./routes/blog.routes');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');
// const bookmarkRoutes = require('./routes/bookmark.routes');
const notificationRoutes = require('./routes/notification.routes');
// const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ 
  limits: { fileSize: 32 * 1024 * 1024 }, // 32MB limit (ImageBB max)
  abortOnLimit: true
}));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


app.get("/", (req, res) => res.send("Food Blog API is running..."));
  
// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
// app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin', adminRoutes);





// Server Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
