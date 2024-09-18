import axios from 'axios';
import { Video, Category } from '../types/video';

const API_KEY = process.env.YOUTUBE_API_KEY;
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

interface YouTubeApiResponse {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: { url: string; width: number; height: number };
      };
      channelTitle: string;
      publishTime: string;
    };
  }[];
}

export async function fetchVideos(category: Category, maxResults: number = 100): Promise<Video[]> {
  try {
    const response = await axios.get<YouTubeApiResponse>(API_URL, {
      params: {
        part: 'snippet',
        maxResults,
        q: category,
        type: 'video',
        videoDuration: 'long',
        key: API_KEY,
      },
    });

    return response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishTime: item.snippet.publishTime,
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}