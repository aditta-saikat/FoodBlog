import { useState } from 'react';
import ReviewCard from './ReviewCard';
import NewReviewModal from './NewReviewModal';
import { User, PlusCircle } from 'lucide-react';
import { createBlog } from '../../lib/api/Blog';

const ReviewList = ({
  reviews,
  loading,
  viewMode,
  currentUser,
  showComments,
  toggleLike,
  toggleCommentSection,
  handleDeleteReview,
  filter,
  searchTerm
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);


  const handleCreateReview = async (formData, images) => {
    try {
      const newBlog = await createBlog(formData, images);
      setLocalReviews([newBlog, ...localReviews]);
    } catch (err) {
      throw err; // Let NewReviewModal handle the error
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              viewMode={viewMode}
              currentUser={currentUser}
              showComments={showComments}
              toggleLike={toggleLike}
              toggleCommentSection={toggleCommentSection}
              handleDeleteReview={handleDeleteReview}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
            <User size={32} className="text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews found</h3>
          <p className="mt-2 text-gray-500">
            {filter === 'my'
              ? "You haven't created any reviews yet."
              : searchTerm
                ? `No reviews matching "${searchTerm}"`
                : "No reviews available at the moment."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center mx-auto"
          >
            <PlusCircle size={18} className="mr-2" />
            Create First Review
          </button>
        </div>
      )}
      <NewReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateReview}
      />
    </>
  );
};

export default ReviewList;