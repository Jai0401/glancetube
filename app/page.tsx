"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchVideos } from '../utils/youtube';
import { Video } from '../types/video';
import Image from 'next/image';

const VideoItem = React.memo(({ video, playVideo }: { video: Video, playVideo: (id: string) => void }) => (
  <motion.div
    layoutId={video.id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => playVideo(video.id)}
    className="cursor-pointer overflow-hidden rounded-3xl shadow-lg bg-gray-800 relative group aspect-video"
  >
    <Image
      src={video.thumbnail}
      alt=""
      layout="fill"
      objectFit="cover"
      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
    />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity" />
  </motion.div>
));

VideoItem.displayName = 'VideoItem';

export default function Home() {
  const categories = [
    'Science', 'Technology', 'Music', 'Gaming', 'Sports', 
    'Entertainment', 'Education', 'Travel', 'Food', 'Art', 'News'
  ];

  const [videos, setVideos] = useState<Video[]>([]);
  const [category, setCategory] = useState<string>('Science');
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    const fetchedVideos = await fetchVideos(category);
    setVideos(fetchedVideos);
  }, [category]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const playVideo = useCallback((videoId: string) => {
    setCurrentVideo(videoId);
  }, []);

  function handleVideoEnd() {
    setCurrentVideo(null);
  }

  const memoizedVideos = useMemo(() => 
    videos.map(video => (
      <VideoItem key={video.id} video={video} playVideo={playVideo} />
    )),
    [videos, playVideo]
  );

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <main className="p-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 p-2 bg-gray-900 text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-700"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {memoizedVideos}
        </div>
      </main>

      {currentVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        >
          <div className="w-full max-w-4xl">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1&enablejsapi=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full aspect-video"
              onEnded={handleVideoEnd}
            />
            <button
              onClick={() => setCurrentVideo(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}