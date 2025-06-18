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

    // Lấy userName từ localStorage nếu có
    const userName = localStorage.getItem('userName') || '';

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

    // Dữ liệu mẫu về các bài viết blog
    const [blogPosts, setBlogPosts] = useState([
        {
            id: 1,
            authorName: 'Trần Văn Minh',
            authorType: 'Người dùng',
            avatar: '👨',
            avatarColor: '#3498db22',
            accentColor: '#3498db',
            categories: ['Chia sẻ', 'Kinh nghiệm'],
            title: 'Hành trình cai thuốc lá của tôi sau 15 năm',
            content: 'Tôi đã hút thuốc lá trong suốt 15 năm và đã thử cai thuốc nhiều lần nhưng không thành công. Lần này, tôi đã áp dụng phương pháp giảm dần số điếu thuốc mỗi ngày kết hợp với việc thay thế bằng kẹo cao su không đường. Trong hai tuần đầu, tôi giảm từ 20 điếu xuống còn 10 điếu mỗi ngày. Sau đó, tôi tiếp tục giảm xuống 5 điếu và cuối cùng là 0 trong vòng 1 tháng. Mỗi khi cảm thấy thèm thuốc, tôi uống nhiều nước, đi bộ hoặc tập thể dục nhẹ để phân tán sự chú ý. Điều quan trọng nhất là phải có quyết tâm thực sự và hiểu rõ lợi ích của việc cai thuốc lá. Bây giờ, sau 6 tháng không hút thuốc, sức khỏe của tôi đã cải thiện rõ rệt, tôi không còn ho vào buổi sáng và cảm thấy năng động hơn nhiều.',
            date: '10/07/2023',
            readTime: '5 phút đọc',
            likes: 45,
            comments: 12,
            liked: false
        },
        {
            id: 2,
            authorName: 'BS. Nguyễn Thị Hương',
            authorType: 'Chuyên gia',
            avatar: '👨‍⚕️',
            avatarColor: '#e74c3c22',
            accentColor: '#e74c3c',
            categories: ['Sức khỏe', 'Tác hại'],
            title: 'Những tác hại ít biết đến của thuốc lá với hệ tiêu hóa',
            content: 'Nhiều người biết rằng thuốc lá gây hại cho phổi, nhưng ít ai nhận thức được tác động nghiêm trọng của nó đối với hệ tiêu hóa. Thuốc lá làm tăng nguy cơ mắc bệnh trào ngược dạ dày thực quản (GERD) do làm suy yếu cơ vòng thực quản dưới. Nó cũng làm tăng nguy cơ ung thư miệng, thực quản, dạ dày và tuyến tụy. Người hút thuốc có nguy cơ mắc bệnh Crohn cao gấp đôi so với người không hút thuốc. Nicotine trong thuốc lá cũng làm giảm khả năng cảm nhận vị giác và mùi, khiến thức ăn kém hấp dẫn hơn. Hút thuốc còn làm chậm quá trình chữa lành các vết loét trong dạ dày và tá tràng. Việc cai thuốc lá không chỉ cải thiện sức khỏe phổi mà còn giúp hệ tiêu hóa phục hồi đáng kể, giảm các triệu chứng tiêu hóa và cải thiện chất lượng cuộc sống.',
            date: '25/08/2023',
            readTime: '7 phút đọc',
            likes: 78,
            comments: 23,
            liked: false
        },
        {
            id: 3,
            authorName: 'Lê Thị Hồng',
            authorType: 'Người dùng',
            avatar: '👩',
            avatarColor: '#9b59b622',
            accentColor: '#9b59b6',
            categories: ['Chia sẻ', 'Động lực'],
            title: 'Những thay đổi tích cực sau 3 tháng cai thuốc lá',
            content: 'Ba tháng trước, tôi quyết định cai thuốc lá sau khi phát hiện có vấn đề về hô hấp. Thời gian đầu thực sự khó khăn với những cơn thèm thuốc dữ dội và cảm giác bồn chồn không yên. Tuy nhiên, sau 3 tháng kiên trì, tôi đã nhận thấy nhiều thay đổi đáng kinh ngạc. Đầu tiên là khứu giác và vị giác của tôi đã trở lại mạnh mẽ, giúp tôi thưởng thức thức ăn ngon hơn bao giờ hết. Làn da của tôi trở nên tươi sáng và khỏe mạnh hơn, không còn vẻ xanh xao như trước. Tôi không còn thức dậy với cảm giác đờ đẫn và cơn ho dai dẳng buổi sáng. Khả năng tập thể dục của tôi cũng cải thiện rõ rệt, tôi có thể chạy được quãng đường dài hơn mà không cảm thấy khó thở. Ngoài ra, tôi tiết kiệm được một khoản tiền đáng kể mỗi tháng khi không phải mua thuốc lá nữa. Cai thuốc lá là một trong những quyết định tốt nhất mà tôi từng thực hiện cho sức khỏe và hạnh phúc của mình.',
            date: '03/09/2023',
            readTime: '6 phút đọc',
            likes: 56,
            comments: 18,
            liked: false
        },
        {
            id: 4,
            authorName: 'TS. Đặng Quốc Tuấn',
            authorType: 'Chuyên gia',
            avatar: '👨‍⚕️',
            avatarColor: '#2ecc7122',
            accentColor: '#2ecc71',
            categories: ['Điều trị', 'Phương pháp'],
            title: 'Liệu pháp thay thế nicotine: Hiệu quả và cách sử dụng',
            content: 'Liệu pháp thay thế nicotine (Nicotine Replacement Therapy - NRT) là một trong những phương pháp hiệu quả giúp cai thuốc lá. NRT hoạt động bằng cách cung cấp nicotine với liều lượng thấp hơn so với thuốc lá, giúp giảm các triệu chứng cai nghiện mà không chứa các hóa chất độc hại trong khói thuốc. NRT có nhiều dạng khác nhau như miếng dán, kẹo cao su, viên ngậm, ống hít và thuốc xịt mũi. Miếng dán nicotine giải phóng nicotine từ từ qua da và duy trì mức nicotine ổn định trong máu, phù hợp với người hút thuốc đều đặn. Kẹo cao su và viên ngậm nicotine giúp giải quyết nhanh cơn thèm thuốc đột ngột. Nghiên cứu cho thấy NRT có thể tăng tỉ lệ cai thuốc thành công lên 50-70%. Tuy nhiên, để đạt hiệu quả cao nhất, NRT nên được sử dụng kết hợp với tư vấn tâm lý và thay đổi lối sống. Người dùng cần tuân thủ hướng dẫn sử dụng và thời gian điều trị, thường kéo dài 8-12 tuần, với liều lượng giảm dần theo thời gian.',
            date: '15/10/2023',
            readTime: '8 phút đọc',
            likes: 92,
            comments: 31,
            liked: false
        },
        {
            id: 5,
            authorName: 'Phạm Thanh Bình',
            authorType: 'Người dùng',
            avatar: '👨',
            avatarColor: '#f39c1222',
            accentColor: '#f39c12',
            categories: ['Kinh nghiệm', 'Động lực'],
            title: 'Vượt qua cám dỗ: Cách đối phó với môi trường hút thuốc',
            content: 'Một trong những thách thức lớn nhất khi cai thuốc lá là phải đối mặt với môi trường xung quanh vẫn còn nhiều người hút thuốc, đặc biệt là bạn bè và đồng nghiệp. Từ kinh nghiệm cá nhân sau 1 năm cai thuốc thành công, tôi muốn chia sẻ một số cách để vượt qua cám dỗ này. Đầu tiên, hãy thẳng thắn nói với mọi người về quyết định cai thuốc của bạn và nhờ họ tôn trọng điều đó. Thứ hai, tránh những nơi mà bạn thường hút thuốc trước đây, như quán cà phê hay khu vực hút thuốc ở nơi làm việc. Thứ ba, chuẩn bị trước các phản ứng cho những tình huống cám dỗ, như uống nước, ăn nhẹ hoặc chơi với đồ chơi giảm căng thẳng. Thứ tư, tìm những người bạn không hút thuốc để giao lưu trong thời gian đầu cai thuốc. Cuối cùng, hãy nhớ rằng mỗi lần bạn từ chối một điếu thuốc là một chiến thắng nhỏ, và những chiến thắng nhỏ này sẽ tích lũy thành thành công lớn.',
            date: '07/11/2023',
            readTime: '6 phút đọc',
            likes: 67,
            comments: 20,
            liked: false
        },
        {
            id: 6,
            authorName: 'BS. Vũ Thị Mai Anh',
            authorType: 'Chuyên gia',
            avatar: '👩‍⚕️',
            avatarColor: '#1abc9c22',
            accentColor: '#1abc9c',
            categories: ['Sức khỏe', 'Phổi học'],
            title: 'Phục hồi sức khỏe phổi sau thời gian dài hút thuốc lá',
            content: 'Phổi có khả năng phục hồi đáng kể ngay cả sau nhiều năm hút thuốc lá. Khi bạn ngừng hút thuốc, quá trình phục hồi bắt đầu ngay lập tức. Sau 20 phút, nhịp tim và huyết áp giảm. Sau 12 giờ, mức carbon monoxide trong máu giảm về mức bình thường. Sau 2-12 tuần, tuần hoàn cải thiện và chức năng phổi tăng lên. Sau 1-9 tháng, ho và khó thở giảm khi các nhung mao trong phổi phục hồi. Sau 1 năm, nguy cơ mắc bệnh động mạch vành giảm một nửa. Sau 5-15 năm, nguy cơ đột quỵ giảm xuống bằng người không hút thuốc. Để hỗ trợ quá trình phục hồi phổi, bạn nên tăng cường tập thể dục aerobic như đi bộ, bơi lội hoặc đạp xe để cải thiện dung tích phổi. Bổ sung thực phẩm giàu chất chống oxy hóa như trái cây và rau quả nhiều màu sắc để chống lại tổn thương do các gốc tự do. Uống nhiều nước để giúp long đờm và làm sạch phổi. Thực hiện các bài tập hô hấp như thở sâu và thở bụng để tăng cường chức năng phổi. Vitamin A, C, E và các thực phẩm chứa beta-carotene đặc biệt có lợi cho sức khỏe phổi.',
            date: '20/12/2023',
            readTime: '7 phút đọc',
            likes: 105,
            comments: 42,
            liked: false
        }
    ]);

    /**
     * Kiểm tra xem bài viết có thuộc về người dùng đang đăng nhập không
     * @param {Object} post - Bài viết cần kiểm tra
     * @returns {boolean} True nếu bài viết thuộc về người dùng đang đăng nhập
     */
    const isUserPost = (post) => {
        return isLoggedIn && post.authorName === currentUser.name;
    };

    /**
     * Khởi tạo dữ liệu bình luận mẫu
     */
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
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header và SecondaryNavigation */}
            <Header userName={userName} />
            <SecondaryNavigation />

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