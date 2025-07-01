import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import { getLeaderboardWithUser } from '../api/rankingApi';

const Rankings = () => {
    const [rankings, setRankings] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role || '');
        
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('userId');
                
                if (userId) {
                    const response = await getLeaderboardWithUser(parseInt(userId));
                    if (response.success) {
                        setRankings(response.data.leaderboard);
                        setCurrentUserRank(response.data.currentUserRank);
                    } else {
                        setError('Không thể tải dữ liệu bảng xếp hạng');
                    }
                } else {
                    setError('Không tìm thấy thông tin người dùng');
                }
            } catch (err) {
                console.error('Error fetching rankings:', err);
                setError('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    // Set the document title
    useEffect(() => {
        document.title = "Bảng Xếp Hạng | Cùng Nhau Cai Thuốc Lá";
    }, []);

    if (loading) {
        return (
            <>
                <Header
                    onHomeClick={() => {
                        if (!userRole) {
                            window.location.href = '/';
                        }
                    }}
                />
                {userRole === 'Doctor' ? <SecondaryNavigationDoctor /> : <SecondaryNavigation />}
                <main className="rankings-page">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Đang tải bảng xếp hạng...</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header
                    onHomeClick={() => {
                        if (!userRole) {
                            window.location.href = '/';
                        }
                    }}
                />
                {userRole === 'Doctor' ? <SecondaryNavigationDoctor /> : <SecondaryNavigation />}
                <main className="rankings-page">
                    <div className="container">
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            <button onClick={() => window.location.reload()} className="retry-button">
                                Thử lại
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!rankings || rankings.length === 0) {
        return (
            <>
                <Header
                    onHomeClick={() => {
                        if (!userRole) {
                            window.location.href = '/';
                        }
                    }}
                />
                {userRole === 'Doctor' ? <SecondaryNavigationDoctor /> : <SecondaryNavigation />}
                <main className="rankings-page">
                    <div className="container">
                        <h1 className="page-title">Bảng Xếp Hạng</h1>
                        <div className="empty-state">
                            <h3>Chưa có dữ liệu xếp hạng</h3>
                            <p>Chưa có thành viên nào có dữ liệu tiến trình cai thuốc để xếp hạng.</p>
                            <p>Hãy bắt đầu theo dõi tiến trình cai thuốc để xuất hiện trong bảng xếp hạng!</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <>
            <Header
                onHomeClick={() => {
                    if (!userRole) {
                        window.location.href = '/';
                    }
                }}
            />
            {userRole === 'Doctor' ? <SecondaryNavigationDoctor /> : <SecondaryNavigation />}

            <main className="rankings-page">
                <div className="container">
                    <h1 className="page-title">Bảng Xếp Hạng</h1>
                    <p className="page-description">
                        Theo dõi thành tích cai thuốc của cộng đồng và phấn đấu để đạt thứ hạng cao nhất!
                        <br />
                        <small>Xếp hạng dựa trên: Số ngày không hút thuốc → Tiền tiết kiệm → Điểm tổng</small>
                    </p>

                    <div className="ranking-table-container">
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>Hạng</th>
                                    <th>Người Dùng</th>
                                    <th>Ngày Không Hút Thuốc</th>
                                    <th>Tiền Tiết Kiệm</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((user, index) => (
                                    <tr
                                        key={user.userID}
                                        className={`${index < 3 ? 'top-rank' : ''} ${currentUserRank && user.userID === currentUserRank.userID ? 'current-user' : ''}`}
                                    >
                                        <td className="rank-column">
                                            {index === 0 && <span className="rank-badge gold">🥇</span>}
                                            {index === 1 && <span className="rank-badge silver">🥈</span>}
                                            {index === 2 && <span className="rank-badge bronze">🥉</span>}
                                            {index > 2 && <span className="rank-number">{user.rank}</span>}
                                        </td>
                                        <td className="user-column">
                                            <div className="user-info">
                                                {user.avatar && (
                                                    <img 
                                                        src={`http://localhost:5000${user.avatar}`} 
                                                        alt={user.fullName}
                                                        className="user-avatar"
                                                    />
                                                )}
                                                <span className="user-name">{user.fullName}</span>
                                            </div>
                                        </td>
                                        <td><strong>{user.daysSmokeFree}</strong> ngày</td>
                                        <td className="money-column">{formatMoney(user.totalMoneySaved)}</td>
                                        <td className="points-column">{user.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {currentUserRank && (
                        <div className="user-status-container">
                            <h3>Thứ hạng của bạn</h3>
                            <div className="user-rank-card">
                                <div className="user-rank-number">#{currentUserRank.rank}</div>
                                <div className="user-rank-details">
                                    <div className="user-rank-info">
                                        {currentUserRank.avatar && (
                                            <img 
                                                src={`http://localhost:5000${currentUserRank.avatar}`} 
                                                alt={currentUserRank.fullName}
                                                className="user-rank-avatar"
                                            />
                                        )}
                                        <div>
                                            <p className="user-rank-name">{currentUserRank.fullName}</p>
                                            <p className="user-rank-points">{currentUserRank.points} điểm</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-rank-stats">
                                    <div className="stat">
                                        <span className="stat-value">{currentUserRank.daysSmokeFree}</span>
                                        <span className="stat-label">ngày</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">{formatMoney(currentUserRank.totalMoneySaved)}</span>
                                        <span className="stat-label">tiết kiệm</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="simple-footer">
                <div className="container">
                    <p>© {new Date().getFullYear()} Cùng Nhau Cai Thuốc Lá. All rights reserved.</p>
                </div>
            </footer>

            <style jsx>{`
                .rankings-page {
                    padding: 3rem 0;
                    background-color: #f8f9fa;
                    min-height: 70vh;
                }
                
                .page-title {
                    color: var(--primary-color);
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                    font-weight: 700;
                }
                
                .page-description {
                    text-align: center;
                    max-width: 700px;
                    margin: 0 auto 3rem;
                    color: var(--text-light);
                    font-size: 1.1rem;
                }

                .page-description small {
                    color: #666;
                    font-style: italic;
                }

                .loading-container, .error-container {
                    text-align: center;
                    padding: 3rem 0;
                }

                .loading-spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid var(--primary-color);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-message {
                    color: #e53e3e;
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                }

                .retry-button {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                }

                .retry-button:hover {
                    background-color: #0056b3;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .empty-state h3 {
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }

                .empty-state p {
                    color: #666;
                    margin-bottom: 0.5rem;
                }
                
                .ranking-table-container {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    margin-bottom: 2rem;
                }
                
                .ranking-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .ranking-table th {
                    background-color: #f0f7ff;
                    padding: 1.2rem 1rem;
                    text-align: left;
                    color: #2c3e50;
                    font-weight: 600;
                    font-size: 1.05rem;
                }
                
                .ranking-table td {
                    padding: 1.2rem 1rem;
                    border-top: 1px solid #edf2f7;
                }
                
                .ranking-table tr:hover {
                    background-color: #f9fafb;
                }
                
                .top-rank td {
                    font-weight: 600;
                }
                
                .current-user {
                    background-color: #ebf8ff;
                }
                
                .current-user:hover {
                    background-color: #e6f6ff !important;
                }
                
                .rank-column {
                    width: 80px;
                    text-align: center;
                }
                
                .rank-badge {
                    font-size: 1.5rem;
                    display: inline-block;
                }
                
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

                .user-column {
                    min-width: 200px;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .user-name {
                    font-weight: 500;
                }

                .money-column, .points-column {
                    font-weight: 600;
                    color: var(--primary-color);
                }
                
                .user-status-container {
                    background-color: white;
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    text-align: center;
                }
                
                .user-status-container h3 {
                    color: var(--primary-color);
                    margin-bottom: 1.5rem;
                    font-size: 1.5rem;
                }
                
                .user-rank-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                }
                
                .user-rank-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 1rem;
                    min-width: 80px;
                }

                .user-rank-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-rank-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }
                
                .user-rank-name {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .user-rank-points {
                    font-size: 1rem;
                    opacity: 0.9;
                    margin: 0.25rem 0 0;
                }

                .user-rank-stats {
                    display: flex;
                    gap: 1.5rem;
                }

                .stat {
                    text-align: center;
                }

                .stat-value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .stat-label {
                    display: block;
                    font-size: 0.875rem;
                    opacity: 0.8;
                    margin-top: 0.25rem;
                }
                
                .simple-footer {
                    background-color: #2c3e50;
                    color: white;
                    padding: 2rem 0;
                    text-align: center;
                    margin-top: 3rem;
                }
                
                .simple-footer p {
                    margin: 0;
                    opacity: 0.8;
                }

                @media (max-width: 768px) {
                    .ranking-table {
                        font-size: 0.875rem;
                    }

                    .ranking-table th,
                    .ranking-table td {
                        padding: 0.75rem 0.5rem;
                    }

                    .user-rank-card {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }

                    .user-rank-stats {
                        justify-content: center;
                    }

                    .page-title {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </>
    );
};

export default Rankings; 