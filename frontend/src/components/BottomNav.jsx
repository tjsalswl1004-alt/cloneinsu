import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',          label: '홈',     icon: '🏠' },
  { path: '/claims',    label: '청구내역', icon: '📄' },
  { path: '/claim/new', label: '',        icon: '+', isCenter: true },
  { path: '/documents', label: '서류안내', icon: '📁' },
  { path: '/settings',  label: '설정',    icon: '⚙️' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around h-16 max-w-lg mx-auto px-2 z-50">
      {NAV_ITEMS.map((item) =>
        item.isCenter ? (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-light shadow-lg -mt-4"
          >
            {item.icon}
          </button>
        ) : (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs ${
              pathname === item.path ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        )
      )}
    </nav>
  );
}
