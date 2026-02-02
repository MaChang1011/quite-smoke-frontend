import { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendLink = async () => {
    if (!email) {
      setError('请输入邮箱');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('API URL 未配置');
      }

      await axios.post(`${apiUrl}/api/auth/send-link`, { email }, {
        timeout: 10000
      });
      setSent(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('邮箱格式不正确');
      } else if (err.response?.status === 500) {
        setError('服务器错误，请稍后重试');
      } else if (err.code === 'ECONNABORTED') {
        setError('请求超时，请检查网络连接');
      } else {
        setError('发送失败，请检查网络连接后重试');
      }
      console.error('发送登录链接失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚭 戒烟打卡</h1>
        <p className="subtitle">每一天都是新的开始</p>

        {!sent ? (
          <>
            <div className="input-group">
              <input
                type="email"
                placeholder="输入你的邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendLink()}
                disabled={loading}
                autoFocus
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button
              onClick={handleSendLink}
              disabled={loading || !email}
              className="btn-primary"
            >
              {loading ? '发送中...' : '发送登录链接'}
            </button>

            <p className="info">
              我们会发送一个登录链接到你的邮箱，点击链接即可登录
            </p>
          </>
        ) : (
          <div className="success">
            <p className="success-icon">✓</p>
            <p className="success-text">登录链接已发送到</p>
            <p className="email">{email}</p>
            <p className="info">请检查你的邮箱，点击链接登录</p>
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
                setError('');
              }}
              className="btn-secondary"
            >
              返回
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
