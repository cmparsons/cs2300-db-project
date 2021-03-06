import axios from 'axios';
import stores from '../stores';

axios.interceptors.request.use(
  (config) => {
    const { token } = stores.authStore;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response.status === 401) {
      stores.authStore.logout();
    }

    return Promise.reject(error);
  },
);

export default class RequestLayer {
  getCurrentUser = async () => {
    try {
      const response = await axios.get('/api/users/me');
      return response.data.user;
    } catch (err) {
      throw err;
    }
  };

  fetchAllCommunities = async () => {
    try {
      const response = await axios.get('/api/community');
      return response.data.communities;
    } catch (err) {
      throw err;
    }
  };

  fetchAllPosts = async (filter) => {
    try {
      const response = await axios.get('/api/post', {
        params: {
          filter,
        },
      });
      return response.data.posts;
    } catch (err) {
      throw err;
    }
  };

  fetchPostsForCommunity = async (communityId) => {
    try {
      const response = await axios.get(`/api/community/posts/${communityId}`);
      return response.data.posts;
    } catch (err) {
      throw err;
    }
  };

  fetchPost = async (postId) => {
    try {
      const response = await axios.get(`/api/post/${postId}`);
      return response.data.post;
    } catch (err) {
      throw err;
    }
  };

  fetchInboxMessages = async () => {
    try {
      const response = await axios.get('/api/messages/inbox');
      return response.data.messages;
    } catch (err) {
      throw err;
    }
  };

  fetchSentMessages = async () => {
    try {
      const response = await axios.get('/api/messages/sent');
      return response.data.messages;
    } catch (err) {
      throw err;
    }
  };

  fetchComments = async (postId) => {
    try {
      const response = await axios.get(`/api/post/${postId}/comments`);
      return response.data.comments;
    } catch (err) {
      throw err;
    }
  };
}
