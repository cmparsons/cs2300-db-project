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

      return response.data.communityId;
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

      return response.data.postId;
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
}
