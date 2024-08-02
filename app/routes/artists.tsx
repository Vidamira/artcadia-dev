import { Link, Outlet } from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <h1>Welcome to My Simple App</h1>
      <nav>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Outlet />
    </div>
  );
}
