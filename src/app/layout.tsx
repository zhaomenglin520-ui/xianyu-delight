/**
 * 根布局 - 配置 ThemeProvider 支持深色模式
 */

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: '闲鱼智能管理系统',
  description: 'Goofish Credentials Bot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/xianyu-logo.svg" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
