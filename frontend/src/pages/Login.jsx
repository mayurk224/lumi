import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  loginUser,
  clearError,
  selectIsLoading,
  selectAuthError,
  selectUser,
} from "../redux/authSlice";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiFilm } from "react-icons/fi";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <FiFilm className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">Lumi</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-dark-200 rounded-2xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="w-full bg-dark-300/50 text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-10 border border-white/10 focus:outline-none focus:border-primary-500 focus:bg-dark-300 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full bg-dark-300/50 text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-10 pr-10 border border-white/10 focus:outline-none focus:border-primary-500 focus:bg-dark-300 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-dark-300/50 rounded-xl border border-white/5">
            <p className="text-xs text-gray-500 text-center">
              Demo: mayurk224@gmail.com / Password or Admin: beqyly@denipl.com /
              Password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
