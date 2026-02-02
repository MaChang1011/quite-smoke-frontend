import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

describe('Login Component', () => {
  it('应该渲染登录表单', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('🚭 戒烟打卡')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入你的邮箱')).toBeInTheDocument();
    expect(screen.getByText('发送登录链接')).toBeInTheDocument();
  });

  it('邮箱为空时应该显示错误', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const button = screen.getByText('发送登录链接');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('请输入邮箱')).toBeInTheDocument();
    });
  });

  it('输入邮箱后应该能发送', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('输入你的邮箱');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const button = screen.getByText('发送登录链接');
    expect(button).not.toBeDisabled();
  });
});
