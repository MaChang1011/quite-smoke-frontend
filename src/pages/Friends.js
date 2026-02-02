import { useState, useEffect } from 'react';
import axios from 'axios';
import './Friends.css';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/friends`, {
        headers: getAuthHeader()
      });
      setFriends(res.data.friends);
    } catch (err) {
      setError('获取亲友列表失败');
      console.error('获取亲友列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/friends`, {
        headers: getAuthHeader()
      });
      setFriends(res.data.friends);
    } catch (err) {
      setError('获取亲友列表失败');
      console.error('获取亲友列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!email) {
      setError('请输入邮箱');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/friends`, 
        { friend_email: email, friend_name: name }, 
        { headers: getAuthHeader() }
      );
      setEmail('');
      setName('');
      setError('');
      fetchFriends();
    } catch (err) {
      setError('添加失败，请重试');
      console.error('添加亲友失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFriend = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/friends/${id}`, {
        headers: getAuthHeader()
      });
      fetchFriends();
    } catch (err) {
      setError('删除失败');
      console.error('删除亲友失败:', err);
    }
  };

  if (loading && friends.length === 0) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="friends-container">
      <div className="friends-card">
        <h1>👥 亲友监督</h1>
        <p className="subtitle">邀请亲友监督你的戒烟进度</p>

        <div className="add-friend-section">
          <h2>添加亲友</h2>
          <div className="input-group">
            <input
              type="email"
              placeholder="亲友邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="亲友名字（可选）"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button
            onClick={handleAddFriend}
            disabled={loading}
            className="btn-add"
          >
            {loading ? '添加中...' : '添加亲友'}
          </button>
        </div>

        <div className="friends-list-section">
          <h2>亲友列表</h2>
          {friends.length === 0 ? (
            <p className="empty">还没有添加亲友，快邀请他们吧！</p>
          ) : (
            <ul className="friends-list">
              {friends.map((friend) => (
                <li key={friend._id} className="friend-item">
                  <div className="friend-info">
                    <p className="friend-name">{friend.friend_name || '朋友'}</p>
                    <p className="friend-email">{friend.friend_email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFriend(friend._id)}
                    className="btn-delete"
                  >
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="info-box">
          <p>💡 <strong>提示：</strong>当你超过 24 小时未打卡时，我们会自动发送邮件通知你的亲友，让他们为你加油！</p>
        </div>
      </div>
    </div>
  );
}
