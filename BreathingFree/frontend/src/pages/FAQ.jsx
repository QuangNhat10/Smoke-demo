import React, { useState } from 'react';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

// Component FAQ - Hiển thị danh sách câu hỏi thường gặp và câu trả lời
const FAQ = () => {
    // State quản lý câu hỏi đang được mở
    const [activeQuestion, setActiveQuestion] = useState(null);
    // State quản lý từ khóa tìm kiếm
    const [searchQuery, setSearchQuery] = useState('');

    // Dữ liệu câu hỏi và trả lời được phân loại theo danh mục
    const faqData = [
        {
            category: "Thông Tin Chung",
            questions: [
                {
                    id: 1,
                    question: "Tại sao tôi nên cai thuốc lá?",
                    answer: "Cai thuốc lá mang lại nhiều lợi ích cho sức khỏe như giảm nguy cơ ung thư phổi, bệnh tim mạch, và các bệnh hô hấp. Ngoài ra, bạn còn tiết kiệm được tiền, cải thiện mùi hơi thở và không ảnh hưởng đến người xung quanh."
                },
                {
                    id: 2,
                    question: "Khi nào là thời điểm tốt nhất để bắt đầu cai thuốc?",
                    answer: "Thời điểm tốt nhất để cai thuốc là NGAY BÂY GIỜ. Tuy nhiên, bạn nên lên kế hoạch cụ thể và chuẩn bị tinh thần trước khi bắt đầu. Chọn ngày có ít stress và tránh các sự kiện có thể kích thích việc hút thuốc."
                }
            ]
        },
        {
            category: "Triệu Chứng Cai Thuốc",
            questions: [
                {
                    id: 3,
                    question: "Các triệu chứng cai thuốc lá phổ biến là gì?",
                    answer: "Các triệu chứng phổ biến bao gồm: thèm thuốc, khó tập trung, dễ cáu gắt, lo âu, trầm cảm, đau đầu, khó ngủ, tăng cảm giác đói. Những triệu chứng này thường kéo dài từ vài ngày đến vài tuần và sẽ giảm dần theo thời gian."
                },
                {
                    id: 4,
                    question: "Triệu chứng cai thuốc kéo dài bao lâu?",
                    answer: "Triệu chứng cai thuốc mạnh nhất thường xuất hiện trong 24-48 giờ đầu tiên và giảm dần trong 2-3 tuần. Tuy nhiên, cảm giác thèm thuốc có thể kéo dài vài tháng hoặc lâu hơn. Mỗi người sẽ có trải nghiệm khác nhau."
                }
            ]
        },
        {
            category: "Phương Pháp Cai Thuốc",
            questions: [
                {
                    id: 5,
                    question: "Có những phương pháp cai thuốc nào hiệu quả?",
                    answer: "Có nhiều phương pháp cai thuốc khác nhau: cai thuốc đột ngột, giảm dần, sử dụng nicotine thay thế (miếng dán, kẹo cao su), thuốc kê đơn, tư vấn tâm lý, thiền, yoga, và tập thể dục. Bạn có thể kết hợp nhiều phương pháp để tăng hiệu quả."
                },
                {
                    id: 6,
                    question: "Làm thế nào để đối phó với cơn thèm thuốc?",
                    answer: "Một số cách đối phó với cơn thèm thuốc: uống nhiều nước, ăn đồ ăn nhẹ lành mạnh, tập thể dục, hít thở sâu, tìm việc để tay bận rộn, tránh các yếu tố kích thích, và nhờ sự hỗ trợ từ người thân. Cơn thèm thuốc thường chỉ kéo dài 3-5 phút."
                }
            ]
        },
        {
            category: "Hỗ Trợ & Tư Vấn",
            questions: [
                {
                    id: 7,
                    question: "Làm thế nào để đặt lịch tư vấn với bác sĩ?",
                    answer: "Bạn có thể đặt lịch tư vấn trực tiếp thông qua mục 'Đặt Lịch' trong ứng dụng. Chọn bác sĩ phù hợp, chọn thời gian và điền thông tin cần thiết. Bạn sẽ nhận được xác nhận qua email hoặc tin nhắn."
                },
                {
                    id: 8,
                    question: "Tôi có thể nhận hỗ trợ tâm lý ở đâu khi cai thuốc?",
                    answer: "Ứng dụng của chúng tôi cung cấp nhiều hình thức hỗ trợ: tư vấn trực tuyến với bác sĩ, nhóm hỗ trợ cai thuốc, diễn đàn cộng đồng, và đường dây nóng 24/7. Bạn cũng có thể tham gia các buổi trị liệu nhóm hoặc cá nhân."
                }
            ]
        },
        {
            category: "Lợi Ích & Kết Quả",
            questions: [
                {
                    id: 9,
                    question: "Cơ thể sẽ phục hồi như thế nào sau khi cai thuốc?",
                    answer: "- Sau 20 phút: Huyết áp và nhịp tim giảm\n- Sau 12 giờ: Nồng độ CO trong máu giảm về bình thường\n- Sau 2-12 tuần: Tuần hoàn cải thiện\n- Sau 1-9 tháng: Ho và khó thở giảm\n- Sau 1 năm: Nguy cơ bệnh tim giảm 50%\n- Sau 5-15 năm: Nguy cơ đột quỵ và ung thư giảm đáng kể"
                },
                {
                    id: 10,
                    question: "Làm thế nào để duy trì động lực cai thuốc lâu dài?",
                    answer: "- Đặt mục tiêu rõ ràng và theo dõi tiến độ\n- Tính toán số tiền tiết kiệm được\n- Tham gia cộng đồng cai thuốc\n- Thưởng cho bản thân khi đạt được mốc quan trọng\n- Ghi nhật ký cảm xúc và thay đổi sức khỏe\n- Tìm sở thích mới thay thế việc hút thuốc"
                }
            ]
        }
    ];

    // Lọc câu hỏi dựa trên từ khóa tìm kiếm
    // Trả về danh sách các danh mục chỉ chứa các câu hỏi phù hợp với từ khóa
    const filteredFAQ = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    // Xử lý sự kiện khi người dùng click vào câu hỏi
    // Mở/đóng câu trả lời tương ứng
    const handleQuestionClick = (id) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };

    return (
        // Container chính với gradient background
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)'
        }}>
            <Header />
            <SecondaryNavigation />

            {/* Phần nội dung chính */}
            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 2rem'
            }}>
                {/* Phần tiêu đề và mô tả */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem'
                }}>
                    <h1 style={{
                        color: '#2C9085',
                        fontSize: '2.5rem',
                        marginBottom: '1rem'
                    }}>Câu Hỏi Thường Gặp</h1>
                    <p style={{
                        color: '#666',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Tìm câu trả lời cho những thắc mắc phổ biến về cai thuốc lá
                    </p>
                </div>

                {/* Thanh tìm kiếm */}
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto 3rem'
                }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm câu hỏi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1.5rem',
                            fontSize: '1rem',
                            border: '2px solid #e0e0e0',
                            borderRadius: '30px',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'white'
                        }}
                    />
                </div>

                {/* Danh sách các danh mục FAQ */}
                {filteredFAQ.map((category) => (
                    <div
                        key={category.category}
                        style={{
                            marginBottom: '2rem'
                        }}
                    >
                        {/* Tiêu đề danh mục */}
                        <h2 style={{
                            color: '#2C9085',
                            fontSize: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>{category.category}</h2>

                        {/* Danh sách câu hỏi trong danh mục */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {category.questions.map((item) => (
                                // Container cho mỗi câu hỏi
                                <div
                                    key={item.id}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    {/* Nút mở/đóng câu hỏi */}
                                    <button
                                        onClick={() => handleQuestionClick(item.id)}
                                        style={{
                                            width: '100%',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            color: '#2C9085',
                                            fontWeight: '600',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {item.question}
                                        {/* Icon mũi tên xoay */}
                                        <span style={{
                                            transform: activeQuestion === item.id ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s ease'
                                        }}>▾</span>
                                    </button>

                                    {/* Phần câu trả lời */}
                                    <div style={{
                                        padding: activeQuestion === item.id ? '0 1.5rem 1.5rem' : '0 1.5rem',
                                        maxHeight: activeQuestion === item.id ? '500px' : '0',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        color: '#666',
                                        lineHeight: '1.6'
                                    }}>
                                        {item.answer.split('\n').map((line, index) => (
                                            <p key={index} style={{ marginBottom: '0.5rem' }}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Phần liên hệ hỗ trợ */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '4rem',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                    <h3 style={{
                        color: '#2C9085',
                        marginBottom: '1rem'
                    }}>Không tìm thấy câu trả lời bạn cần?</h3>
                    <p style={{
                        color: '#666',
                        marginBottom: '1.5rem'
                    }}>
                        Liên hệ với đội ngũ hỗ trợ của chúng tôi để được giúp đỡ
                    </p>
                    <button
                        onClick={() => window.location.href = '/support-chat'}
                        style={{
                            background: '#2C9085',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Liên Hệ Hỗ Trợ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQ; 