import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Verify.css';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setStatus('error');
          setError('令牌不存在');
          return;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify?token=${token}`);
        
        // 保存 token 到 localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setStatus('success');
        
        // 2 秒后跳转到打卡页面
        setTimeout(() => {
          navigate('/check-in');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError('登录失败，链接可能已过期');
        console.error('验证失败:', err);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === 'loading' && (
          <>
            <div className="spinner"></div>
            <p>正在验证登录链接...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <p className="success-text">登录成功！</p>
            <p className="redirect-text">正在跳转到打卡页面...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <p className="error-text">登录失败</p>
            <p className="error-detail">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-retry"
            >
              返回登录
            </button>
          </>
        )}
      </div>
    </div>
  );
}
