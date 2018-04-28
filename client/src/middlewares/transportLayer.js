import axios from 'axios';

export default class TransportLayer {
  login = async (identifier, password) => {
    try {
      const response = await axios.post('/api/users/login', {
        identifier,
        password,
      });

      return response.data.token;
    } catch (err) {
      throw err;
    }
  };

  register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/users/register', {
        username,
        email,
        password,
      });

      return response.data.token;
    } catch (err) {
      throw err;
    }
  };

  createCommunity = async (name) => {
    try {
      const response = await axios.post('/api/community', {
        name,
      });

      return response.data.community;
    } catch (err) {
      throw err;
    }
  };

  deleteCommunity = async (id) => {
    try {
      await axios.delete(`/api/community/${id}`);
    } catch (err) {
      throw err;
    }
  };

  createPost = async (post, communityId) => {
    try {
      const response = await axios.post(`/api/post/${communityId}`, {
        ...post,
      });

      return response.data.post;
    } catch (err) {
      throw err;
    }
  };

  deletePost = async (id) => {
    try {
      await axios.delete(`/api/post/${id}`);
    } catch (err) {
      throw err;
    }
  };

  updatePost = async (post, postId) => {
    try {
      await axios.put(`/api/post/${postId}`, {
        ...post,
      });
    } catch (err) {
      throw err;
    }
  };

  createMessage = async (message) => {
    try {
      await axios.post('/api/messages', {
        ...message,
      });
    } catch (err) {
      throw err;
    }
  };
}
