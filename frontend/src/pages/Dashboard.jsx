import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllBlogs } from "../lib/api/Blog";
import Navbar from "../components/Navbar/Navbar";
import Header from "../components/Dashboard/Header";
import ActionBar from "../components/Dashboard/ActionBar";
import ReviewList from "../components/Dashboard/ReviewList";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs(filter);
        setReviews(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filter]);

  const onReviewCreated = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const toggleLike = async (reviewId) => {
    try {
      setReviews(
        reviews.map((review) => {
          if (review._id === reviewId) {
            const userAlreadyLiked = review.likes.some(
              (like) => like._id === currentUser._id,
            );
            if (userAlreadyLiked) {
              return {
                ...review,
                likes: review.likes.filter(
                  (like) => like._id !== currentUser._id,
                ),
              };
            } else {
              return {
                ...review,
                likes: [
                  ...review.likes,
                  { _id: currentUser._id, username: currentUser.username },
                ],
              };
            }
          }
          return review;
        }),
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const toggleCommentSection = (reviewId) => {
    setShowComments({
      ...showComments,
      [reviewId]: !showComments[reviewId],
    });
  };

  const handleAddComment = async (reviewId) => {
    if (!newComment.trim()) return;

    try {
      const commentToAdd = {
        _id: `temp-${Date.now()}`,
        text: newComment,
        user: {
          username: currentUser.username,
          avatar:
            currentUser.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3",
        },
        createdAt: new Date().toISOString(),
      };

      setReviews(
        reviews.map((review) => {
          if (review._id === reviewId) {
            return {
              ...review,
              comments: [...review.comments, commentToAdd],
            };
          }
          return review;
        }),
      );

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (
      searchTerm &&
      !review.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !review.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !review.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !review.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Header
        currentUser={currentUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ActionBar
          filter={filter}
          setFilter={setFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onReviewCreated={onReviewCreated}
        />
        <ReviewList
          reviews={filteredReviews}
          loading={loading}
          viewMode={viewMode}
          currentUser={currentUser}
          showComments={showComments}
          toggleLike={toggleLike}
          toggleCommentSection={toggleCommentSection}
          handleDeleteReview={handleDeleteReview}
          handleAddComment={handleAddComment}
          newComment={newComment}
          setNewComment={setNewComment}
          filter={filter}
          searchTerm={searchTerm}
        />
      </div>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            © 2025 FoodCritic, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;