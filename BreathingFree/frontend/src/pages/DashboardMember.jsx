import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

/**
 * DashboardMember - Trang bảng điều khiển thành viên
 * 
 * Component này hiển thị bảng điều khiển cho người dùng thành viên với các tính năng:
 * - Tạo và quản lý kế hoạch cai thuốc lá
 * - Theo dõi số ngày không hút thuốc và tiền tiết kiệm được
 * - Hiển thị thành tựu dựa trên tiến độ cai thuốc
 * - Hỗ trợ tạo kế hoạch nâng cao với các giai đoạn cai thuốc chi tiết
 */
const DashboardMember = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(''); // Tên người dùng
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Chiều rộng cửa sổ để điều chỉnh giao diện

  // Thêm người nghe sự kiện thay đổi kích thước cửa sổ
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Kiểm tra xác thực người dùng
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const storedUserName = localStorage.getItem('userName');

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để truy cập bảng điều khiển thành viên.');
      navigate('/login');
    }

    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [navigate]);

  // Số ngày không hút thuốc - được lưu trong localStorage
  const [smokeFreeCount, setSmokeFreeCount] = useState(() => {
    const savedCount = localStorage.getItem('smokeFreeCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  // Ngày bắt đầu cai thuốc
  const [startDate, setStartDate] = useState(() => {
    const savedDate = localStorage.getItem('smokeFreeStartDate');
    return savedDate ? new Date(savedDate) : new Date();
  });

  // Số điếu thuốc hút mỗi ngày - để tính toán tiền tiết kiệm
  const [cigarettesPerDay, setCigarettesPerDay] = useState(() => {
    const saved = localStorage.getItem('cigarettesPerDay');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Giá mỗi gói thuốc (đơn vị VND) - để tính toán tiền tiết kiệm
  const [pricePerPack, setPricePerPack] = useState(() => {
    const saved = localStorage.getItem('pricePerPack');
    return saved ? parseInt(saved, 10) : 35000;
  });

  // Số điếu thuốc trong một gói - để tính giá mỗi điếu
  const [cigarettesPerPack, setCigarettesPerPack] = useState(() => {
    const saved = localStorage.getItem('cigarettesPerPack');
    return saved ? parseInt(saved, 10) : 20;
  });

  const [quitChoice, setQuitChoice] = useState(() => {
    const saved = localStorage.getItem('quitChoice');
    return saved || 'not_selected';
  });

  const [customDate, setCustomDate] = useState(() => {
    const saved = localStorage.getItem('customQuitDate');
    return saved || new Date().toISOString().split('T')[0];
  });

  const [hasPlan, setHasPlan] = useState(() => {
    return localStorage.getItem('quitChoice') !== null;
  });

  const [moneySaved, setMoneySaved] = useState(() => {
    // Calculate money saved based on days, cigarettes and price
    const cigaretteCost = pricePerPack / cigarettesPerPack;
    const savedMoney = smokeFreeCount * cigarettesPerDay * cigaretteCost;
    return Math.round(savedMoney);
  });

  // New state variables for advanced quit plan
  const [quitReasons, setQuitReasons] = useState(() => {
    const saved = localStorage.getItem('quitReasons');
    return saved ? JSON.parse(saved) : [];
  });

  const [customReason, setCustomReason] = useState('');

  const [expectedQuitDate, setExpectedQuitDate] = useState(() => {
    const saved = localStorage.getItem('expectedQuitDate');
    return saved || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];
  });

  const [quitStages, setQuitStages] = useState(() => {
    const saved = localStorage.getItem('quitStages');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAdvancedPlan, setShowAdvancedPlan] = useState(() => {
    return localStorage.getItem('showAdvancedPlan') === 'true';
  });

  const [generatedPlan, setGeneratedPlan] = useState(() => {
    const saved = localStorage.getItem('generatedPlan');
    return saved ? JSON.parse(saved) : null;
  });

  const [yearsSmoked, setYearsSmoked] = useState(() => {
    const saved = localStorage.getItem('yearsSmoked');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [showGeneratePlan, setShowGeneratePlan] = useState(false);

  useEffect(() => {
    localStorage.setItem('smokeFreeCount', smokeFreeCount);
    localStorage.setItem('smokeFreeStartDate', startDate.toISOString());
    localStorage.setItem('cigarettesPerDay', cigarettesPerDay);
    localStorage.setItem('pricePerPack', pricePerPack);
    localStorage.setItem('cigarettesPerPack', cigarettesPerPack);
    localStorage.setItem('quitChoice', quitChoice);
    localStorage.setItem('customQuitDate', customDate);
    localStorage.setItem('quitReasons', JSON.stringify(quitReasons));
    localStorage.setItem('expectedQuitDate', expectedQuitDate);
    localStorage.setItem('quitStages', JSON.stringify(quitStages));
    localStorage.setItem('showAdvancedPlan', showAdvancedPlan.toString());
    localStorage.setItem('generatedPlan', JSON.stringify(generatedPlan));
    localStorage.setItem('yearsSmoked', yearsSmoked);
  }, [
    smokeFreeCount,
    startDate,
    cigarettesPerDay,
    pricePerPack,
    cigarettesPerPack,
    quitChoice,
    customDate,
    quitReasons,
    expectedQuitDate,
    quitStages,
    showAdvancedPlan,
    generatedPlan,
    yearsSmoked
  ]);

  // ĐỒNG BỘ KẾ HOẠCH CAI THUỐC TỪ LOCALSTORAGE (nếu có)
  useEffect(() => {
    const planData = localStorage.getItem('smokingPlan');
    if (planData) {
      try {
        const parsed = JSON.parse(planData);
        if (parsed.cigarettesPerDay) setCigarettesPerDay(Number(parsed.cigarettesPerDay));
        if (parsed.cigarettesPerPack) setCigarettesPerPack(Number(parsed.cigarettesPerPack));
        if (parsed.pricePerPack) setPricePerPack(Number(parsed.pricePerPack));
        if (parsed.yearsSmoked) setYearsSmoked(Number(parsed.yearsSmoked));
        if (parsed.quitDate) setStartDate(new Date(parsed.quitDate));
        // Nếu có dailyCost thì có thể hiển thị hoặc tính lại nếu cần
      } catch (e) {
        // Nếu lỗi thì bỏ qua
      }
    }
  }, []);

  /**
   * Xử lý khi người dùng chọn thời điểm bắt đầu cai thuốc
   * @param {string} choice - Lựa chọn: 'today', 'tomorrow', 'custom', 'not_ready'
   */
  const handleQuitChoiceSelect = (choice) => {
    setQuitChoice(choice);

    if (choice === 'today') {
      setStartDate(new Date()); // Ngày hôm nay
    } else if (choice === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Ngày mai
      setStartDate(tomorrow);
    } else if (choice === 'custom') {
      const customDateObj = new Date(customDate); // Ngày tùy chọn
      setStartDate(customDateObj);
    }
  };

  /**
   * Xác nhận và tạo kế hoạch cai thuốc
   * Thiết lập trạng thái đã có kế hoạch và bắt đầu theo dõi
   */
  const handleSubmitPlan = () => {
    setHasPlan(true);

    // Nếu chọn hôm nay, bắt đầu đếm ngay lập tức
    if (quitChoice === 'today') {
      setSmokeFreeCount(1);
    } else {
      setSmokeFreeCount(0);
    }

    // Tính toán lại số tiền đã tiết kiệm
    const cigaretteCost = pricePerPack / cigarettesPerPack;
    const savedMoney = smokeFreeCount * cigarettesPerDay * cigaretteCost;
    setMoneySaved(Math.round(savedMoney));
  };

  /**
   * Tăng số ngày không hút thuốc lên 1
   * Đồng thời tính lại số tiền tiết kiệm được
   */
  const increaseSmokeFreeDay = () => {
    setSmokeFreeCount(prev => prev + 1);

    // Tính toán lại số tiền đã tiết kiệm
    const cigaretteCost = pricePerPack / cigarettesPerPack;
    const newCount = smokeFreeCount + 1;
    const savedMoney = newCount * cigarettesPerDay * cigaretteCost;
    setMoneySaved(Math.round(savedMoney));
  };

  /**
   * Đặt lại toàn bộ dữ liệu theo dõi cai thuốc
   * Yêu cầu xác nhận trước khi đặt lại
   */
  const resetSmokeFreeCount = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại số ngày không hút thuốc không?')) {
      setSmokeFreeCount(0);
      setMoneySaved(0);
      // Không reset startDate, hasPlan, quitChoice để giữ nguyên kế hoạch cai thuốc
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const resetPlan = () => {
    if (window.confirm('Bạn có chắc chắn muốn tạo kế hoạch mới không?')) {
      navigate('/create-plan');
    }
  };

  // Add new handler functions for advanced quit plan
  const toggleAdvancedPlan = () => {
    setShowAdvancedPlan(!showAdvancedPlan);
  };

  const handleAddReason = () => {
    if (customReason.trim()) {
      setQuitReasons([...quitReasons, customReason.trim()]);
      setCustomReason('');
    }
  };

  const handleRemoveReason = (index) => {
    const updatedReasons = [...quitReasons];
    updatedReasons.splice(index, 1);
    setQuitReasons(updatedReasons);
  };

  const handleCommonReason = (reason) => {
    if (!quitReasons.includes(reason)) {
      setQuitReasons([...quitReasons, reason]);
    }
  };

  /**
   * Tạo kế hoạch cai thuốc chi tiết dựa trên thông tin người dùng
   * Kế hoạch bao gồm các giai đoạn từ chuẩn bị đến thời kỳ hồi phục
   * được điều chỉnh theo thói quen hút thuốc của người dùng
   */
  const generateQuitPlan = () => {
    // Tính toán các giai đoạn dựa trên thói quen hút thuốc và số năm hút
    const startDateObj = new Date();
    const expectedDateObj = new Date(expectedQuitDate);
    const daysDifference = Math.round((expectedDateObj - startDateObj) / (1000 * 60 * 60 * 24));

    // Tạo kế hoạch cai thuốc dựa trên dữ liệu người dùng
    const generatedStages = [];

    // Preparation stage
    generatedStages.push({
      name: "Chuẩn bị",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + Math.round(daysDifference * 0.2))).toISOString().split('T')[0],
      goal: "Học về căng thẳng và chuẩn bị tinh thần",
      tasks: [
        "Danh sách lý do từ bạn",
        "Nhận diện kích thích hút thuốc",
        "Nói chuyện với bạn bè và gia đình về kế hoạch",
        "Đặt lịch hẹn với bác sĩ"
      ]
    });

    // Reduction stage - based on cigarettes per day
    const reductionDays = Math.round(daysDifference * 0.5);
    const reductionStart = new Date(new Date().setDate(new Date().getDate() + Math.round(daysDifference * 0.2) + 1));
    const reductionEnd = new Date(new Date().setDate(new Date().getDate() + Math.round(daysDifference * 0.7)));

    generatedStages.push({
      name: "Giảm dần",
      startDate: reductionStart.toISOString().split('T')[0],
      endDate: reductionEnd.toISOString().split('T')[0],
      goal: `Giảm dần hút thuốc từ ${cigarettesPerDay} đến ${Math.ceil(cigarettesPerDay / 2)} điếu thuốc mỗi ngày`,
      tasks: [
        "Trì hoãn hút thuốc sáng 1 giờ",
        "Chỉ hút nửa điếu thuốc",
        "Bỏ qua một khoảng nghỉ hút thuốc mỗi ngày",
        "Chuyển sang thương hiệu kém hấp dẫn hơn"
      ]
    });

    // Quit day preparation
    const quitPrepStart = new Date(new Date().setDate(new Date().getDate() + Math.round(daysDifference * 0.7) + 1));
    const quitPrepEnd = new Date(new Date().setDate(new Date().getDate() + daysDifference - 1));

    generatedStages.push({
      name: "Chuẩn bị cho ngày cai thuốc",
      startDate: quitPrepStart.toISOString().split('T')[0],
      endDate: quitPrepEnd.toISOString().split('T')[0],
      goal: "Chuẩn bị hoàn toàn cho cai thuốc",
      tasks: [
        "Loại bỏ tất cả dụng cụ hút thuốc",
        "Làm sạch nhà và xe hơi để loại bỏ mùi thuốc",
        "Thực hành các kỹ thuật giảm căng thẳng",
        "Tồn kho thực phẩm và nước khoáng"
      ]
    });

    // Quit day
    generatedStages.push({
      name: "Ngày cai thuốc",
      startDate: expectedQuitDate,
      endDate: expectedQuitDate,
      goal: "Ngừng hút thuốc hoàn toàn",
      tasks: [
        "Thức dậy như không hút thuốc",
        "Bận rộn suốt ngày",
        "Uống đủ nước",
        "Gọi bạn bè để hỗ trợ"
      ]
    });

    // Recovery stages
    generatedStages.push({
      name: "Tình trạng hồi phục sớm",
      startDate: new Date(new Date(expectedQuitDate).setDate(new Date(expectedQuitDate).getDate() + 1)).toISOString().split('T')[0],
      endDate: new Date(new Date(expectedQuitDate).setDate(new Date(expectedQuitDate).getDate() + 14)).toISOString().split('T')[0],
      goal: "Điều hướng qua các triệu chứng rút thuốc",
      tasks: [
        "Đi một ngày tại một thời điểm",
        "Sử dụng thở dục khi cảm thấy cần hút thuốc",
        "Tập thể dục hàng ngày",
        "Tự hào về những thành tích nhỏ"
      ]
    });

    setGeneratedPlan({
      stages: generatedStages,
      cigarettesPerDay,
      yearsSmoked,
      expectedQuitDate
    });

    setQuitStages(generatedStages);
    setShowGeneratePlan(false);
  };

  const handleStageChange = (index, field, value) => {
    const updatedStages = [...quitStages];
    updatedStages[index][field] = value;
    setQuitStages(updatedStages);
  };

  const handleTaskChange = (stageIndex, taskIndex, value) => {
    const updatedStages = [...quitStages];
    updatedStages[stageIndex].tasks[taskIndex] = value;
    setQuitStages(updatedStages);
  };

  const addTask = (stageIndex) => {
    const updatedStages = [...quitStages];
    updatedStages[stageIndex].tasks.push("New task");
    setQuitStages(updatedStages);
  };

  const removeTask = (stageIndex, taskIndex) => {
    const updatedStages = [...quitStages];
    updatedStages[stageIndex].tasks.splice(taskIndex, 1);
    setQuitStages(updatedStages);
  };

  const addStage = () => {
    const lastStage = quitStages[quitStages.length - 1];
    const newStartDate = lastStage ?
      new Date(new Date(lastStage.endDate).setDate(new Date(lastStage.endDate).getDate() + 1)).toISOString().split('T')[0] :
      new Date().toISOString().split('T')[0];

    const newEndDate = new Date(new Date(newStartDate).setDate(new Date(newStartDate).getDate() + 7)).toISOString().split('T')[0];

    setQuitStages([...quitStages, {
      name: "New Stage",
      startDate: newStartDate,
      endDate: newEndDate,
      goal: "Set your goal",
      tasks: ["Add tasks here"]
    }]);
  };

  const removeStage = (index) => {
    const updatedStages = [...quitStages];
    updatedStages.splice(index, 1);
    setQuitStages(updatedStages);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
      fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <Header userName={userName} />
      <SecondaryNavigation />

      <div style={{
        padding: '2rem',
        maxWidth: '100%',
        margin: '0 auto',
        width: '100%',
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
          }}>Bảng Điều Khiển Thành Viên</h1>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: windowWidth < 1024 ? '1fr' : 'repeat(3, 1fr)',
          gap: '2rem',
          width: '100%'
        }}>
          <div style={{
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            height: '100%',
            overflow: 'auto',
            maxHeight: '600px'
          }}>
            <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Kế Hoạch Cai Thuốc</h2>

            {!hasPlan ? (
              <div style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Khi nào bạn sẽ bắt đầu cai thuốc?
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>
                      <input
                        type="radio"
                        id="today"
                        name="quitDay"
                        value="today"
                        checked={quitChoice === 'today'}
                        onChange={() => handleQuitChoiceSelect('today')}
                      />
                      <label htmlFor="today" style={{ marginLeft: '0.5rem' }}>Hôm nay</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="tomorrow"
                        name="quitDay"
                        value="tomorrow"
                        checked={quitChoice === 'tomorrow'}
                        onChange={() => handleQuitChoiceSelect('tomorrow')}
                      />
                      <label htmlFor="tomorrow" style={{ marginLeft: '0.5rem' }}>Ngày mai</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="custom"
                        name="quitDay"
                        value="custom"
                        checked={quitChoice === 'custom'}
                        onChange={() => handleQuitChoiceSelect('custom')}
                      />
                      <label htmlFor="custom" style={{ marginLeft: '0.5rem' }}>Chọn ngày</label>
                      {quitChoice === 'custom' && (
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          style={{
                            display: 'block',
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '5px',
                            border: '1px solid #ddd'
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="not_ready"
                        name="quitDay"
                        value="not_ready"
                        checked={quitChoice === 'not_ready'}
                        onChange={() => handleQuitChoiceSelect('not_ready')}
                      />
                      <label htmlFor="not_ready" style={{ marginLeft: '0.5rem' }}>Chưa sẵn sàng</label>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Số điếu thuốc hút mỗi ngày:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cigarettesPerDay}
                    onChange={(e) => setCigarettesPerDay(parseInt(e.target.value))}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      width: '100%',
                      marginBottom: '1rem'
                    }}
                  />

                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Số điếu thuốc trong một gói:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cigarettesPerPack}
                    onChange={(e) => setCigarettesPerPack(parseInt(e.target.value))}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      width: '100%',
                      marginBottom: '1rem'
                    }}
                  />

                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Giá một gói thuốc (VND):
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={pricePerPack}
                    onChange={(e) => setPricePerPack(parseInt(e.target.value))}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      width: '100%',
                      marginBottom: '1rem'
                    }}
                  />

                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Số năm bạn đã hút thuốc:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={yearsSmoked}
                    onChange={(e) => setYearsSmoked(parseInt(e.target.value))}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      width: '100%',
                      marginBottom: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    onClick={toggleAdvancedPlan}
                    style={{
                      padding: '0.7rem 1.2rem',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)',
                      width: '100%',
                      marginBottom: '1rem'
                    }}
                  >
                    {showAdvancedPlan ? 'Ẩn Tùy Chọn Nâng Cao' : 'Hiển Thị Tùy Chọn Nâng Cao'}
                  </button>

                  {showAdvancedPlan && (
                    <div style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#3498db' }}>
                        Lý Do Cai Thuốc Của Tôi
                      </h3>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleCommonReason('Cải thiện sức khỏe')}
                            style={{
                              padding: '0.5rem 0.8rem',
                              background: '#e0f7fa',
                              border: '1px solid #80deea',
                              borderRadius: '50px',
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            Sức Khỏe
                          </button>
                          <button
                            onClick={() => handleCommonReason('Tiết kiệm tiền')}
                            style={{
                              padding: '0.5rem 0.8rem',
                              background: '#e0f7fa',
                              border: '1px solid #80deea',
                              borderRadius: '50px',
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            Tiền Bạc
                          </button>
                          <button
                            onClick={() => handleCommonReason('Gia đình và mối quan hệ')}
                            style={{
                              padding: '0.5rem 0.8rem',
                              background: '#e0f7fa',
                              border: '1px solid #80deea',
                              borderRadius: '50px',
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            Gia Đình
                          </button>
                          <button
                            onClick={() => handleCommonReason('Tăng năng lượng và sức khỏe')}
                            style={{
                              padding: '0.5rem 0.8rem',
                              background: '#e0f7fa',
                              border: '1px solid #80deea',
                              borderRadius: '50px',
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            Năng Lượng
                          </button>
                          <button
                            onClick={() => handleCommonReason('Thoát khỏi sự phụ thuộc')}
                            style={{
                              padding: '0.5rem 0.8rem',
                              background: '#e0f7fa',
                              border: '1px solid #80deea',
                              borderRadius: '50px',
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            Tự Do
                          </button>
                        </div>

                        <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                          <input
                            type="text"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="Thêm lý do của riêng bạn..."
                            style={{
                              padding: '0.5rem',
                              borderRadius: '5px 0 0 5px',
                              border: '1px solid #ddd',
                              borderRight: 'none',
                              flexGrow: 1
                            }}
                          />
                          <button
                            onClick={handleAddReason}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#27ae60',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0 5px 5px 0',
                              cursor: 'pointer'
                            }}
                          >
                            Thêm
                          </button>
                        </div>

                        {quitReasons.length > 0 ? (
                          <ul style={{
                            listStyleType: 'none',
                            padding: '0.5rem',
                            background: '#f9f9f9',
                            borderRadius: '5px',
                            maxHeight: '150px',
                            overflowY: 'auto'
                          }}>
                            {quitReasons.map((reason, index) => (
                              <li key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                borderBottom: index < quitReasons.length - 1 ? '1px solid #eee' : 'none'
                              }}>
                                <span>{reason}</span>
                                <button
                                  onClick={() => handleRemoveReason(index)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#e74c3c',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p style={{ color: '#95a5a6', padding: '0.5rem 0' }}>Thêm lý do cai thuốc của bạn</p>
                        )}
                      </div>

                      <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#3498db' }}>
                        Ngày Dự Kiến Cai Thuốc
                      </h3>

                      <div style={{ marginBottom: '1rem' }}>
                        <input
                          type="date"
                          value={expectedQuitDate}
                          onChange={(e) => setExpectedQuitDate(e.target.value)}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            width: '100%'
                          }}
                        />
                      </div>

                      <button
                        onClick={() => setShowGeneratePlan(true)}
                        style={{
                          padding: '0.7rem 1.2rem',
                          backgroundColor: '#9b59b6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(155, 89, 182, 0.3)',
                          width: '100%'
                        }}
                      >
                        Tạo Kế Hoạch Cai Thuốc
                      </button>

                      {showGeneratePlan && (
                        <div style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: '#f5f5f5',
                          borderRadius: '8px'
                        }}>
                          <p>Dựa trên thói quen hút thuốc của bạn, chúng tôi sẽ tạo kế hoạch cai thuốc cá nhân hóa bao gồm:</p>
                          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Giai đoạn chuẩn bị</li>
                            <li>Các bước giảm dần</li>
                            <li>Chuẩn bị cho ngày cai thuốc</li>
                            <li>Hỗ trợ phục hồi</li>
                          </ul>

                          <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            justifyContent: 'space-between'
                          }}>
                            <button
                              onClick={() => setShowGeneratePlan(false)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#7f8c8d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                flexGrow: 1
                              }}
                            >
                              Hủy
                            </button>
                            <button
                              onClick={generateQuitPlan}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                flexGrow: 1
                              }}
                            >
                              Tạo Kế Hoạch
                            </button>
                          </div>
                        </div>
                      )}

                      {quitStages.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#3498db' }}>
                            Hành Trình Cai Thuốc Của Bạn
                          </h3>

                          {quitStages.map((stage, stageIndex) => (
                            <div key={stageIndex} style={{
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              padding: '1rem',
                              marginBottom: '1rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={stage.name}
                                  onChange={(e) => handleStageChange(stageIndex, 'name', e.target.value)}
                                  style={{
                                    padding: '0.5rem',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    fontWeight: 'bold',
                                    width: '60%'
                                  }}
                                />
                                <button
                                  onClick={() => removeStage(stageIndex)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#e74c3c',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  Xóa
                                </button>
                              </div>

                              <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginTop: '0.5rem',
                                flexWrap: 'wrap'
                              }}>
                                <div style={{ flexGrow: 1, minWidth: '120px' }}>
                                  <label style={{
                                    display: 'block',
                                    marginBottom: '0.3rem',
                                    fontSize: '0.9rem',
                                    color: '#7f8c8d'
                                  }}>
                                    Ngày Bắt Đầu:
                                  </label>
                                  <input
                                    type="date"
                                    value={stage.startDate}
                                    onChange={(e) => handleStageChange(stageIndex, 'startDate', e.target.value)}
                                    style={{
                                      padding: '0.5rem',
                                      borderRadius: '5px',
                                      border: '1px solid #ddd',
                                      width: '100%'
                                    }}
                                  />
                                </div>
                                <div style={{ flexGrow: 1, minWidth: '120px' }}>
                                  <label style={{
                                    display: 'block',
                                    marginBottom: '0.3rem',
                                    fontSize: '0.9rem',
                                    color: '#7f8c8d'
                                  }}>
                                    Ngày Kết Thúc:
                                  </label>
                                  <input
                                    type="date"
                                    value={stage.endDate}
                                    onChange={(e) => handleStageChange(stageIndex, 'endDate', e.target.value)}
                                    style={{
                                      padding: '0.5rem',
                                      borderRadius: '5px',
                                      border: '1px solid #ddd',
                                      width: '100%'
                                    }}
                                  />
                                </div>
                              </div>

                              <div style={{ marginTop: '0.5rem' }}>
                                <label style={{
                                  display: 'block',
                                  marginBottom: '0.3rem',
                                  fontSize: '0.9rem',
                                  color: '#7f8c8d'
                                }}>
                                  Mục Tiêu:
                                </label>
                                <input
                                  type="text"
                                  value={stage.goal}
                                  onChange={(e) => handleStageChange(stageIndex, 'goal', e.target.value)}
                                  style={{
                                    padding: '0.5rem',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    width: '100%'
                                  }}
                                />
                              </div>

                              <div style={{ marginTop: '0.5rem' }}>
                                <label style={{
                                  marginBottom: '0.3rem',
                                  fontSize: '0.9rem',
                                  color: '#7f8c8d',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <span>Nhiệm Vụ:</span>
                                  <button
                                    onClick={() => addTask(stageIndex)}
                                    style={{
                                      fontSize: '0.8rem',
                                      padding: '0.2rem 0.5rem',
                                      background: '#3498db',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Thêm Nhiệm Vụ
                                  </button>
                                </label>
                                <ul style={{
                                  listStyleType: 'none',
                                  padding: '0.5rem',
                                  background: '#f9f9f9',
                                  borderRadius: '5px',
                                  margin: 0
                                }}>
                                  {stage.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      padding: '0.5rem',
                                      borderBottom: taskIndex < stage.tasks.length - 1 ? '1px solid #eee' : 'none'
                                    }}>
                                      <input
                                        type="text"
                                        value={task}
                                        onChange={(e) => handleTaskChange(stageIndex, taskIndex, e.target.value)}
                                        style={{
                                          padding: '0.3rem',
                                          borderRadius: '5px',
                                          border: '1px solid #ddd',
                                          flexGrow: 1
                                        }}
                                      />
                                      <button
                                        onClick={() => removeTask(stageIndex, taskIndex)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#e74c3c',
                                          cursor: 'pointer',
                                          fontWeight: 'bold',
                                          marginLeft: '0.5rem'
                                        }}
                                      >
                                        ×
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={addStage}
                            style={{
                              padding: '0.7rem 1.2rem',
                              backgroundColor: '#f39c12',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '500',
                              boxShadow: '0 2px 4px rgba(243, 156, 18, 0.3)',
                              width: '100%'
                            }}
                          >
                            Thêm Giai Đoạn Mới
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmitPlan}
                  disabled={quitChoice === 'not_selected'}
                  style={{
                    padding: '0.7rem 1.2rem',
                    backgroundColor: quitChoice === 'not_selected' ? '#95a5a6' : '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: quitChoice === 'not_selected' ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(46, 204, 113, 0.3)',
                    width: '100%',
                    marginTop: '1rem'
                  }}
                >
                  Tạo Kế Hoạch
                </button>
              </div>
            ) : (
              <div style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
                <p>
                  <strong>Ngày bắt đầu:</strong> {startDate.toLocaleDateString('en-US')}
                </p>
                <p>
                  <strong>Số điếu thuốc mỗi ngày:</strong> {cigarettesPerDay}
                </p>
                <p>
                  <strong>Giá một gói thuốc:</strong> {formatCurrency(pricePerPack)}
                </p>
                <p>
                  <strong>Chi phí hàng ngày:</strong> {formatCurrency(pricePerPack / cigarettesPerPack * cigarettesPerDay)}
                </p>

                {quitReasons.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Lý do cai thuốc của tôi:</strong>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      {quitReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {quitStages.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Các giai đoạn cai thuốc của tôi:</strong>
                    <div style={{
                      margin: '0.5rem 0',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      padding: '0.5rem'
                    }}>
                      {quitStages.map((stage, index) => (
                        <div key={index} style={{
                          marginBottom: index < quitStages.length - 1 ? '0.8rem' : 0,
                          paddingBottom: index < quitStages.length - 1 ? '0.8rem' : 0,
                          borderBottom: index < quitStages.length - 1 ? '1px solid #eee' : 'none'
                        }}>
                          <strong style={{ color: '#3498db' }}>{stage.name}</strong>
                          <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                            {new Date(stage.startDate).toLocaleDateString('en-US')} đến {new Date(stage.endDate).toLocaleDateString('en-US')}
                          </div>
                          <div style={{ margin: '0.3rem 0' }}>{stage.goal}</div>
                          <ul style={{ margin: '0.3rem 0', paddingLeft: '1.5rem' }}>
                            {stage.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} style={{ fontSize: '0.9rem' }}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={resetPlan}
                  style={{
                    padding: '0.7rem 1.2rem',
                    backgroundColor: '#f39c12',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(243, 156, 18, 0.3)',
                    marginTop: '1rem'
                  }}
                >
                  Tạo Kế Hoạch Mới
                </button>
              </div>
            )}
          </div>

          <div style={{
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            height: '100%',
            overflow: 'auto',
            maxHeight: '600px'
          }}>
            <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Tiến Độ</h2>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', marginBottom: '1rem' }}>
              Số ngày không hút thuốc: <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>{smokeFreeCount}</span> ngày<br />
              Tiền tiết kiệm được: <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{formatCurrency(moneySaved)}</span>
            </p>

            {/* Progress Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Tiến độ cai thuốc</span>
                <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  {smokeFreeCount < 30 ? `${smokeFreeCount}/30 ngày` : '30+ ngày'}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#ecf0f1',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(smokeFreeCount / 30 * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: smokeFreeCount >= 30 ? '#27ae60' : '#3498db',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '0.5rem', textAlign: 'center' }}>
                {smokeFreeCount >= 30 ? 'Chúc mừng! Bạn đã đạt mốc 30 ngày không hút thuốc!' : 'Mục tiêu: 30 ngày không hút thuốc'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={increaseSmokeFreeDay}
                style={{
                  padding: '0.7rem 1.2rem',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)'
                }}
              >
                Thêm Ngày Không Hút Thuốc
              </button>
              <button
                onClick={resetSmokeFreeCount}
                style={{
                  padding: '0.7rem 1.2rem',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(231, 76, 60, 0.3)'
                }}
              >
                Đặt Lại
              </button>
            </div>
          </div>

          <div style={{
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            height: '100%',
            overflow: 'auto',
            maxHeight: '600px'
          }}>
            <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Thành Tựu</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem',
                borderRadius: '8px',
                background: smokeFreeCount >= 1 ? 'rgba(52, 152, 219, 0.1)' : '#f9f9f9',
                borderLeft: smokeFreeCount >= 1 ? '4px solid #3498db' : '4px solid #e0e0e0',
                opacity: smokeFreeCount >= 1 ? 1 : 0.6
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: smokeFreeCount >= 1 ? '#3498db' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  🏅
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: smokeFreeCount >= 1 ? '#2c3e50' : '#95a5a6' }}>1 ngày không hút thuốc</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Bước đầu tiên trên hành trình</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem',
                borderRadius: '8px',
                background: smokeFreeCount >= 7 ? 'rgba(155, 89, 182, 0.1)' : '#f9f9f9',
                borderLeft: smokeFreeCount >= 7 ? '4px solid #9b59b6' : '4px solid #e0e0e0',
                opacity: smokeFreeCount >= 7 ? 1 : 0.6
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: smokeFreeCount >= 7 ? '#9b59b6' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  🥉
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: smokeFreeCount >= 7 ? '#2c3e50' : '#95a5a6' }}>7 ngày không hút thuốc</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Một tuần chiến thắng</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem',
                borderRadius: '8px',
                background: smokeFreeCount >= 30 ? 'rgba(241, 196, 15, 0.1)' : '#f9f9f9',
                borderLeft: smokeFreeCount >= 30 ? '4px solid #f1c40f' : '4px solid #e0e0e0',
                opacity: smokeFreeCount >= 30 ? 1 : 0.6
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: smokeFreeCount >= 30 ? '#f1c40f' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  🥈
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: smokeFreeCount >= 30 ? '#2c3e50' : '#95a5a6' }}>30 ngày không hút thuốc</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Một tháng thành công</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem',
                borderRadius: '8px',
                background: smokeFreeCount >= 90 ? 'rgba(230, 126, 34, 0.1)' : '#f9f9f9',
                borderLeft: smokeFreeCount >= 90 ? '4px solid #e67e22' : '4px solid #e0e0e0',
                opacity: smokeFreeCount >= 90 ? 1 : 0.6
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: smokeFreeCount >= 90 ? '#e67e22' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  🥇
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: smokeFreeCount >= 90 ? '#2c3e50' : '#95a5a6' }}>90 ngày không hút thuốc</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Ba tháng kiên trì</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem',
                borderRadius: '8px',
                background: smokeFreeCount >= 365 ? 'rgba(39, 174, 96, 0.1)' : '#f9f9f9',
                borderLeft: smokeFreeCount >= 365 ? '4px solid #27ae60' : '4px solid #e0e0e0',
                opacity: smokeFreeCount >= 365 ? 1 : 0.6
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: smokeFreeCount >= 365 ? '#27ae60' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  👑
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: smokeFreeCount >= 365 ? '#2c3e50' : '#95a5a6' }}>365 ngày không hút thuốc</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Một năm chiến thắng!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ QUAN TRỌNG:
export default DashboardMember;
