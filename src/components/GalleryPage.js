import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase config

const GalleryPage = () => {
  const [mediaFiles, setMediaFiles] = useState([]);

  // Fetch media files (images and videos) from the 'gallery' collection in Firestore
  useEffect(() => {
    const fetchMediaFiles = async () => {
      const galleryCollection = collection(db, 'gallery'); // Fetching from 'gallery' collection
      const gallerySnapshot = await getDocs(galleryCollection);

      // Extract media files from Firestore
      const mediaItems = gallerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMediaFiles(mediaItems);
    };

    fetchMediaFiles();
  }, []);

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center py-10 px-6">
      <div className="max-w-7xl w-full bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Gallery</h1>

        {/* Display media files in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaFiles.length > 0 ? (
            mediaFiles.map((media, index) => (
              <div key={index} className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                {media.fileType === 'video' ? (
                  <video controls className="w-full h-64 object-cover">
                    <source src={media.fileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={media.fileUrl}
                    alt={media.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{media.title}</h3>
                  <p className="text-gray-500">{media.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No media available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
