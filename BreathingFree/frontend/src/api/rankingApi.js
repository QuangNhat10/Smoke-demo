import apiClient from './axiosConfig';

// Lấy bảng xếp hạng
export const getLeaderboard = async () => {
    try {
        const response = await apiClient.get('/ranking/leaderboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};

// Lấy thứ hạng của user cụ thể
export const getUserRank = async (userId) => {
    try {
        const response = await apiClient.get(`/ranking/user-rank/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user rank:', error);
        throw error;
    }
};

// Lấy bảng xếp hạng cùng với thứ hạng của user hiện tại
export const getLeaderboardWithUser = async (userId) => {
    try {
        const response = await apiClient.get(`/ranking/leaderboard-with-user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard with user:', error);
        throw error;
    }
}; 