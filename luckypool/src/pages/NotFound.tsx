import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="font-display text-7xl text-cue-accent">404</div>
      <h1 className="mt-4 section-title">Scratch.</h1>
      <p className="section-sub">
        That ball rolled off the table. The page you're looking for isn't
        here.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to break
      </Link>
    </div>
  );
}
