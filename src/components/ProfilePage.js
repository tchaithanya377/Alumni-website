import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Import Firebase configuration
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa'; // Icons for edit and save buttons

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [updatedUser, setUpdatedUser] = useState({}); // Store updated user data
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
      if (loggedInUser) {
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : null;

        // Fetch user's posts
        const postsQuery = query(collection(db, 'posts'), where('userId', '==', loggedInUser.uid));
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUser({ ...loggedInUser, ...userData });
        setPosts(userPosts);
        setUpdatedUser({ ...loggedInUser, ...userData }); // Store initial data for editing
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle editing
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);

      // Only include fields that are safe for Firestore
      const { fullName, employment, country, degree, department, graduationYear, jobLocation, permanentLocation } = updatedUser;

      const userDataToUpdate = {
        fullName,
        employment,
        country,
        degree,
        department,
        graduationYear,
        jobLocation,
        permanentLocation,
      };

      await updateDoc(userDocRef, userDataToUpdate);

      // Update local state
      setUser((prevUser) => ({
        ...prevUser,
        ...userDataToUpdate,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setUpdatedUser(user); // Reset to original user data
    setIsEditing(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto max-w-3xl bg-white shadow-lg p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6">Profile</h1>

        {/* Profile Info */}
        <div className="flex items-center justify-center mb-8">
          <img
            src={user.profilePhotoURL || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mr-6"
          />
          <div className="flex-grow">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={updatedUser.fullName}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, fullName: e.target.value })}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={updatedUser.employment}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, employment: e.target.value })}
                  placeholder="Employment"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold">{user.fullName || 'Anonymous'}</h2>
                <p className="text-gray-600">{user.employment || 'No Employment Info'}</p>
              </div>
            )}
          </div>

          {/* Edit/Save Button */}
          {isEditing ? (
            <div className="space-x-2">
              <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                <FaCheck />
              </button>
              <button onClick={handleCancel} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                <FaTimes />
              </button>
            </div>
          ) : (
            <button onClick={handleEdit} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              <FaEdit />
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold">Details</h3>
            <p><strong>Country:</strong> {isEditing ? <input type="text" className="border p-2 rounded w-full" value={updatedUser.country} onChange={(e) => setUpdatedUser({ ...updatedUser, country: e.target.value })} /> : user.country || 'N/A'}</p>
            <p><strong>Degree:</strong> {isEditing ? <input type="text" className="border p-2 rounded w-full" value={updatedUser.degree} onChange={(e) => setUpdatedUser({ ...updatedUser, degree: e.target.value })} /> : user.degree || 'N/A'}</p>
            <p><strong>Department:</strong> {isEditing ? <input type="text" className="border p-2 rounded w-full" value={updatedUser.department} onChange={(e) => setUpdatedUser({ ...updatedUser, department: e.target.value })} /> : user.department || 'N/A'}</p>
            <p><strong>Graduation Year:</strong> {isEditing ? <input type="text" className="border p-2 rounded w-full" value={updatedUser.graduationYear} onChange={(e) => setUpdatedUser({ ...updatedUser, graduationYear: e.target.value })} /> : user.graduationYear || 'N/A'}</p>
            <p><strong>Job Location:</strong> {isEditing ? <input type="text" className="border p-2 rounded w-full" value={updatedUser.jobLocation} onChange={(e) => setUpdatedUser({ ...updatedUser, jobLocation: e.target.value })} /> : user.jobLocation || 'N/A'}</p>
            <p><strong>Permanent Location:</strong> {isEditing ? <input type="text" className="border p-2 rounded w-full" value={updatedUser.permanentLocation} onChange={(e) => setUpdatedUser({ ...updatedUser, permanentLocation: e.target.value })} /> : user.permanentLocation || 'N/A'}</p>
          </div>

          {/* Display User's Posts */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Your Posts</h3>
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="bg-gray-100 p-4 mb-4 rounded-lg">
                  <h4 className="text-xl font-semibold">{post.title}</h4>
                  <p className="text-gray-700">{post.description}</p>
                  {post.fileUrl && (
                    post.fileUrl.endsWith('.pdf') ? (
                      <a
                        href={post.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View PDF
                      </a>
                    ) : post.fileUrl.endsWith('.mp4') || post.fileUrl.endsWith('.webm') || post.fileUrl.endsWith('.ogg') ? (
                      <video controls className="w-full mt-4">
                        <source src={post.fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={post.fileUrl} alt="Post" className="mt-4 w-full h-auto rounded-lg" />
                    )
                  )}
                </div>
              ))
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
