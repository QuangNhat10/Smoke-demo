import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import postApi from '../api/postApi';

/**
 * Component trang blog cộng đồng - kết nối với backend API
 * Hiển thị các bài viết chia sẻ về cai thuốc lá từ cộng đồng và chuyên gia
 * Cho phép người dùng đã đăng nhập tạo bài viết, thích và bình luận
 */
const BlogPageNew = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: '', id: null });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        category: '',
        tags: []
    });

    // Kiểm tra đăng nhập
    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        
        setIsLoggedIn(userLoggedIn);
        setCurrentUser({ name: userName || '', id: userId });
    }, []);

    // Load dữ liệu ban đầu
    useEffect(() => {
        loadPosts();
        loadCategories();
    }, [activeCategory, searchTerm, currentPage]);

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const filters = {
                category: activeCategory === 'all' ? null : activeCategory,
                search: searchTerm || null,
                page: currentPage,
                pageSize: 10
            };
            
            const data = await postApi.getPosts('Blog', filters);
            setPosts(data);
        } catch (error) {
            console.error('Lỗi khi tải bài viết:', error);
            toast.error('Không thể tải bài viết');
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await postApi.getCategories('Blog');
            setCategories(data);
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
        }
    };

    const handleCreatePost = async () => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để tạo bài viết');
            navigate('/login');
            return;
        }

        try {
            const postData = {
                ...newPost,
                postType: 'Blog'
            };
            
            await postApi.createPost(postData);
            toast.success('Tạo bài viết thành công!');
            setShowCreateForm(false);
            setNewPost({ title: '', content: '', category: '', tags: [] });
            loadPosts();
        } catch (error) {
            console.error('Lỗi khi tạo bài viết:', error);
            toast.error('Không thể tạo bài viết');
        }
    };

    const handleLikePost = async (postId) => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để thích bài viết');
            return;
        }

        try {
            await postApi.likePost(postId);
            loadPosts(); // Refresh để cập nhật số like
        } catch (error) {
            console.error('Lỗi khi thích bài viết:', error);
            toast.error('Không thể thích bài viết');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

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

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div>Đang tải...</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)'
        }}>
            <Header />
            <SecondaryNavigation />

            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 2rem'
            }}>
                {/* Header Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem'
                }}>
                    <h1 style={{
                        color: '#2C9085',
                        fontSize: '2.5rem',
                        marginBottom: '1rem'
                    }}>Cộng Đồng Cai Thuốc Lá</h1>
                    <p style={{
                        color: '#666',
                        fontSize: '1.1rem'
                    }}>
                        Chia sẻ kinh nghiệm, trao đổi kiến thức và hỗ trợ lẫn nhau trên hành trình cai thuốc lá
                    </p>
                </div>

                {/* Controls Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Category Filter */}
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

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                minWidth: '250px'
                            }}
                        />
                    </div>

                    {/* Create Post Button */}
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
                                cursor: 'pointer'
                            }}
                        >
                            + Tạo bài viết
                        </button>
                    )}
                </div>

                {/* Create Post Form */}
                {showCreateForm && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: '#2C9085' }}>Tạo bài viết mới</h3>
                        
                        <input
                            type="text"
                            placeholder="Tiêu đề bài viết"
                            value={newPost.title}
                            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                marginBottom: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />

                        <select
                            value={newPost.category}
                            onChange={(e) => setNewPost({...newPost, category: e.target.value})}
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
                            <option value="Kinh nghiệm">Kinh nghiệm</option>
                            <option value="Sức khỏe">Sức khỏe</option>
                            <option value="Phương pháp">Phương pháp</option>
                            <option value="Động lực">Động lực</option>
                            <option value="Chia sẻ">Chia sẻ</option>
                        </select>

                        <textarea
                            placeholder="Nội dung bài viết"
                            value={newPost.content}
                            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                            rows={6}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                marginBottom: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleCreatePost}
                                style={{
                                    padding: '0.7rem 1.5rem',
                                    backgroundColor: '#2C9085',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Đăng bài
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                style={{
                                    padding: '0.7rem 1.5rem',
                                    backgroundColor: '#ddd',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    {posts.map(post => (
                        <div
                            key={post.postID}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '2rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            {/* Post Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem'
                            }}>
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
                                            {post.userName}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {formatDate(post.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                
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

                            {/* Post Content */}
                            <h3 style={{
                                color: '#333',
                                marginBottom: '1rem',
                                fontSize: '1.3rem'
                            }}>
                                {post.title}
                            </h3>
                            
                            <p style={{
                                color: '#555',
                                lineHeight: '1.6',
                                marginBottom: '1.5rem'
                            }}>
                                {post.content.length > 200 
                                    ? `${post.content.substring(0, 200)}...`
                                    : post.content
                                }
                            </p>

                            {/* Post Actions */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '1rem',
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <button
                                        onClick={() => handleLikePost(post.postID)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: post.isLiked ? '#e74c3c' : '#666'
                                        }}
                                    >
                                        {post.isLiked ? '❤️' : '🤍'} {post.likes}
                                    </button>
                                    
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#666'
                                    }}>
                                        💬 {post.comments.length}
                                    </span>
                                    
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#666'
                                    }}>
                                        👁️ {post.views}
                                    </span>
                                </div>
                            </div>

                            {/* Comments */}
                            {post.comments.length > 0 && (
                                <div style={{
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <h4 style={{ marginBottom: '1rem', color: '#2C9085' }}>
                                        Bình luận ({post.comments.length})
                                    </h4>
                                    {post.comments.slice(0, 3).map(comment => (
                                        <div key={comment.postID} style={{
                                            backgroundColor: '#f8f9fa',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '0.3rem'
                                            }}>
                                                <strong style={{ color: '#2C9085' }}>
                                                    {comment.userName}
                                                </strong>
                                                <small style={{ color: '#666' }}>
                                                    {formatDate(comment.createdAt)}
                                                </small>
                                            </div>
                                            <p style={{ margin: '0', color: '#555' }}>
                                                {comment.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* No posts message */}
                {posts.length === 0 && !isLoading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        color: '#666'
                    }}>
                        <h3>Chưa có bài viết nào</h3>
                        <p>Hãy là người đầu tiên chia sẻ kinh nghiệm của bạn!</p>
                    </div>
                )}

                {/* Pagination */}
                {posts.length === 10 && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '2rem'
                    }}>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{
                                padding: '0.7rem 1.5rem',
                                backgroundColor: '#2C9085',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Tải thêm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPageNew; 