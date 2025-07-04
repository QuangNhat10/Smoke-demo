import axios from './axiosConfig';

// API cho quit plans
export const quitPlanApi = {
    // Tạo kế hoạch cai thuốc mới
    createQuitPlan: async (planData) => {
        try {
            const response = await axios.post('/quitplan', planData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo kế hoạch cai thuốc:', error);
            throw error;
        }
    },

    // Lấy kế hoạch cai thuốc đang hoạt động
    getActiveQuitPlan: async () => {
        try {
            const response = await axios.get('/quitplan/active');
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; // Không có kế hoạch đang hoạt động
            }
            console.error('Lỗi khi lấy kế hoạch cai thuốc:', error);
            throw error;
        }
    },

    // Lấy tất cả kế hoạch của người dùng
    getMyQuitPlans: async () => {
        try {
            const response = await axios.get('/quitplan/my-plans');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách kế hoạch:', error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết của một kế hoạch
    getQuitPlan: async (planId) => {
        try {
            const response = await axios.get(`/quitplan/${planId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin kế hoạch:', error);
            throw error;
        }
    },

    // Cập nhật trạng thái kế hoạch
    updateQuitPlanStatus: async (planId, status, notes = '') => {
        try {
            const response = await axios.put(`/quitplan/${planId}/status`, {
                status,
                notes
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái kế hoạch:', error);
            throw error;
        }
    },

    // Thêm ngày không hút thuốc
    addSmokeFreeDay: async () => {
        try {
            const response = await axios.post('/quitplan/add-smoke-free-day');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi thêm ngày không hút thuốc:', error);
            throw error;
        }
    },

<<<<<<< HEAD
=======
    // Reset kế hoạch cai thuốc
    resetQuitPlan: async () => {
        try {
            const response = await axios.post('/quitplan/reset');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi reset kế hoạch cai thuốc:', error);
            throw error;
        }
    },

>>>>>>> feb8be7 ( Complete)
    // API cho bác sĩ
    doctor: {
        // Xem kế hoạch của bệnh nhân
        getPatientQuitPlans: async (patientId) => {
            try {
                const response = await axios.get(`/quitplan/patient/${patientId}`);
                return response.data;
            } catch (error) {
                console.error('Lỗi khi lấy kế hoạch của bệnh nhân:', error);
                throw error;
            }
        },

        // Phê duyệt kế hoạch
        approveQuitPlan: async (planId, isApproved, doctorNotes = '', recommendedSupport = []) => {
            try {
                const response = await axios.put(`/quitplan/${planId}/approve`, {
                    isApproved,
                    doctorNotes,
                    recommendedSupport
                });
                return response.data;
            } catch (error) {
                console.error('Lỗi khi phê duyệt kế hoạch:', error);
                throw error;
            }
        }
    }
}; 