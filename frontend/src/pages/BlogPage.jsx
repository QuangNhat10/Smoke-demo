import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogPostForm from '../components/BlogPostForm';
import CommentModal from '../components/CommentModal';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

/**
 * Component trang blog cộng đồng
 * Hiển thị các bài viết chia sẻ về cai thuốc lá từ cộng đồng và chuyên gia
 * Cho phép người dùng đã đăng nhập tạo bài viết, thích và bình luận
 * @returns {JSX.Element} Component trang blog
 */
const BlogPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all'); // State lưu danh mục đang chọn
    const [searchTerm, setSearchTerm] = useState(''); // State từ khóa tìm kiếm
    const [isPostFormOpen, setIsPostFormOpen] = useState(false); // State hiển thị form tạo bài viết
    const [commentModalPostId, setCommentModalPostId] = useState(null); // State ID bài viết đang bình luận
    const [blogComments, setBlogComments] = useState({}); // State lưu bình luận cho bài viết
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State trạng thái đăng nhập
    const [currentUser, setCurrentUser] = useState({
        name: '',
        type: 'Người dùng',
        avatar: '👤',
        avatarColor: '#3498db22',
        accentColor: '#3498db'
    }); // State thông tin người dùng hiện tại
    const [editingPost, setEditingPost] = useState(null); // State bài viết đang chỉnh sửa

    /**
     * Effect kiểm tra trạng thái đăng nhập từ localStorage
     * Được gọi khi component được render
     */
    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        setIsLoggedIn(userLoggedIn);

        if (userLoggedIn) {
            const userName = localStorage.getItem('userName');
            setCurrentUser(prev => ({
                ...prev,
                name: userName || 'Người dùng'
            }));
        }
    }, []);

    // Dữ liệu bài viết sẽ được load từ API
    const [blogPosts, setBlogPosts] = useState([]);

    /**
     * Kiểm tra xem bài viết có thuộc về người dùng đang đăng nhập không
     * @param {Object} post - Bài viết cần kiểm tra
     * @returns {boolean} True nếu bài viết thuộc về người dùng đang đăng nhập
     */
    const isUserPost = (post) => {
        return isLoggedIn && post.authorName === currentUser.name;
    };

    // Bình luận sẽ được load từ API khi cần thiết

    /**
     * Hàm xử lý khi gửi bài viết mới hoặc cập nhật bài viết
     * @param {Object} newPostData - Dữ liệu bài viết mới hoặc đã cập nhật
     */
    const handlePostSubmit = (newPostData) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để đăng bài viết!');
            navigate('/login');
            return;
        }

        if (editingPost) {
            // Cập nhật bài viết đã tồn tại
            const updatedPosts = blogPosts.map(post => {
                if (post.id === editingPost.id) {
                    return {
                        ...post,
                        title: newPostData.title,
                        content: newPostData.content,
                        categories: newPostData.categories,
                        date: new Date().toLocaleDateString('vi-VN') + ' (đã chỉnh sửa)',
                    };
                }
                return post;
            });

            setBlogPosts(updatedPosts);
            setEditingPost(null);
            alert('Bài viết đã được cập nhật thành công!');
        } else {
            // Tạo bài viết mới với các trường cần thiết
            const newPost = {
                id: blogPosts.length + 1,
                authorName: currentUser.name,
                authorType: currentUser.type,
                avatar: currentUser.avatar,
                avatarColor: currentUser.avatarColor,
                accentColor: currentUser.accentColor,
                ...newPostData,
                likes: 0,
                comments: 0,
                liked: false
            };

            // Thêm bài viết mới vào đầu danh sách
            setBlogPosts([newPost, ...blogPosts]);
            alert('Bài viết của bạn đã được đăng thành công!');
        }

        // Đóng form
        setIsPostFormOpen(false);
    };

    /**
     * Hàm xử lý khi nhấn nút đăng bài - kiểm tra đăng nhập trước
     */
    const handlePostButtonClick = () => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để đăng bài viết!');
            navigate('/login');
            return;
        }

        setIsPostFormOpen(true);
    };

    /**
     * Hàm xử lý thích/bỏ thích bài viết
     * @param {number} postId - ID của bài viết
     */
    const handleLikePost = (postId) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để thích bài viết!');
            navigate('/login');
            return;
        }

        setBlogPosts(
            blogPosts.map(post => {
                if (post.id === postId) {
                    // Nếu đã thích, bỏ thích (giảm số lượt thích)
                    if (post.liked) {
                        return { ...post, likes: post.likes - 1, liked: false };
                    }
                    // Nếu chưa thích, thích (tăng số lượt thích)
                    return { ...post, likes: post.likes + 1, liked: true };
                }
                return post;
            })
        );
    };

    /**
     * Hàm xử lý chỉnh sửa bài viết
     * @param {Object} post - Bài viết cần chỉnh sửa
     */
    const handleEditPost = (post) => {
        setEditingPost(post);
        setIsPostFormOpen(true);
    };

    /**
     * Hàm xử lý xóa bài viết
     * @param {number} postId - ID của bài viết cần xóa
     */
    const handleDeletePost = (postId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            setBlogPosts(blogPosts.filter(post => post.id !== postId));
            // Đồng thời xóa các bình luận của bài viết này
            if (blogComments[postId]) {
                const newComments = { ...blogComments };
                delete newComments[postId];
                setBlogComments(newComments);
            }
            alert('Bài viết đã được xóa thành công!');
        }
    };

    /**
     * Hàm mở modal bình luận cho bài viết
     * @param {number} postId - ID của bài viết cần bình luận
     */
    const openCommentModal = (postId) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để bình luận!');
            navigate('/login');
            return;
        }

        setCommentModalPostId(postId);
    };

    /**
     * Hàm đóng modal bình luận
     */
    const closeCommentModal = () => {
        setCommentModalPostId(null);
    };

    /**
     * Hàm thêm bình luận mới cho bài viết
     * @param {number} postId - ID của bài viết được bình luận
     * @param {Object} newComment - Dữ liệu bình luận mới
     */
    const handleAddComment = (postId, newComment) => {
        // Cập nhật đối tượng bình luận với bình luận mới
        setBlogComments(prevComments => {
            const postComments = prevComments[postId] || [];
            return {
                ...prevComments,
                [postId]: [...postComments, newComment]
            };
        });

        // Cập nhật số lượng bình luận của bài viết
        setBlogPosts(
            blogPosts.map(post => {
                if (post.id === postId) {
                    return { ...post, comments: post.comments + 1 };
                }
                return post;
            })
        );
    };

    /**
     * Lọc bài viết theo từ khóa tìm kiếm và danh mục
     */
    const filteredPosts = blogPosts.filter(post => {
        const searchContent = `${post.authorName} ${post.authorType} ${post.title} ${post.content}`.toLowerCase();
        const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || post.categories.includes(activeCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="blog-page">
            {/* Header Component */}
            <Header userName={currentUser.name} />
            
            {/* Secondary Navigation */}
            <SecondaryNavigation />
            
            <div className="blog-header">
                <h1>Blog Cộng Đồng</h1>
                <p>Chia sẻ kinh nghiệm, câu chuyện và kiến thức về cai thuốc lá</p>
            </div>

            {/* Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '3rem 2rem',
                width: '100%',
                boxSizing: 'border-box',
            }}>
                {/* Search and Filters */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    marginBottom: '3rem',
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        <h2 style={{
                            fontSize: '1.3rem',
                            color: '#2c3e50',
                            margin: '0',
                        }}>Tìm kiếm bài viết</h2>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm theo tên tác giả, chủ đề, nội dung..."
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid #e5e8ee',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            />
                            <button style={{
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 1.5rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}>
                                Tìm Kiếm
                            </button>
                        </div>
                    </div>

                    <div>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            overflowX: 'auto',
                            paddingBottom: '0.5rem',
                        }}>
                            <button
                                onClick={() => setActiveCategory('all')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'all' ? '#3498db' : '#e5e8ee',
                                    color: activeCategory === 'all' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Tất Cả
                            </button>
                            <button
                                onClick={() => setActiveCategory('Chia sẻ')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Chia sẻ' ? '#3498db' : '#e5e8ee',
                                    color: activeCategory === 'Chia sẻ' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Chia Sẻ
                            </button>
                            <button
                                onClick={() => setActiveCategory('Kinh nghiệm')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Kinh nghiệm' ? '#3498db' : '#e5e8ee',
                                    color: activeCategory === 'Kinh nghiệm' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Kinh Nghiệm
                            </button>
                            <button
                                onClick={() => setActiveCategory('Sức khỏe')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Sức khỏe' ? '#3498db' : '#e5e8ee',
                                    color: activeCategory === 'Sức khỏe' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Sức Khỏe
                            </button>
                            <button
                                onClick={() => setActiveCategory('Điều trị')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Điều trị' ? '#3498db' : '#e5e8ee',
                                    color: activeCategory === 'Điều trị' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Điều Trị
                            </button>
                            <button
                                onClick={() => setActiveCategory('Tác hại')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Tác hại' ? '#3498db' : '#e5e8ee',
                                    color: activeCategory === 'Tác hại' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Tác Hại
                            </button>
                            <button
                                onClick={() => setActiveCategory('Động lực')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Động lực' ? '#3498db' : '#e5e8ee',
                                    color: activeCategory === 'Động lực' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Động Lực
                            </button>
                        </div>
                    </div>
                </div>

                {/* Blog Posts */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}>
                    {filteredPosts.map(post => (
                        <div key={post.id} style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                        }}>
                            <div style={{
                                padding: '2rem',
                                borderBottom: '1px solid #f0f0f0',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    marginBottom: '1.5rem',
                                    alignItems: 'center',
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: post.avatarColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.8rem',
                                        flexShrink: 0,
                                    }}>
                                        {post.avatar}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                    }}>
                                        <h3 style={{
                                            margin: '0 0 0.3rem 0',
                                            fontSize: '1.2rem',
                                            fontWeight: '700',
                                            color: '#2c3e50',
                                        }}>
                                            {post.authorName}
                                        </h3>
                                        <p style={{
                                            margin: '0',
                                            color: post.authorType === 'Chuyên gia' ? post.accentColor : '#7f8c8d',
                                            fontSize: '0.9rem',
                                            fontWeight: post.authorType === 'Chuyên gia' ? '600' : '400',
                                        }}>
                                            {post.authorType}
                                        </p>
                                    </div>
                                    {/* Thêm nút chỉnh sửa và xóa cho bài viết của người dùng đang đăng nhập */}
                                    {isUserPost(post) && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem'
                                        }}>
                                            <button
                                                onClick={() => handleEditPost(post)}
                                                style={{
                                                    background: '#f8f9fa',
                                                    color: '#3498db',
                                                    border: '1px solid #e5e8ee',
                                                    borderRadius: '8px',
                                                    padding: '0.5rem',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '35px',
                                                    height: '35px',
                                                }}
                                                title="Chỉnh sửa bài viết"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                style={{
                                                    background: '#f8f9fa',
                                                    color: '#e74c3c',
                                                    border: '1px solid #e5e8ee',
                                                    borderRadius: '8px',
                                                    padding: '0.5rem',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '35px',
                                                    height: '35px',
                                                }}
                                                title="Xóa bài viết"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <h2 style={{
                                    margin: '0 0 1rem 0',
                                    fontSize: '1.6rem',
                                    fontWeight: '700',
                                    color: post.accentColor,
                                }}>
                                    {post.title}
                                </h2>

                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginBottom: '1.5rem',
                                    alignItems: 'center',
                                }}>
                                    <span style={{
                                        color: '#7f8c8d',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                    }}>
                                        <span style={{ fontSize: '1.1rem' }}>📅</span>
                                        {post.date}
                                    </span>
                                    <span style={{
                                        color: '#7f8c8d',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                    }}>
                                        <span style={{ fontSize: '1.1rem' }}>⏱️</span>
                                        {post.readTime}
                                    </span>
                                    <div style={{ flexGrow: 1 }}></div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {post.categories.map((category, i) => (
                                            <span key={i} style={{
                                                padding: '0.3rem 0.8rem',
                                                background: `${post.accentColor}22`,
                                                color: post.accentColor,
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                            }}>
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <p style={{
                                    margin: '0',
                                    color: '#2c3e50',
                                    fontSize: '1rem',
                                    lineHeight: '1.7',
                                }}>
                                    {post.content}
                                </p>
                            </div>

                            <div style={{
                                padding: '1rem 2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: '#f9f9f9',
                            }}>
                                <button
                                    onClick={() => handleLikePost(post.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        color: post.liked ? post.accentColor : '#7f8c8d',
                                        fontWeight: '500',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s ease',
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>{post.liked ? '❤️' : '👍'}</span>
                                    {post.likes} Thích
                                </button>

                                <button
                                    onClick={() => openCommentModal(post.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        color: '#7f8c8d',
                                        fontWeight: '500',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>💬</span>
                                    {post.comments} Bình luận
                                </button>

                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'none',
                                    border: 'none',
                                    color: '#7f8c8d',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                }}>
                                    <span style={{ fontSize: '1.1rem' }}>🔖</span>
                                    Lưu lại
                                </button>

                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'none',
                                    border: 'none',
                                    color: '#7f8c8d',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                }}>
                                    <span style={{ fontSize: '1.1rem' }}>🔗</span>
                                    Chia sẻ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Write Post Button - now checks login */}
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                }}>
                    <button
                        onClick={handlePostButtonClick}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                            color: 'white',
                            fontSize: '2rem',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
                            cursor: 'pointer',
                        }}
                    >
                        ✏️
                    </button>
                </div>

                {/* Blog Post Form Modal */}
                <BlogPostForm
                    isOpen={isPostFormOpen}
                    onClose={() => {
                        setIsPostFormOpen(false);
                        setEditingPost(null);
                    }}
                    onSubmit={handlePostSubmit}
                    initialData={editingPost}
                />

                {/* Comment Modal */}
                {commentModalPostId && (
                    <CommentModal
                        isOpen={commentModalPostId !== null}
                        onClose={closeCommentModal}
                        comments={blogComments[commentModalPostId] || []}
                        onAddComment={handleAddComment}
                        postId={commentModalPostId}
                    />
                )}
            </div>

            {/* Style for whole page */}
            <style jsx>{`
                .blog-page {
                    min-height: 100vh;
                    width: 100%;
                    background: linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%);
                    font-family: "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
                    overflow-x: hidden;
                }
                
                .blog-header {
                    background: white;
                    padding: 2.5rem 2rem;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    position: relative;
                }
                
                .blog-header h1 {
                    font-size: 2.5rem;
                    color: #35a79c;
                    margin: 0 0 1rem 0;
                    font-weight: 700;
                    position: relative;
                    display: inline-block;
                }
                
                .blog-header h1:after {
                    content: "";
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 4px;
                    background: #44b89d;
                    border-radius: 2px;
                }
                
                .blog-header p {
                    color: #7f8c8d;
                    font-size: 1.1rem;
                    max-width: 800px;
                    margin: 1.5rem auto 0;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};

export default BlogPage; 