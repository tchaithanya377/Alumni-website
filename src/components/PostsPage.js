import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, getDocs, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebase'; // Import your Firebase config
import { onAuthStateChanged } from 'firebase/auth'; // For user authentication
import { FaPlus, FaTimes } from 'react-icons/fa'; // Icons for floating button and modal close

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [currentUser, setCurrentUser] = useState(null); // Store current authenticated user

  // Form states
  const [postType, setPostType] = useState('event');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null); // Single file for image, video, or PDF

  // Fetch authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : null;

        setCurrentUser({ ...user, ...userData });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postList);
    };
    fetchPosts();
  }, []);

  // Handle file upload and return the download URL
  const handleFileUpload = async (file, path) => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {
          // Progress can be handled here if needed
        },
        (error) => {
          console.error("File upload error: ", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.error("User not logged in.");
      return;
    }

    let fileUrl = '';

    // Upload file and get URL (post content)
    if (file) {
      fileUrl = await handleFileUpload(file, 'uploads');
    }

    const newPost = {
      title,
      description,
      timestamp: serverTimestamp(),
      postType,
      fileUrl,
      userId: currentUser.uid, // Store user ID
      fullName: currentUser.fullName || currentUser.email, // Store user's name
      profilePhotoURL: currentUser.profilePhotoURL, // Store profile image URL
    };

    // Add post to Firestore
    await addDoc(collection(db, 'posts'), newPost);

    // Update local state
    setPosts([...posts, newPost]);

    // Reset form
    setTitle('');
    setDescription('');
    setFile(null);
    setIsModalOpen(false); // Close modal after post submission
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center py-10 px-6">
      <div className="max-w-7xl w-full bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Posts</h1>

        {/* Display Posts in Feed */}
        <div className="mb-8 space-y-4">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={post.profilePhotoURL || "https://via.placeholder.com/50"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{post.fullName || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-500">{post.postType}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{post.title}</p>
                <p className="mt-2">{post.description}</p>
                {post.fileUrl && (
                  <div className="mt-4">
                    {post.fileUrl.endsWith(".pdf") ? (
                      <embed
                        src={post.fileUrl}
                        type="application/pdf"
                        className="w-full h-64 object-cover mt-2 rounded-lg"
                      />
                    ) : post.fileUrl.match(/\.(mp4|webm|ogg)$/) ? (
                      <video controls className="w-full h-64 object-cover mt-2 rounded-lg">
                        <source src={post.fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={post.fileUrl}
                        alt="Post Attachment"
                        className="w-full h-64 object-cover mt-2 rounded-lg"
                      />
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>

        {/* Floating "+" Button to Add Post */}
        {currentUser && (
          <button
            className="fixed bottom-10 right-10 bg-accent text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="text-2xl" />
          </button>
        )}

        {/* Modal for Adding a New Post */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2">Post Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="event">Event</option>
                    <option value="job">Job</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter description"
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block mb-2">Upload File (Image/Video/PDF)</label>
                  <input
                    type="file"
                    accept="image/*, video/*, application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;