import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="relative bg-primary-700">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="Food background"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Share Your Food Experience
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-indigo-100">
            Discover new restaurants, share your culinary experiences, and connect with fellow food enthusiasts.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {currentUser ? (
              <Link to="/dashboard" className="btn btn-primary px-8 py-3 text-base font-medium rounded-md shadow">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                  Join Now
                </Link>
                <Link to="/login" className="flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything for Food Lovers
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Our platform offers everything you need to document and share your culinary journey.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Create Reviews</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Share your dining experiences with detailed reviews, ratings, and photos to help others discover great food.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Engage with Community</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Comment on reviews, follow other foodies, and join discussions about the latest culinary trends.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Discover New Places</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Find hidden gems and popular spots with our curated recommendations and personalized feed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2025 FoodCritic, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;