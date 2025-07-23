import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div style={{ textAlign: 'right', padding: '10px 20px' }}>
      <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-light)' }}>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(prev => !prev)}
          style={{ marginRight: '8px' }}
        />
        Dark Mode
      </label>
    </div>
  );
};

export default ThemeToggle;
