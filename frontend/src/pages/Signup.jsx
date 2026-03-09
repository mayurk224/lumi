import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  clearError,
  selectIsLoading,
  selectAuthError,
  selectUser,
} from "../redux/authSlice";
import toast from "react-hot-toast";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiFilm,
  FiCheck,
} from "react-icons/fi";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return { strength: 4, label: "Strong", color: "bg-green-500" };
    }
    return { strength: 3, label: "Good", color: "bg-blue-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { username, email, password } = formData;
    const result = await dispatch(registerUser({ username, email, password }));

    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Welcome!");
      navigate("/");
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
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-2">Join Lumi today</p>
        </div>

        <div className="bg-dark-200 rounded-2xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  disabled={isLoading}
                  className="w-full bg-dark-300/50 text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-10 border border-white/10 focus:outline-none focus:border-primary-500 focus:bg-dark-300 transition-all disabled:opacity-50"
                  maxLength={20}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {formData.username.length}/20
              </p>
            </div>

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
                  placeholder="Create a password"
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
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength.strength >= level ? passwordStrength.color : "bg-dark-300"}`}
                    />
                  ))}
                </div>
                {passwordStrength.label && (
                  <p
                    className={`text-xs mt-1 ${passwordStrength.strength >= 3 ? "text-green-400" : "text-gray-400"}`}
                  >
                    {passwordStrength.label}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className="w-full bg-dark-300/50 text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-10 pr-16 border border-white/10 focus:outline-none focus:border-primary-500 focus:bg-dark-300 transition-all disabled:opacity-50"
                />
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <FiCheck className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
                  )}
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirm ? (
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            By signing up you agree to our Terms of Service
          </p>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
