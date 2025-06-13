// Import các thư viện và component cần thiết
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

// Component Bảng xếp hạng người dùng
const Rankings = () => {
    // Dữ liệu mẫu về xếp hạng người dùng
    const [rankings] = useState([
        { id: 1, name: 'Nguyễn Văn A', daysSmokeFree: 365, points: 4500 },
        { id: 2, name: 'Trần Thị B', daysSmokeFree: 287, points: 3970 },
        { id: 3, name: 'Phạm Văn C', daysSmokeFree: 240, points: 3650 },
        { id: 4, name: 'Lê Thị D', daysSmokeFree: 192, points: 3200 },
        { id: 5, name: 'Hoàng Văn E', daysSmokeFree: 178, points: 2950 },
        { id: 6, name: 'Nguyễn Thị F', daysSmokeFree: 150, points: 2580 },
        { id: 7, name: 'Vũ Văn G', daysSmokeFree: 130, points: 2200 },
        { id: 8, name: 'Đặng Thị H', daysSmokeFree: 110, points: 1890 },
        { id: 9, name: 'Bùi Văn I', daysSmokeFree: 95, points: 1650 },
        { id: 10, name: 'Trương Thị K', daysSmokeFree: 82, points: 1480 },
    ]);

    // Lấy tên người dùng hiện tại từ localStorage nếu có
    const [currentUser, setCurrentUser] = useState(null);

    // Effect hook để lấy tên người dùng khi component được mount
    useEffect(() => {
        const userName = localStorage.getItem('userName');
        if (userName) {
            setCurrentUser(userName);
        }
    }, []);

    // Tìm thứ hạng của người dùng hiện tại trong bảng xếp hạng
    const currentUserRank = currentUser ? rankings.findIndex(user => user.name === currentUser) + 1 : -1;

    // Effect hook để đặt tiêu đề cho trang
    useEffect(() => {
        document.title = "Bảng Xếp Hạng | Cùng Nhau Cai Thuốc Lá";
    }, []);

    return (
        <>
            <Header />
            <SecondaryNavigation />

            {/* Phần nội dung chính của trang */}
            <main className="rankings-page">
                <div className="container">
                    <h1 className="page-title">Bảng Xếp Hạng</h1>
                    <p className="page-description">
                        Theo dõi thành tích cai thuốc của cộng đồng và phấn đấu để đạt thứ hạng cao nhất!
                    </p>

                    {/* Bảng xếp hạng */}
                    <div className="ranking-table-container">
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>Hạng</th>
                                    <th>Người Dùng</th>
                                    <th>Ngày Không Hút Thuốc</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Hiển thị danh sách người dùng và thứ hạng */}
                                {rankings.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className={`${index < 3 ? 'top-rank' : ''} ${user.name === currentUser ? 'current-user' : ''}`}
                                    >
                                        <td className="rank-column">
                                            {/* Hiển thị huy chương cho top 3 */}
                                            {index === 0 && <span className="rank-badge gold">🥇</span>}
                                            {index === 1 && <span className="rank-badge silver">🥈</span>}
                                            {index === 2 && <span className="rank-badge bronze">🥉</span>}
                                            {index > 2 && <span className="rank-number">{index + 1}</span>}
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.daysSmokeFree} ngày</td>
                                        <td className="points-column">{user.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Hiển thị thông tin xếp hạng của người dùng hiện tại */}
                    {currentUser && currentUserRank > 0 && (
                        <div className="user-status-container">
                            <h3>Thứ hạng của bạn</h3>
                            <div className="user-rank-card">
                                <div className="user-rank-number">{currentUserRank}</div>
                                <div className="user-rank-details">
                                    <p className="user-rank-name">{currentUser}</p>
                                    <p className="user-rank-points">{rankings[currentUserRank - 1]?.points || 0} điểm</p>
                                </div>
                                <div className="user-rank-days">{rankings[currentUserRank - 1]?.daysSmokeFree || 0} ngày</div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer của trang */}
            <footer className="simple-footer">
                <div className="container">
                    <p>© {new Date().getFullYear()} Cùng Nhau Cai Thuốc Lá. All rights reserved.</p>
                </div>
            </footer>

            {/* Styles cho component */}
            <style jsx>{`
                /* Style cho trang bảng xếp hạng */
                .rankings-page {
                    padding: 3rem 0;
                    background-color: #f8f9fa;
                    min-height: 70vh;
                }
                
                /* Style cho tiêu đề trang */
                .page-title {
                    color: var(--primary-color);
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                    font-weight: 700;
                }
                
                /* Style cho mô tả trang */
                .page-description {
                    text-align: center;
                    max-width: 700px;
                    margin: 0 auto 3rem;
                    color: var(--text-light);
                    font-size: 1.1rem;
                }
                
                /* Style cho container bảng xếp hạng */
                .ranking-table-container {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    margin-bottom: 2rem;
                }
                
                /* Style cho bảng xếp hạng */
                .ranking-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                /* Style cho header của bảng */
                .ranking-table th {
                    background-color: #f0f7ff;
                    padding: 1.2rem 1rem;
                    text-align: left;
                    color: #2c3e50;
                    font-weight: 600;
                    font-size: 1.05rem;
                }
                
                /* Style cho các ô trong bảng */
                .ranking-table td {
                    padding: 1.2rem 1rem;
                    border-top: 1px solid #edf2f7;
                }
                
                /* Hiệu ứng hover cho hàng trong bảng */
                .ranking-table tr:hover {
                    background-color: #f9fafb;
                }
                
                /* Style cho top 3 người dùng */
                .top-rank td {
                    font-weight: 600;
                }
                
                /* Style cho người dùng hiện tại trong bảng */
                .current-user {
                    background-color: #ebf8ff;
                }
                
                .current-user:hover {
                    background-color: #e6f6ff !important;
                }
                
                /* Style cho cột thứ hạng */
                .rank-column {
                    width: 80px;
                    text-align: center;
                }
                
                /* Style cho huy chương */
                .rank-badge {
                    font-size: 1.5rem;
                    display: inline-block;
                }
                
                /* Style cho số thứ tự */
                .rank-number {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    background-color: #e2e8f0;
                    border-radius: 50%;
                    font-weight: 600;
                    color: #4a5568;
                }
                
                /* Style cho cột điểm */
                .points-column {
                    font-weight: 600;
                    color: #3182ce;
                }
                
                /* Style cho container thông tin người dùng */
                .user-status-container {
                    margin-top: 3rem;
                    text-align: center;
                }
                
                /* Style cho tiêu đề thông tin người dùng */
                .user-status-container h3 {
                    font-size: 1.4rem;
                    color: #2c3e50;
                    margin-bottom: 1rem;
                }
                
                /* Style cho card thông tin người dùng */
                .user-rank-card {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    max-width: 500px;
                    margin: 0 auto;
                    border-left: 5px solid #3498db;
                }
                
                /* Style cho số thứ tự trong card người dùng */
                .user-rank-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #3498db;
                    background-color: #ebf8ff;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    margin-right: 1.5rem;
                }
                
                /* Style cho phần chi tiết trong card người dùng */
                .user-rank-details {
                    flex: 1;
                    text-align: left;
                }
                
                /* Style cho tên người dùng trong card */
                .user-rank-name {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin: 0 0 0.5rem 0;
                }
                
                /* Style cho điểm trong card người dùng */
                .user-rank-points {
                    color: #3498db;
                    font-weight: 600;
                    margin: 0;
                }
                
                /* Style cho số ngày trong card người dùng */
                .user-rank-days {
                    background-color: #ebf8ff;
                    color: #3498db;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    margin-left: 1rem;
                }
                
                /* Style cho footer */
                .simple-footer {
                    background-color: #2c3e50;
                    color: white;
                    padding: 2rem 0;
                    text-align: center;
                    margin-top: 3rem;
                }
            `}</style>
        </>
    );
};

export default Rankings;