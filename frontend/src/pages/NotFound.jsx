const NotFound = () => (
  <div className="min-h-screen bg-dark-100 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-8xl font-bold text-primary-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <a
        href="/"
        className="mt-6 inline-block bg-primary-500 px-6 py-2 rounded-lg hover:bg-primary-600"
      >
        Go Home
      </a>
    </div>
  </div>
);
export default NotFound;
