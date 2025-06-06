import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import BlogPostForm from '../components/BlogPostForm';
import CommentModal from '../components/CommentModal';

const BlogPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isPostFormOpen, setIsPostFormOpen] = useState(false);
    const [commentModalPostId, setCommentModalPostId] = useState(null);
    const [blogComments, setBlogComments] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: '',
        type: 'Người dùng',
        avatar: '👤',
        avatarColor: '#3498db22',
        accentColor: '#3498db'
    });
    const [editingPost, setEditingPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check login status
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

    // Fetch posts from API
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await blogAPI.getAllPosts();
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Check if post belongs to current logged in user
    const isUserPost = (post) => {
        return isLoggedIn && post.authorName === currentUser.name;
    };

    // Khởi tạo dữ liệu bình luận mẫu
    useState(() => {
        const initialComments = {
            1: [
                {
                    id: 101,
                    authorName: 'Hoàng Minh Tuấn',
                    avatar: '👨',
                    avatarColor: '#3498db22',
                    content: 'Cảm ơn bạn đã chia sẻ! Tôi cũng đang trong quá trình cai thuốc và thấy rất đồng cảm với những gì bạn trải qua.',
                    date: '12/07/2023',
                    time: '09:45'
                },
                {
                    id: 102,
                    authorName: 'Nguyễn Thị Lan',
                    avatar: '👩',
                    avatarColor: '#e74c3c22',
                    content: 'Bạn có thể chia sẻ thêm về cách đối phó với cơn thèm thuốc không? Tôi thấy đó là khó khăn lớn nhất.',
                    date: '15/07/2023',
                    time: '14:23'
                }
            ]
        };
        setBlogComments(initialComments);
    }, []);

    // Handle new post submission
    const handlePostSubmit = (newPostData) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để đăng bài viết!');
            navigate('/login');
            return;
        }

        if (editingPost) {
            // Updating existing post
            const updatedPosts = posts.map(post => {
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

            setPosts(updatedPosts);
            setEditingPost(null);
            alert('Bài viết đã được cập nhật thành công!');
        } else {
            // Create a new post object with necessary fields
            const newPost = {
                id: posts.length + 1,
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

            // Add the new post to the beginning of the posts array
            setPosts([newPost, ...posts]);
            alert('Bài viết của bạn đã được đăng thành công!');
        }

        // Close the form
        setIsPostFormOpen(false);
    };

    // Handle post button click - check login first
    const handlePostButtonClick = () => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để đăng bài viết!');
            navigate('/login');
            return;
        }

        setIsPostFormOpen(true);
    };

    // Handle like/unlike a post
    const handleLikePost = (postId) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để thích bài viết!');
            navigate('/login');
            return;
        }

        setPosts(
            posts.map(post => {
                if (post.id === postId) {
                    // If already liked, unlike it (decrease count)
                    if (post.liked) {
                        return { ...post, likes: post.likes - 1, liked: false };
                    }
                    // If not liked, like it (increase count)
                    return { ...post, likes: post.likes + 1, liked: true };
                }
                return post;
            })
        );
    };

    // Edit post handler
    const handleEditPost = (post) => {
        setEditingPost(post);
        setIsPostFormOpen(true);
    };

    // Delete post handler
    const handleDeletePost = (postId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            setPosts(posts.filter(post => post.id !== postId));
            // Also remove any comments for this post
            if (blogComments[postId]) {
                const newComments = { ...blogComments };
                delete newComments[postId];
                setBlogComments(newComments);
            }
            alert('Bài viết đã được xóa thành công!');
        }
    };

    // Open comment modal for a post
    const openCommentModal = (postId) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để bình luận!');
            navigate('/login');
            return;
        }

        setCommentModalPostId(postId);
    };

    // Close comment modal
    const closeCommentModal = () => {
        setCommentModalPostId(null);
    };

    // Add a new comment to a post
    const handleAddComment = (postId, newComment) => {
        // Update the comments object with the new comment
        setBlogComments(prevComments => {
            const postComments = prevComments[postId] || [];
            return {
                ...prevComments,
                [postId]: [...postComments, newComment]
            };
        });

        // Update the post's comment count
        setPosts(
            posts.map(post => {
                if (post.id === postId) {
                    return { ...post, comments: post.comments + 1 };
                }
                return post;
            })
        );
    };

    // Filter blog posts by search term and category
    const filteredPosts = posts.filter(post => {
        const searchContent = `${post.authorName} ${post.authorType} ${post.title} ${post.content}`.toLowerCase();
        const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || post.categories.includes(activeCategory);
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Modern Header with Gradient */}
            <header style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                padding: '1.5rem 0',
                boxShadow: '0 4px 20px rgba(52, 152, 219, 0.2)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    zIndex: 1,
                }}></div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    position: 'relative',
                    zIndex: 2,
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>←</span>
                        Quay Lại
                    </button>

                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                        <span style={{ color: '#ffffff' }}>Breathing</span>
                        <span style={{ color: '#ffffff' }}>Free</span>
                    </div>

                    {isLoggedIn ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'white',
                            fontWeight: 'bold',
                        }}>
                            <span style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: '#ffffff22',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                            }}>
                                {currentUser.avatar}
                            </span>
                            <span>{currentUser.name}</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backdropFilter: 'blur(5px)',
                                transition: 'all 0.2s',
                            }}
                        >
                            Đăng Nhập
                        </button>
                    )}
                </div>
            </header>

            {/* Title Banner */}
            <div style={{
                background: 'white',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                position: 'relative',
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#3498db',
                    margin: '0 0 1rem 0',
                    fontWeight: '700',
                    position: 'relative',
                    display: 'inline-block',
                }}>
                    Blog Cộng Đồng
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: '#3498db',
                        borderRadius: '2px',
                    }}></div>
                </h1>

                <p style={{
                    color: '#7f8c8d',
                    fontSize: '1.1rem',
                    maxWidth: '800px',
                    margin: '1.5rem auto 0',
                    lineHeight: '1.6',
                }}>
                    Nơi chia sẻ những câu chuyện, kinh nghiệm và kiến thức về cai thuốc lá từ cộng đồng và các chuyên gia
                </p>
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
        </div>
    );
};

export default BlogPage;