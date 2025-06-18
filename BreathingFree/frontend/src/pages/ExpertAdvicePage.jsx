import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

/**
 * ExpertAdvicePage - Trang lời khuyên từ chuyên gia
 * 
 * Component này hiển thị danh sách các lời khuyên và bài viết từ các chuyên gia
 * trong lĩnh vực cai nghiện thuốc lá. Người dùng có thể tìm kiếm và lọc
 * lời khuyên theo chuyên đề.
 */
const ExpertAdvicePage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all'); // Danh mục đang được chọn để lọc
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    // Lấy userName từ localStorage nếu có
    const userName = localStorage.getItem('userName') || '';

    // Dữ liệu mẫu về lời khuyên từ chuyên gia
    const expertAdvice = [
        {
            id: 1,
            expertName: 'BS. Nguyễn Đức Quảng',
            position: 'Phó Giám đốc Bệnh viện Phổi Hà Tĩnh',
            avatar: '👨‍⚕️',
            avatarColor: '#44b89d22',
            accentColor: '#44b89d',
            categories: ['Cai nghiện', 'Phổi học'],
            title: 'Giải pháp hỗ trợ khi gặp cơn thèm thuốc lá',
            content: 'Khi bạn gặp cơn thèm thuốc lá, điều quan trọng là phân tán sự chú ý của bạn. Hãy thử phương pháp 4D: Delay (Trì hoãn) - hãy đợi 5-10 phút, cơn thèm thuốc sẽ qua đi; Deep breathing (Hít thở sâu) - hít thở sâu và chậm; Drink water (Uống nước) - uống từng ngụm nhỏ nước; Distract (Chuyển hướng) - làm việc gì đó để phân tán sự chú ý. Nghiên cứu cho thấy mỗi cơn thèm thuốc chỉ kéo dài khoảng 5-10 phút, vì vậy nếu bạn có thể vượt qua khoảng thời gian này, bạn đã thành công.',
            date: '15/06/2023',
            readTime: '5 phút đọc'
        },
        {
            id: 2,
            expertName: 'BS. Bùi Duy Anh',
            position: 'Phòng Quản lý Chất lượng Bệnh viện Y học cổ truyền Trung ương',
            avatar: '👨‍⚕️',
            avatarColor: '#1976d222',
            accentColor: '#1976d2',
            categories: ['Y học cổ truyền', 'Châm cứu'],
            title: 'Phương pháp Nhĩ châm trong cai thuốc lá',
            content: 'Phương pháp nhĩ châm (châm cứu tai) đã được chứng minh là có hiệu quả trong việc giảm cơn thèm thuốc và các triệu chứng cai nghiện thuốc lá. Kỹ thuật này tác động lên các huyệt đặc biệt trên vành tai, giúp giảm ham muốn sử dụng nicotine và làm dịu các triệu chứng cai nghiện. Ngoài ra, các bài tập thở sâu kết hợp với châm cứu có thể giúp cân bằng năng lượng trong cơ thể, giảm căng thẳng và lo âu - những yếu tố thường làm tăng cơn thèm thuốc. Liệu trình điều trị thường kéo dài từ 4-6 tuần với 2-3 buổi mỗi tuần.',
            date: '03/08/2023',
            readTime: '6 phút đọc'
        },
        {
            id: 3,
            expertName: 'BS. Phạm Thị Hương',
            position: 'Trưởng khoa Nội, Bệnh viện Đại học Y Hà Nội',
            avatar: '👩‍⚕️',
            avatarColor: '#e74c3c22',
            accentColor: '#e74c3c',
            categories: ['Phổi học', 'Dinh dưỡng'],
            title: 'Dinh dưỡng và thực phẩm hỗ trợ cai thuốc lá',
            content: 'Dinh dưỡng đóng vai trò quan trọng trong quá trình cai thuốc lá. Hãy bổ sung các thực phẩm giàu vitamin C như cam, chanh, ớt chuông để giúp giảm căng thẳng và phục hồi tổn thương do hút thuốc. Thực phẩm giàu vitamin B như các loại đậu, ngũ cốc nguyên hạt giúp cải thiện tâm trạng và giảm stress. Hạt lanh, cá hồi và các loại hạt chứa omega-3 giúp chống viêm và hỗ trợ sức khỏe não bộ. Uống nhiều nước, trà xanh và nước ép rau củ giúp đào thải nicotine. Tránh caffeine, rượu bia và thực phẩm nhiều đường vì chúng có thể kích thích cơn thèm thuốc.',
            date: '22/09/2023',
            readTime: '7 phút đọc'
        },
        {
            id: 4,
            expertName: 'TS. Nguyễn Văn Bình',
            position: 'Giám đốc Trung tâm Kiểm soát Bệnh tật TP.HCM',
            avatar: '👨‍⚕️',
            avatarColor: '#9c27b022',
            accentColor: '#9c27b0',
            categories: ['Cai nghiện', 'Tâm lý học'],
            title: 'Kỹ thuật thay đổi nhận thức trong cai thuốc lá',
            content: 'Việc thay đổi nhận thức về thuốc lá là bước quan trọng trong quá trình cai nghiện. Nhiều người hút thuốc có những niềm tin sai lầm như "thuốc lá giúp giảm stress" hoặc "hút thuốc giúp tôi tập trung hơn". Thực tế, nicotine là một chất kích thích làm tăng nhịp tim và huyết áp, làm trầm trọng thêm sự căng thẳng. Kỹ thuật thay đổi nhận thức bao gồm: nhận diện những suy nghĩ tiêu cực hoặc không chính xác về thuốc lá, thách thức những suy nghĩ này bằng bằng chứng khoa học, và phát triển những suy nghĩ thay thế lành mạnh hơn. Hãy ghi nhớ rằng cơ thể bạn bắt đầu hồi phục ngay từ ngày đầu tiên bạn ngừng hút thuốc.',
            date: '05/10/2023',
            readTime: '8 phút đọc'
        },
        {
            id: 5,
            expertName: 'BS. Trần Minh Tuấn',
            position: 'Chuyên gia Tâm lý Trị liệu, Bệnh viện Tâm thần Trung ương',
            avatar: '👨‍⚕️',
            avatarColor: '#ff980022',
            accentColor: '#ff9800',
            categories: ['Tâm lý học', 'Cai nghiện'],
            title: 'Vượt qua căng thẳng và lo âu khi cai thuốc lá',
            content: 'Căng thẳng và lo âu là những thách thức phổ biến khi cai thuốc lá, và nhiều người quay lại hút thuốc để đối phó với những cảm xúc này. Các kỹ thuật quản lý stress hiệu quả bao gồm: thiền chánh niệm 10-15 phút mỗi ngày, tập yoga hoặc thái cực quyền, kỹ thuật thư giãn cơ bắp tiến bộ, và hoạt động thể chất đều đặn. Bên cạnh đó, xây dựng mạng lưới hỗ trợ xã hội, đặt mục tiêu thực tế và khen thưởng bản thân khi đạt được những cột mốc cũng rất quan trọng. Hãy nhớ rằng các triệu chứng lo âu thường đạt đỉnh trong 1-3 ngày đầu và sẽ giảm dần trong 3-4 tuần.',
            date: '18/11/2023',
            readTime: '6 phút đọc'
        },
        {
            id: 6,
            expertName: 'TS. Lê Thị Hồng',
            position: 'Trưởng khoa Dinh dưỡng, Bệnh viện Bạch Mai',
            avatar: '👩‍⚕️',
            avatarColor: '#4caf5022',
            accentColor: '#4caf50',
            categories: ['Dinh dưỡng', 'Phổi học'],
            title: 'Phục hồi phổi sau khi cai thuốc lá',
            content: 'Phổi có khả năng phục hồi đáng kể sau khi bạn ngừng hút thuốc. Sau 72 giờ, các ống phế quản thư giãn và khả năng hô hấp tăng lên. Sau 1-9 tháng, các nhung mao trong phổi phục hồi, giúp loại bỏ chất nhầy và giảm nguy cơ nhiễm trùng. Để hỗ trợ quá trình phục hồi, hãy tăng cường vận động thể chất để cải thiện dung tích phổi, bổ sung thực phẩm giàu chất chống oxy hóa (trái cây và rau quả nhiều màu sắc), uống đủ nước, và thực hiện các bài tập hô hấp như thở sâu và thở bụng. Vitamin A, C, E và các thực phẩm chứa beta-carotene đặc biệt có lợi cho sức khỏe phổi.',
            date: '02/12/2023',
            readTime: '7 phút đọc'
        }
    ];

    /**
     * Lọc danh sách lời khuyên dựa trên từ khóa tìm kiếm và danh mục đã chọn
     * - Tìm kiếm trong tên chuyên gia, chức vụ, tiêu đề và nội dung
     * - Lọc theo danh mục đã chọn
     */
    const filteredAdvice = expertAdvice.filter(advice => {
        const searchContent = `${advice.expertName} ${advice.position} ${advice.title} ${advice.content}`.toLowerCase();
        const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || advice.categories.includes(activeCategory);
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
                    color: '#35a79c',
                    margin: '0 0 1rem 0',
                    fontWeight: '700',
                    position: 'relative',
                    display: 'inline-block',
                }}>
                    Lời Khuyên Từ Chuyên Gia
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: '#44b89d',
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
                    Tổng hợp những lời khuyên, bài viết và kinh nghiệm hữu ích từ các chuyên gia trong lĩnh vực cai nghiện thuốc lá
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
                        }}>Tìm kiếm lời khuyên</h2>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm theo tên chuyên gia, chủ đề, nội dung..."
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
                                background: '#44b89d',
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
                                    background: activeCategory === 'all' ? '#44b89d' : '#e5e8ee',
                                    color: activeCategory === 'all' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Tất Cả
                            </button>
                            <button
                                onClick={() => setActiveCategory('Cai nghiện')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Cai nghiện' ? '#44b89d' : '#e5e8ee',
                                    color: activeCategory === 'Cai nghiện' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Cai Nghiện
                            </button>
                            <button
                                onClick={() => setActiveCategory('Phổi học')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Phổi học' ? '#44b89d' : '#e5e8ee',
                                    color: activeCategory === 'Phổi học' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Phổi Học
                            </button>
                            <button
                                onClick={() => setActiveCategory('Y học cổ truyền')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Y học cổ truyền' ? '#44b89d' : '#e5e8ee',
                                    color: activeCategory === 'Y học cổ truyền' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Y Học Cổ Truyền
                            </button>
                            <button
                                onClick={() => setActiveCategory('Dinh dưỡng')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Dinh dưỡng' ? '#44b89d' : '#e5e8ee',
                                    color: activeCategory === 'Dinh dưỡng' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Dinh Dưỡng
                            </button>
                            <button
                                onClick={() => setActiveCategory('Tâm lý học')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === 'Tâm lý học' ? '#44b89d' : '#e5e8ee',
                                    color: activeCategory === 'Tâm lý học' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Tâm Lý Học
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expert Advice Cards */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}>
                    {filteredAdvice.map(advice => (
                        <div key={advice.id} style={{
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
                                        background: advice.avatarColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.8rem',
                                        flexShrink: 0,
                                    }}>
                                        {advice.avatar}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            margin: '0 0 0.3rem 0',
                                            fontSize: '1.2rem',
                                            fontWeight: '700',
                                            color: '#2c3e50',
                                        }}>
                                            {advice.expertName}
                                        </h3>
                                        <p style={{
                                            margin: '0',
                                            color: '#7f8c8d',
                                            fontSize: '0.9rem',
                                        }}>
                                            {advice.position}
                                        </p>
                                    </div>
                                </div>

                                <h2 style={{
                                    margin: '0 0 1rem 0',
                                    fontSize: '1.6rem',
                                    fontWeight: '700',
                                    color: advice.accentColor,
                                }}>
                                    {advice.title}
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
                                        {advice.date}
                                    </span>
                                    <span style={{
                                        color: '#7f8c8d',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                    }}>
                                        <span style={{ fontSize: '1.1rem' }}>⏱️</span>
                                        {advice.readTime}
                                    </span>
                                    <div style={{ flexGrow: 1 }}></div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {advice.categories.map((category, i) => (
                                            <span key={i} style={{
                                                padding: '0.3rem 0.8rem',
                                                background: `${advice.accentColor}22`,
                                                color: advice.accentColor,
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
                                    {advice.content}
                                </p>
                            </div>

                            <div style={{
                                padding: '1rem 2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: '#f9f9f9',
                            }}>
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
                                    <span style={{ fontSize: '1.1rem' }}>👍</span>
                                    Hữu ích
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
                                    <span style={{ fontSize: '1.1rem' }}>💬</span>
                                    Bình luận
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
            </div>
        </div>
    );
};

export default ExpertAdvicePage; 