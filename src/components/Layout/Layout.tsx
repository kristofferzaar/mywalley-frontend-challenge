import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app">
      <header aria-label="Walley">
        <span>Walley</span>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
