import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

const DashboardStaff = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    // Sample data for staff dashboard
    const pendingTickets = [
        { id: 1, userName: 'Nguyen Van A', type: 'Support Request', status: 'Pending', date: '2023-04-12' },
        { id: 2, userName: 'Tran Thi B', type: 'Technical Issue', status: 'In Progress', date: '2023-04-15' },
        { id: 3, userName: 'Le Van C', type: 'Membership Inquiry', status: 'Pending', date: '2023-04-16' }
    ];

    const notifications = [
        { id: 1, message: 'New support ticket from Nguyen Van A', time: '2 hours ago' },
        { id: 2, message: 'Schedule updated for weekly team meeting', time: '1 day ago' },
        { id: 3, message: 'System maintenance scheduled for tomorrow', time: '2 days ago' }
    ];

    const recentActivities = [
        { id: 1, userName: 'Nguyen Van A', activity: 'Registered as a new member', time: '3 hours ago' },
        { id: 2, userName: 'Tran Thi B', activity: 'Purchased Premium plan', time: '5 hours ago' },
        { id: 3, userName: 'Le Van C', activity: 'Reached 10 days smoke-free', time: '1 day ago' }
    ];

    // Check authentication
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const storedUserRole = localStorage.getItem('userRole');
        const storedUserName = localStorage.getItem('userName');

        if (!isLoggedIn || storedUserRole !== 'Staff') {
            alert('You are not authorized to access this page.');
            navigate('/login');
        }

        if (storedUserName) {
            setUserName(storedUserName);
        }

        if (storedUserRole) {
            setUserRole(storedUserRole);
        }
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            {/* Header */}
            <Header userName={userName} />

            {/* Main content */}
            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 2rem',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#2c3e50',
                        margin: 0
                    }}>Staff Dashboard</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/support-chat" style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#44b89d',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px rgba(68, 184, 157, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>💬</span>
                            Support Chat
                        </Link>
                        <Link to="/" style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#35a79c',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px rgba(53, 167, 156, 0.2)'
                        }}>Home</Link>
                    </div>
                </div>

                {/* Staff Stats Overview */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(68, 184, 157, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ fontSize: '1.8rem' }}>🎫</span>
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Support Tickets</h3>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#44b89d', margin: '0' }}>12</p>
                        <p style={{ color: '#7f8c8d', margin: '0.5rem 0 0 0' }}>3 pending, 9 resolved</p>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(52, 152, 219, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ fontSize: '1.8rem' }}>👥</span>
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Active Members</h3>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#3498db', margin: '0' }}>128</p>
                        <p style={{ color: '#7f8c8d', margin: '0.5rem 0 0 0' }}>+12 this week</p>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(155, 89, 182, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ fontSize: '1.8rem' }}>💰</span>
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Membership Sales</h3>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#9b59b6', margin: '0' }}>42</p>
                        <p style={{ color: '#7f8c8d', margin: '0.5rem 0 0 0' }}>This month</p>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(231, 76, 60, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ fontSize: '1.8rem' }}>📊</span>
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Success Rate</h3>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#e74c3c', margin: '0' }}>76%</p>
                        <p style={{ color: '#7f8c8d', margin: '0.5rem 0 0 0' }}>+5% from last month</p>
                    </div>
                </div>

                {/* Main content grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    width: '100%'
                }}>
                    {/* Pending Support Tickets */}
                    <div style={{
                        gridColumn: 'span 2',
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <h2 style={{ fontWeight: '600', color: '#35a79c', margin: 0 }}>Support Tickets</h2>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                color: '#44b89d',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                View All
                            </button>
                        </div>

                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.9rem'
                        }}>
                            <thead>
                                <tr style={{
                                    borderBottom: '1px solid #ecf0f1',
                                    color: '#7f8c8d',
                                    fontWeight: '600',
                                    textAlign: 'left'
                                }}>
                                    <th style={{ padding: '1rem 0.5rem' }}>ID</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>User</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Type</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTickets.map(ticket => (
                                    <tr key={ticket.id} style={{
                                        borderBottom: '1px solid #ecf0f1'
                                    }}>
                                        <td style={{ padding: '1rem 0.5rem' }}>{ticket.id}</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{ticket.userName}</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{ticket.type}</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                backgroundColor: ticket.status === 'Pending' ? '#fff8e1' : '#e3f2fd',
                                                color: ticket.status === 'Pending' ? '#f57c00' : '#1976d2'
                                            }}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{ticket.date}</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button style={{
                                                    background: '#44b89d',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.4rem 0.75rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}>
                                                    View
                                                </button>
                                                <button style={{
                                                    background: '#3498db',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.4rem 0.75rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}>
                                                    Assign
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Activities */}
                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <h2 style={{ fontWeight: '600', color: '#35a79c', margin: 0 }}>Recent Activities</h2>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                color: '#44b89d',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                View All
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentActivities.map(activity => (
                                <div key={activity.id} style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'flex-start',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#e3f2fd',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        flexShrink: 0
                                    }}>
                                        👤
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#2c3e50' }}>
                                            {activity.userName}
                                        </p>
                                        <p style={{ margin: '0 0 0.25rem 0', color: '#7f8c8d' }}>
                                            {activity.activity}
                                        </p>
                                        <p style={{ margin: '0', fontSize: '0.8rem', color: '#95a5a6' }}>
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <h2 style={{ fontWeight: '600', color: '#35a79c', margin: 0 }}>Notifications</h2>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                color: '#44b89d',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                Mark All Read
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {notifications.map(notification => (
                                <div key={notification.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    borderLeft: '3px solid #44b89d',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '0 8px 8px 0'
                                }}>
                                    <div>
                                        <p style={{ margin: '0 0 0.25rem 0', color: '#2c3e50' }}>
                                            {notification.message}
                                        </p>
                                        <p style={{ margin: '0', fontSize: '0.8rem', color: '#95a5a6' }}>
                                            {notification.time}
                                        </p>
                                    </div>
                                    <button style={{
                                        alignSelf: 'flex-start',
                                        background: 'none',
                                        border: 'none',
                                        color: '#7f8c8d',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    marginTop: '1.5rem'
                }}>
                    <h2 style={{ fontWeight: '600', color: '#35a79c', margin: '0 0 1rem 0' }}>Quick Actions</h2>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <button style={{
                            background: 'linear-gradient(135deg, #44b89d 0%, #35a79c 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px rgba(53, 167, 156, 0.2)',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>➕</span>
                            Create Support Ticket
                        </button>
                        <button style={{
                            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px rgba(52, 152, 219, 0.2)',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>📝</span>
                            View Reports
                        </button>
                        <button style={{
                            background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px rgba(155, 89, 182, 0.2)',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>👥</span>
                            Manage Users
                        </button>
                        <button style={{
                            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>📊</span>
                            Analytics Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStaff; 