import { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckIn.css';

export default function CheckIn() {
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);
  const [checkedToday, setCheckedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        headers: getAuthHeader()
      });
      setUser(res.data);
      setStreak(res.data.streak_days);
    } catch (err) {
      setError('获取资料失败');
      console.error('获取用户资料失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkToday = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-in/today`, {
        headers: getAuthHeader()
      });
      setCheckedToday(res.data.checked_in);
    } catch (err) {
      console.error('检查打卡失败:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    checkToday();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        headers: getAuthHeader()
      });
      setUser(res.data);
      setStreak(res.data.streak_days);
    } catch (err) {
      setError('获取资料失败');
      console.error('获取用户资料失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkToday = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-in/today`, {
        headers: getAuthHeader()
      });
      setCheckedToday(res.data.checked_in);
    } catch (err) {
      console.error('检查打卡失败:', err);
    }
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/check-in`, {}, {
        headers: getAuthHeader()
      });
      setStreak(streak + 1);
      setCheckedToday(true);
      setError('');
    } catch (err) {
      setError('打卡失败，请重试');
      console.error('打卡失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="checkin-container">
      <div className="checkin-card">
        <div className="header">
          <h1>🚭 戒烟打卡</h1>
          {user && <p className="user-name">欢迎，{user.nickname || user.email}</p>}
        </div>

        <div className="streak-section">
          <div className="streak-number">{streak}</div>
          <p className="streak-label">连续戒烟天数</p>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          onClick={handleCheckIn}
          disabled={checkedToday || loading}
          className={`btn-checkin ${checkedToday ? 'checked' : ''}`}
        >
          {checkedToday ? '✓ 今天已打卡' : '今天没吸烟'}
        </button>

        <p className="tip">
          {checkedToday ? '很好！继续保持！' : '点击按钮记录今天的成就'}
        </p>

        <div className="nav-buttons">
          <button className="btn-nav">📋 打卡历史</button>
          <button className="btn-nav">👥 亲友监督</button>
          <button className="btn-nav">⚙️ 设置</button>
        </div>
      </div>
    </div>
  );
}
