import React, { useState, useEffect } from 'react';

// Component CommentModal dùng để hiển thị modal bình luận cho một bài viết
const CommentModal = ({ isOpen, onClose, comments, onAddComment, postId }) => {
    // Trạng thái lưu nội dung bình luận mới
    const [newComment, setNewComment] = useState('');
    // Thông tin người dùng hiện tại (lấy từ localStorage)
    const [currentUser, setCurrentUser] = useState({
        name: 'Người dùng',
        avatar: '👤',
        avatarColor: '#3498db22'
    });

    // Lấy thông tin người dùng từ localStorage khi component mount
    useEffect(() => {
        const userName = localStorage.getItem('userName');
        if (userName) {
            setCurrentUser(prev => ({
                ...prev,
                name: userName
            }));
        }
    }, []);

    // Hàm xử lý khi người dùng thêm bình luận mới
    const handleAddComment = () => {
        if (!newComment.trim()) return;

        onAddComment(postId, {
            id: Date.now(),
            authorName: currentUser.name,
            avatar: currentUser.avatar,
            avatarColor: currentUser.avatarColor,
            content: newComment,
            date: new Date().toLocaleDateString('vi-VN'),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        });

        setNewComment('');
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)',
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'rgba(0,0,0,0.05)',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#666',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                    }}
                >
                    ✕
                </button>

                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    fontSize: '1.6rem',
                    color: '#3498db',
                    fontWeight: '700',
                    position: 'relative',
                    paddingBottom: '15px'
                }}>
                    Bình Luận
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50px',
                        height: '3px',
                        background: '#3498db',
                        borderRadius: '2px'
                    }}></div>
                </h2>

                <div style={{
                    marginBottom: '2rem',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    paddingRight: '10px'
                }}>
                    {comments.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 0',
                            color: '#7f8c8d',
                            fontStyle: 'italic'
                        }}>
                            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                        }}>
                            {comments.map((comment) => (
                                <div key={comment.id} style={{
                                    padding: '1rem',
                                    background: '#f8f9fa',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e8ee',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        marginBottom: '0.8rem',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: comment.avatarColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.4rem',
                                        }}>
                                            {comment.avatar}
                                        </div>
                                        <div>
                                            <h4 style={{
                                                margin: '0 0 0.2rem 0',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                            }}>
                                                {comment.authorName}
                                            </h4>
                                            <p style={{
                                                margin: '0',
                                                fontSize: '0.8rem',
                                                color: '#7f8c8d',
                                            }}>
                                                {comment.date} • {comment.time}
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{
                                        margin: '0',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5',
                                        color: '#2c3e50',
                                    }}>
                                        {comment.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        marginBottom: '1rem',
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: currentUser.avatarColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.4rem',
                            flexShrink: 0,
                        }}>
                            {currentUser.avatar}
                        </div>
                        <div style={{
                            flex: 1,
                            position: 'relative',
                        }}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '20px',
                                    border: '1.5px solid #e5e8ee',
                                    fontSize: '0.95rem',
                                    resize: 'none',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    minHeight: '60px',
                                }}
                            />
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '1rem',
                    }}>
                        <button
                            onClick={handleAddComment}
                            style={{
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.6rem 1.2rem',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>💬</span>
                            Bình Luận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentModal; 