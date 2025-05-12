import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Edit, Trash2, Star, Image, Calendar, MapPin } from 'lucide-react';
import { getCommentsByBlog, createComment, deleteComment } from '../../lib/api/Comment';
import { toggleLike, getLikesCount, hasLiked } from '../../lib/api/Like';

const ReviewCard = ({
  review,
  viewMode,
  currentUser,
  showComments,
  toggleCommentSection,
  handleDeleteReview
}) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(review.totalLikes || 0);
  const [hasUserLiked, setHasUserLiked] = useState(review.hasLiked || false);
  
  useEffect(() => {
    if (showComments[review._id]) {
      const fetchComments = async () => {
        setLoadingComments(true);
        try {
          const data = await getCommentsByBlog(review._id);
          setComments(data);
        } catch (err) {
          console.error('Error fetching comments:', err);
        } finally {
          setLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [showComments, review._id]);




  const handleToggleLike = async () => {
    if (!currentUser) return;
    try {
      await toggleLike(review._id);
      const newHasLiked = await hasLiked(review._id);
      const newLikeCount = await getLikesCount(review._id);
      setHasUserLiked(newHasLiked);
      setLikeCount(newLikeCount);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const navigateToDetails = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/reviews/${review._id}`);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-xs font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer ${
        viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
      }`}
      onClick={navigateToDetails}
    >
      <div className={viewMode === 'list' ? 'md:w-1/3' : ''}>
        <div className="relative aspect-video">
          <img
            src={review.images[0] || '/api/placeholder/400/320'}
            alt={review.title}
            className="h-full w-full object-cover"
          />
          {review.isFeatured && (
            <div className="absolute top-3 left-3 bg-primary-500 text-xs font-bold px-2 py-1 rounded-full text-white">
              Featured
            </div>
          )}
          {review.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-xs font-medium px-2 py-1 rounded-full text-white flex items-center">
              <Image size={12} className="mr-1" />
              +{review.images.length - 1}
            </div>
          )}
        </div>
      </div>
      <div className={`p-4 flex flex-col ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{review.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <span className="font-medium text-gray-700">{review.restaurant}</span>
              {review.location && (
                <>
                  <span className="mx-1">•</span>
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {review.location}
                  </span>
                </>
              )}
            </div>
            <StarRating rating={review.rating} />
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{review.content}</p>
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {review.tags.map(tag => (
              <span
                key={tag}
                className="bg-primary-500 text-white font-semibold text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={review.author.avatarUrl || '/api/placeholder/32/32'}
                alt={review.author.username}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-xs font-medium text-gray-700">{review.author.username}</span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar size={12} className="mr-1" />
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleToggleLike}
                disabled={!currentUser}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-1"
              >
                <Heart
                  size={16}
                  className={hasUserLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
                <span className="text-xs text-gray-500">{likeCount}</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCommentSection(review._id);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-1"
              >
                <MessageCircle size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">{review.comments.length}</span>
              </button>
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Share2 size={16} className="text-gray-400" />
              </button>
              {review.author._id === currentUser?._id && (
                <>
                  <button 
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Edit size={16} className="text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteReview(review._id);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Trash2 size={16} className="text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;