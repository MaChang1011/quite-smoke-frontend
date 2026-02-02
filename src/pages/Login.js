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

    setLoading(true);
    setError('');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/send-link`, { email });
      setSent(true);
    } catch (err) {
      setError('发送失败，请重试');
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
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button
              onClick={handleSendLink}
              disabled={loading}
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
