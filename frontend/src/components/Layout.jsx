import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
