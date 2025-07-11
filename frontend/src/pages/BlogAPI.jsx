// Import các thư viện React và dependencies cần thiết
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import postApi from '../api/postApi';

/**
 * Component trang Blog với API thực tế
 * Quản lý việc hiển thị, tạo, sửa, xóa các bài viết blog từ server
 * Tích hợp đầy đủ với backend API và authentication
 * @returns {JSX.Element} Component trang blog với đầy đủ chức năng CRUD
 */
const BlogAPI = () => {
    const navigate = useNavigate();

    // State quản lý danh sách bài viết từ API
    const [posts, setPosts] = useState([]);

    // State quản lý danh mục bài viết
    const [categories, setCategories] = useState([]);

    // State danh mục đang được chọn để lọc
    const [activeCategory, setActiveCategory] = useState('all');

    // State từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // State trạng thái loading khi tải dữ liệu
    const [isLoading, setIsLoading] = useState(true);

    // State trạng thái đang tìm kiếm
    const [isSearching, setIsSearching] = useState(false);

    // State lưu từ khóa tìm kiếm cuối cùng để tránh duplicate search
    const [lastSearchTerm, setLastSearchTerm] = useState('');

    // State theo dõi các bài viết đã được view để track analytics
    const [viewedPosts, setViewedPosts] = useState(new Set());

    // State trạng thái đăng nhập
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State hiển thị form tạo/sửa bài viết
    const [showCreateForm, setShowCreateForm] = useState(false);

    // State bài viết đang được chỉnh sửa
    const [editingPost, setEditingPost] = useState(null);

    // State dữ liệu form bài viết mới
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        category: '',
        tags: []
    });

    /**
     * Effect kiểm tra trạng thái đăng nhập và load categories khi component mount
     */
    useEffect(() => {
        // Kiểm tra cả flag đăng nhập và token tồn tại
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const token = localStorage.getItem('token');
        const actuallyLoggedIn = userLoggedIn && token;

        setIsLoggedIn(actuallyLoggedIn);

        // Load danh sách categories từ API
        loadCategories();
    }, []);

    /**
     * Effect riêng cho việc thay đổi category - load posts ngay lập tức
     */
    useEffect(() => {
        loadPosts();
    }, [activeCategory]);

    /**
     * Effect xử lý auto-search khi xóa từ khóa tìm kiếm
     */
    useEffect(() => {
        if (searchTerm === '') {
            // Nếu từ khóa bị xóa, tìm kiếm ngay để hiển thị tất cả bài viết
            setLastSearchTerm('');
            loadPosts();
        } else {
            // Reset lastSearchTerm khi người dùng nhập nội dung mới
            if (searchTerm.trim() !== lastSearchTerm) {
                setLastSearchTerm('');
            }
        }
    }, [searchTerm]);

    /**
     * Effect theo dõi view bài viết đơn giản khi posts được load
     */
    useEffect(() => {
        if (posts.length > 0) {
            // Track views cho tất cả bài viết sau delay (mô phỏng người dùng đang xem)
            const timer = setTimeout(() => {
                posts.forEach(post => {
                    if (!viewedPosts.has(post.postID)) {
                        console.log('🔍 Auto-tracking view for post:', post.postID);
                        handlePostView(post.postID);
                    }
                });
            }, 2000); // 2 giây sau khi posts load

            return () => clearTimeout(timer);
        }
    }, [posts]);

    /**
     * Hàm load danh sách bài viết từ API với filters
     * @async
     */
    const loadPosts = async () => {
        try {
            setIsLoading(true);

            // Chuẩn bị filters cho API
            const filters = {
                category: activeCategory === 'all' ? null : activeCategory,
                search: searchTerm || null,
                page: 1,
                pageSize: 10
            };

            console.log('🔄 Loading posts with filters:', filters);
            const data = await postApi.getPosts('Blog', filters);
            console.log('📨 API response:', data);

            // Backend trả về array trực tiếp, không wrap trong posts property
            if (data && Array.isArray(data)) {
                console.log('✅ Found posts array:', data.length);
                setPosts(data);
            } else if (data && data.posts && Array.isArray(data.posts)) {
                console.log('✅ Found posts in wrapper:', data.posts.length);
                setPosts(data.posts);
            } else {
                console.log('⚠️ No posts found, using empty array');
                setPosts([]);
            }
        } catch (error) {
            console.error('❌ Error loading posts:', error);
            // Chỉ sử dụng fallback nếu có lỗi thực sự
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Hàm load danh sách categories từ API
     * @async
     */
    const loadCategories = async () => {
        try {
            const data = await postApi.getCategories('Blog');
            setCategories(data);
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            // Fallback categories nếu API lỗi
            setCategories(['Kinh nghiệm', 'Sức khỏe', 'Phương pháp', 'Động lực', 'Chia sẻ']);
        }
    };

    /**
     * Hàm xử lý tạo bài viết mới
     * @async
     */
    const handleCreatePost = async () => {
        // Kiểm tra authentication
        const token = localStorage.getItem('token');

        if (!isLoggedIn || !token) {
            toast.error('Vui lòng đăng nhập để tạo bài viết.');
            navigate('/login');
            return;
        }

        // Validate dữ liệu form
        if (!newPost.title || !newPost.content || !newPost.category) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc: Tiêu đề, Nội dung, Danh mục');
            return;
        }

        try {
            // Chuẩn bị dữ liệu để gửi API
            const postData = {
                ...newPost,
                postType: 'Blog'
            };

            const createdPost = await postApi.createPost(postData);
            console.log('✅ Post created:', createdPost);

            toast.success('Tạo bài viết thành công!');
            setShowCreateForm(false);
            setNewPost({ title: '', content: '', category: '', tags: [] });

            // Force reload posts để hiển thị bài viết mới
            console.log('🔄 Force reloading posts...');
            await loadPosts();
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Không thể tạo bài viết. Vui lòng thử lại.');
        }
    };

    /**
     * Hàm xử lý like/unlike bài viết
     * @async
     * @param {number} postId - ID của bài viết cần like
     */
    const handleLikePost = async (postId) => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để thích bài viết');
            return;
        }

        try {
            await postApi.likePost(postId);
            // Reload posts để cập nhật số likes
            loadPosts();
        } catch (error) {
            console.error('Lỗi khi thích bài viết:', error);
            toast.error('Không thể thích bài viết');
        }
    };

    /**
     * Hàm xử lý chỉnh sửa bài viết - mở form với dữ liệu hiện tại
     * @param {Object} post - Bài viết cần chỉnh sửa
     */
    const handleEditPost = (post) => {
        setEditingPost(post);
        setNewPost({
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags || []
        });
        setShowCreateForm(true);
    };

    /**
     * Hàm xử lý cập nhật bài viết đã chỉnh sửa
     * @async
     */
    const handleUpdatePost = async () => {
        const token = localStorage.getItem('token');

        if (!isLoggedIn || !token) {
            toast.error('Vui lòng đăng nhập để sửa bài viết.');
            return;
        }

        // Validate dữ liệu form
        if (!newPost.title || !newPost.content || !newPost.category) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            // Chuẩn bị dữ liệu update
            const updateData = {
                ...newPost,
                postType: 'Blog'
            };

            await postApi.updatePost(editingPost.postID, updateData);
            toast.success('Cập nhật bài viết thành công!');

            // Reset form state và reload posts
            setShowCreateForm(false);
            setEditingPost(null);
            setNewPost({ title: '', content: '', category: '', tags: [] });
            await loadPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('Không thể cập nhật bài viết. Vui lòng thử lại.');
        }
    };

    /**
     * Hàm xử lý xóa bài viết
     * @async
     * @param {number} postId - ID của bài viết cần xóa
     */
    const handleDeletePost = async (postId) => {
        // Xác nhận trước khi xóa
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            return;
        }

        const token = localStorage.getItem('token');

        if (!isLoggedIn || !token) {
            toast.error('Vui lòng đăng nhập để xóa bài viết.');
            return;
        }

        try {
            await postApi.deletePost(postId);
            toast.success('Xóa bài viết thành công!');
            await loadPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Không thể xóa bài viết. Vui lòng thử lại.');
        }
    };

    /**
     * Hàm hủy chỉnh sửa và đóng form
     */
    const cancelEdit = () => {
        setShowCreateForm(false);
        setEditingPost(null);
        setNewPost({ title: '', content: '', category: '', tags: [] });
    };

    /**
     * Kiểm tra xem người dùng hiện tại có phải chủ sở hữu bài viết không
     * @param {Object} post - Bài viết cần kiểm tra
     * @returns {boolean} True nếu người dùng là chủ sở hữu
     */
    const isOwner = (post) => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        return currentUser.userId === post.userID;
    };

    /**
     * Hàm xử lý tìm kiếm thủ công khi nhấn nút hoặc Enter
     * @async
     * @param {Event} e - Event object (optional)
     */
    const handleManualSearch = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const currentTerm = searchTerm.trim();
        if (!currentTerm || isSearching) return;

        // Tránh tìm kiếm trùng lặp
        if (currentTerm === lastSearchTerm && lastSearchTerm !== '') {
            console.log('🔄 Same search term, skipping duplicate search');
            return;
        }

        console.log('🔍 Manual search triggered with term:', currentTerm);
        setIsSearching(true);
        setLastSearchTerm(currentTerm);

        try {
            await loadPosts();
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    /**
     * Hàm track view bài viết cho analytics
     * @async
     * @param {number} postId - ID bài viết được view
     */
    const handlePostView = async (postId) => {
        // Chỉ track view một lần cho mỗi bài viết
        if (viewedPosts.has(postId)) {
            console.log('📊 Post already viewed:', postId);
            return;
        }

        console.log('👁️ Tracking view for post:', postId);

        try {
            const response = await postApi.incrementView(postId);
            console.log('✅ View tracked successfully:', response);

            // Lưu vào Set để tránh track duplicate
            setViewedPosts(prev => new Set([...prev, postId]));

            // Cập nhật view count trong UI ngay lập tức
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.postID === postId
                        ? { ...post, views: (post.views || 0) + 1 }
                        : post
                )
            );
        } catch (error) {
            console.error('❌ Error tracking view for post:', postId, error);
        }
    };

    /**
     * Hàm format ngày tháng theo định dạng Việt Nam
     * @param {string} dateString - Chuỗi ngày cần format
     * @returns {string} Ngày đã được format
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    /**
     * Hàm lấy màu badge theo danh mục
     * @param {string} category - Tên danh mục
     * @returns {string} Mã màu hex
     */
    const getBadgeColor = (category) => {
        const colors = {
            'Kinh nghiệm': '#3498db',
            'Sức khỏe': '#e74c3c',
            'Phương pháp': '#2ecc71',
            'Động lực': '#9b59b6',
            'Chia sẻ': '#f39c12'
        };
        return colors[category] || '#95a5a6';
    };

    // Hiển thị loading state
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2rem',
                color: '#2C9085'
            }}>
                <div>Đang tải dữ liệu blog...</div>
            </div>
        );
    }

    return (
        <div
            lang="vi"
            className="vietnamese-text"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)'
            }}
        >
            {/* Header và Navigation Components */}
            <Header />
            <SecondaryNavigation />

            {/* Main Content Container */}
            <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
                {/* Page Header với tiêu đề và mô tả */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ color: '#2C9085', fontSize: '2.5rem', marginBottom: '1rem' }}>
                        🌿 Cộng Đồng Cai Thuốc Lá
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Chia sẻ kinh nghiệm, trao đổi kiến thức và hỗ trợ lẫn nhau trên hành trình cai thuốc lá
                    </p>
                </div>

                {/* Controls Bar: Category Filter, Search, Create Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    {/* Left Controls: Category và Search */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Category Selector */}
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        {/* Search Controls */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {/* Search Input với Clear Button */}
                            <div style={{ position: 'relative', minWidth: '250px' }}>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleManualSearch(e);
                                        }
                                    }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        paddingRight: searchTerm && !isSearching ? '2.5rem' : '1rem',
                                        borderRadius: '8px',
                                        border: isSearching ? '1px solid #2C9085' : '1px solid #ddd',
                                        fontSize: '1rem',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        outline: isSearching ? '2px solid rgba(44, 144, 133, 0.2)' : 'none'
                                    }}
                                />
                                {/* Clear Search Button */}
                                {searchTerm && !isSearching && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        style={{
                                            position: 'absolute',
                                            right: '0.8rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#999',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            padding: '0'
                                        }}
                                        title="Xóa tìm kiếm"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleManualSearch}
                                disabled={!searchTerm.trim() || isSearching}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: (!searchTerm.trim() || isSearching) ? '#ccc' : '#2C9085',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: (!searchTerm.trim() || isSearching) ? 'not-allowed' : 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    minWidth: '100px',
                                    justifyContent: 'center'
                                }}
                                title={isSearching ? "Đang tìm kiếm..." : "Tìm kiếm ngay"}
                            >
                                {isSearching ? '⏳ Đang tìm...' : '🔍 Tìm'}
                            </button>
                        </div>
                    </div>

                    {/* Create Post Button - chỉ hiển thị cho user đã đăng nhập */}
                    {isLoggedIn && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            style={{
                                padding: '0.7rem 1.5rem',
                                backgroundColor: '#2C9085',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(44, 144, 133, 0.3)'
                            }}
                        >
                            ✍️ Tạo bài viết
                        </button>
                    )}
                </div>

                {/* Create/Edit Post Form - hiển thị khi showCreateForm = true */}
                {showCreateForm && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e0e0'
                    }}>
                        {/* Form Header */}
                        <h3 style={{ marginBottom: '1rem', color: '#2C9085' }}>
                            {editingPost ? '✏️ Chỉnh sửa bài viết' : '✨ Tạo bài viết mới'}
                        </h3>

                        {/* Title Input */}
                        <input
                            type="text"
                            placeholder="Tiêu đề bài viết"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                marginBottom: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />

                        {/* Category Selector */}
                        <select
                            value={newPost.category}
                            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                marginBottom: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="">Chọn danh mục</option>
                            <option value="Kinh nghiệm">🎯 Kinh nghiệm</option>
                            <option value="Sức khỏe">❤️ Sức khỏe</option>
                            <option value="Phương pháp">🛠️ Phương pháp</option>
                            <option value="Động lực">💪 Động lực</option>
                            <option value="Chia sẻ">💬 Chia sẻ</option>
                        </select>

                        {/* Content Textarea */}
                        <textarea
                            placeholder="Nội dung bài viết"
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            rows={6}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                marginBottom: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />

                        {/* Tags Input */}
                        <input
                            type="text"
                            placeholder="Tags (phân cách bằng dấu phẩy, ví dụ: cai thuốc, kinh nghiệm, sức khỏe)"
                            value={newPost.tags.join(', ')}
                            onChange={(e) => {
                                const tagsString = e.target.value;
                                const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                                setNewPost({ ...newPost, tags: tagsArray });
                            }}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                marginBottom: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />

                        {/* Form Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {/* Submit Button - khác nhau giữa create và update */}
                            <button
                                onClick={editingPost ? handleUpdatePost : handleCreatePost}
                                style={{
                                    padding: '0.7rem 1.5rem',
                                    backgroundColor: '#2C9085',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                {editingPost ? '💾 Cập nhật' : '📝 Đăng bài'}
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={cancelEdit}
                                style={{
                                    padding: '0.7rem 1.5rem',
                                    backgroundColor: '#ddd',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                ❌ Hủy
                            </button>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {posts.map(post => (
                        <div
                            key={post.postID}
                            data-post-id={post.postID}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '2rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            {/* Post Header với thông tin tác giả và category */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem'
                            }}>
                                {/* Author Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        👤
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#2C9085' }}>
                                            {post.userName || 'Ẩn danh'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {formatDate(post.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                {post.category && (
                                    <span style={{
                                        backgroundColor: getBadgeColor(post.category),
                                        color: 'white',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '15px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {post.category}
                                    </span>
                                )}
                            </div>

                            {/* Post Title */}
                            <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.3rem' }}>
                                {post.title}
                            </h3>

                            {/* Post Content - truncate nếu quá dài */}
                            <p style={{
                                color: '#555',
                                lineHeight: '1.6',
                                marginBottom: '1.5rem'
                            }}>
                                {post.content && post.content.length > 200
                                    ? `${post.content.substring(0, 200)}...`
                                    : post.content
                                }
                            </p>

                            {/* Post Footer với action buttons */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '1rem',
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                {/* Left Actions: Like, Comment, View */}
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    {/* Like Button */}
                                    <button
                                        onClick={() => handleLikePost(post.postID)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: post.isLiked ? '#e74c3c' : '#666',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {post.isLiked ? '❤️' : '🤍'} {post.likes || 0}
                                    </button>

                                    {/* Comments Count */}
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#666',
                                        fontSize: '0.9rem'
                                    }}>
                                        💬 {post.comments?.length || 0}
                                    </span>

                                    {/* View Button - clickable để test view tracking */}
                                    <button
                                        onClick={() => handlePostView(post.postID)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#666',
                                            fontSize: '0.9rem',
                                            padding: '0'
                                        }}
                                        title="Click để test view tracking"
                                    >
                                        👁️ {post.views || 0}
                                    </button>
                                </div>

                                {/* Right Actions: Edit & Delete cho chủ sở hữu */}
                                {isLoggedIn && isOwner(post) && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEditPost(post)}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #3498db',
                                                color: '#3498db',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            title="Chỉnh sửa bài viết"
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#3498db';
                                                e.target.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = '#3498db';
                                            }}
                                        >
                                            ✏️ Sửa
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeletePost(post.postID)}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #e74c3c',
                                                color: '#e74c3c',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            title="Xóa bài viết"
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#e74c3c';
                                                e.target.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = '#e74c3c';
                                            }}
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State - hiển thị khi không có bài viết */}
                {posts.length === 0 && !isLoading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        color: '#666'
                    }}>
                        <h3>🌱 Chưa có bài viết nào</h3>
                        <p>Hãy là người đầu tiên chia sẻ kinh nghiệm cai thuốc lá của bạn!</p>
                        {isLoggedIn && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.7rem 1.5rem',
                                    backgroundColor: '#2C9085',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                ✍️ Tạo bài viết đầu tiên
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogAPI; 