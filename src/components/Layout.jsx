import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold">研究管理システム</h1>
        </div>
        <ul className="space-y-2 p-4">
          <li><Link to="/" className="block p-2 hover:bg-gray-200 rounded">ダッシュボード</Link></li>
          <li><Link to="/planner" className="block p-2 hover:bg-gray-200 rounded">実験計画</Link></li>
          <li><Link to="/literature" className="block p-2 hover:bg-gray-200 rounded">文献管理</Link></li>
          <li><Link to="/tasks" className="block p-2 hover:bg-gray-200 rounded">タスク管理</Link></li>
          <li><Link to="/inventory" className="block p-2 hover:bg-gray-200 rounded">物品管理</Link></li>
          <li><Link to="/experiments" className="block p-2 hover:bg-gray-200 rounded">実験ノート</Link></li>
          <li><Link to="/analysis" className="block p-2 hover:bg-gray-200 rounded">データ分析</Link></li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
