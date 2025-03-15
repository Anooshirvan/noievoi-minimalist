
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <h1 className="text-6xl font-light mb-8">404</h1>
        <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
