import { Link } from '@remix-run/react';

export default function AboutUs() {
  return (
    <div>
      <h2>About Us</h2>
      <p>This is the About Us page. You can add more details here.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
