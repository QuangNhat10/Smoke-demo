import axios from './axiosConfig';

export const leaderboardApi = {
  // Fetch leaderboard based on sort criteria ("days" or "money")
  getLeaderboard: async (sortBy = 'days') => {
    try {
      const response = await axios.get(`/leaderboard?sortBy=${sortBy}`);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bảng xếp hạng:', error);
      throw error;
    }
  },
}; 