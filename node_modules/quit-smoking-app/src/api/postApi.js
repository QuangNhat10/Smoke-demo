import axiosConfig from './axiosConfig';

const postApi = {
    // Lấy danh sách bài viết (Blog/FAQ)
    async getPosts(postType = 'Blog', filters = {}) {
        const { category, search, page = 1, pageSize = 10 } = filters;
        const params = new URLSearchParams();
        
        params.append('postType', postType);
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('pageSize', pageSize);

        const response = await axiosConfig.get(`/post?${params}`);
        return response.data;
    },

    // Lấy chi tiết bài viết
    async getPost(id) {
        const response = await axiosConfig.get(`/post/${id}`);
        return response.data;
    },

    // Tạo bài viết mới
    async createPost(postData) {
        const response = await axiosConfig.post('/post', postData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data;
    },

    // Cập nhật bài viết
    async updatePost(id, postData) {
        const response = await axiosConfig.put(`/post/${id}`, postData);
        return response.data;
    },

    // Xóa bài viết
    async deletePost(id) {
        const response = await axiosConfig.delete(`/post/${id}`);
        return response.data;
    },

    // Like/Unlike bài viết
    async likePost(id) {
        const response = await axiosConfig.post(`/post/${id}/like`);
        return response.data;
    },

    // Thêm bình luận
    async addComment(id, content) {
        const response = await axiosConfig.post(`/post/${id}/comments`, {
            content: content
        });
        return response.data;
    },

    // Tăng lượt xem
    async incrementView(id) {
        try {
            console.log('📡 Calling increment view API for post:', id);
            const response = await axiosConfig.post(`/post/${id}/view`);
            console.log('📡 API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('📡 API Error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy danh mục
    async getCategories(postType = 'Blog') {
        const response = await axiosConfig.get(`/post/categories?postType=${postType}`);
        return response.data;
    }
};

export default postApi; 