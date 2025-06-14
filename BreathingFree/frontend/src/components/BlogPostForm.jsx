import React, { useState, useEffect } from 'react';

// Component BlogPostForm dùng để tạo mới hoặc chỉnh sửa bài viết blog
const BlogPostForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    // Tiêu đề bài viết
    const [title, setTitle] = useState('');
    // Nội dung bài viết
    const [content, setContent] = useState('');
    // Chủ đề đang nhập
    const [category, setCategory] = useState('');
    // Danh sách các chủ đề đã chọn
    const [categories, setCategories] = useState([]);

    // Load dữ liệu ban đầu khi chỉnh sửa bài viết
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setCategories(initialData.categories);
        } else {
            // Reset form khi tạo mới
            setTitle('');
            setContent('');
            setCategory('');
            setCategories([]);
        }
    }, [initialData]);

    // Danh sách các chủ đề gợi ý
    const suggestedCategories = [
        'Chia sẻ',
        'Kinh nghiệm',
        'Sức khỏe',
        'Tác hại',
        'Phương pháp',
        'Điều trị',
        'Động lực',
        'Phổi học',
        'Thói quen',
        'Dinh dưỡng',
        'Tâm lý',
        'Lối sống'
    ];

    // Thêm chủ đề mới vào danh sách
    const handleAddCategory = () => {
        if (category && !categories.includes(category)) {
            setCategories([...categories, category]);
            setCategory('');
        }
    };

    // Xử lý khi người dùng chọn một chủ đề gợi ý
    const handleSelectSuggestedCategory = (suggestedCategory) => {
        if (!categories.includes(suggestedCategory)) {
            setCategories([...categories, suggestedCategory]);
        }
    };

    // Xóa chủ đề khỏi danh sách đã chọn
    const handleRemoveCategory = (categoryToRemove) => {
        setCategories(categories.filter(cat => cat !== categoryToRemove));
    };

    // Đóng form và reset dữ liệu
    const handleClose = () => {
        setTitle('');
        setContent('');
        setCategory('');
        setCategories([]);
        onClose();
    };

    // Xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim() || categories.length === 0) {
            alert('Vui lòng điền đầy đủ tiêu đề, nội dung và ít nhất một chủ đề');
            return;
        }

        const postData = {
            title,
            content,
            categories,
            date: new Date().toLocaleDateString('vi-VN'),
            readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 200))} phút đọc`,
        };

        onSubmit(postData);

        setTitle('');
        setContent('');
        setCategory('');
        setCategories([]);
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
                maxWidth: '800px',
                width: '90%',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={handleClose}
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
                    fontSize: '1.8rem',
                    color: '#3498db',
                    fontWeight: '700',
                    position: 'relative',
                    paddingBottom: '15px'
                }}>
                    {initialData ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '4px',
                        background: '#3498db',
                        borderRadius: '2px'
                    }}></div>
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="title"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#2c3e50'
                            }}
                        >
                            Tiêu đề bài viết *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1.5px solid #e5e8ee',
                                fontSize: '1rem',
                                outline: 'none',
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="content"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#2c3e50'
                            }}
                        >
                            Nội dung bài viết *
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Chia sẻ kinh nghiệm, câu chuyện của bạn..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1.5px solid #e5e8ee',
                                fontSize: '1rem',
                                outline: 'none',
                                minHeight: '200px',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                color: '#2c3e50'
                            }}
                        >
                            Chủ đề *
                        </label>

                        {/* Phần chọn chủ đề gợi ý */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#7f8c8d',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Chọn từ chủ đề gợi ý:
                            </label>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                            }}>
                                {suggestedCategories.map((cat) => {
                                    const isSelected = categories.includes(cat);
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleSelectSuggestedCategory(cat)}
                                            disabled={isSelected}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                background: isSelected ? '#e5e8ee' : '#f8f9fa',
                                                border: '1px solid #e5e8ee',
                                                borderRadius: '20px',
                                                fontSize: '0.9rem',
                                                cursor: isSelected ? 'default' : 'pointer',
                                                color: isSelected ? '#7f8c8d' : '#2c3e50',
                                                opacity: isSelected ? 0.7 : 1,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat} {isSelected && '✓'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Phần thêm chủ đề tùy chỉnh */}
                        <label
                            htmlFor="category"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#7f8c8d',
                                fontSize: '0.9rem'
                            }}
                        >
                            Hoặc thêm chủ đề mới:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                id="category"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Nhập chủ đề mới..."
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid #e5e8ee',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                style={{
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0 1.5rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                            >
                                Thêm
                            </button>
                        </div>

                        {/* Hiển thị các chủ đề đã chọn */}
                        {categories.length > 0 && (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px dashed #e5e8ee'
                            }}>
                                <label
                                    style={{
                                        width: '100%',
                                        fontWeight: '500',
                                        color: '#7f8c8d',
                                        fontSize: '0.9rem',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    Các chủ đề đã chọn:
                                </label>
                                {categories.map((cat, idx) => (
                                    <span key={idx} style={{
                                        background: '#3498db22',
                                        color: '#3498db',
                                        borderRadius: '50px',
                                        padding: '0.3rem 0.8rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}>
                                        {cat}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCategory(cat)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#3498db',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0',
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                        <button
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.9rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>✏️</span>
                            {initialData ? 'Cập Nhật Bài Viết' : 'Đăng Bài'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogPostForm; 