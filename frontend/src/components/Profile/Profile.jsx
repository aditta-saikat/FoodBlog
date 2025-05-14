import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Edit, Trash2, ArrowLeft, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUser, updateUser, deleteUser } from "../../lib/api/User";
import Navbar from "../Navbar/Navbar";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUser(id);
        setUser(data);
        setFormData({
          username: data.username || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser(id, {
        username: formData.username,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
      });
      setUser(updatedUser);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      if (currentUser?.id === id) {
        logout();
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700">{error || "User not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary-600 hover:underline flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-1" /> Go back
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>

        <div className="bg-primary-700 rounded-xl shadow-sm overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover opacity-30"
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Food background"
              />
            </div>
            <div className="relative p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white border-opacity-40">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* User Info / Form */}
                <div className="flex-1">
                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-white opacity-90 text-sm font-medium mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-transparent rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
                          placeholder="Enter username"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white opacity-90 text-sm font-medium mb-1">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-transparent rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-white opacity-90 text-sm font-medium mb-1">
                          Avatar URL
                        </label>
                        <input
                          type="url"
                          name="avatarUrl"
                          value={formData.avatarUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-transparent rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
                          placeholder="Enter avatar URL"
                        />
                      </div>
                      {error && (
                        <p className="text-red-300 text-sm">{error}</p>
                      )}
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-primary-700 disabled:opacity-50"
                          disabled={!formData.username.trim()}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <h1 className="text-2xl font-bold text-white">
                        {user.username}
                      </h1>
                      <p className="text-white opacity-90">
                        {user.bio || "No bio provided"}
                      </p>
                      <div className="text-white opacity-90">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Joined:</strong> {formatDate(user.createdAt)}</p>
                        <p>
                          <strong>Bookmarks:</strong> {user.bookmarks.length}
                        </p>
                        <p>
                          <strong>Followers:</strong> {user.followers.length}
                        </p>
                        <p>
                          <strong>Following:</strong> {user.following.length}
                        </p>
                      </div>
                      {isOwnProfile && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 bg-primary-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-primary-700"
                          >
                            <Edit size={16} />
                            <span>Edit Profile</span>
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center space-x-2 bg-red-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                            <span>Delete Account</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Confirm Delete
                </h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;