import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { login as loginUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser({ email: data.email, password: data.password }));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Logged in Successfully");
        reset();
      } else {
        toast.error(resultAction.payload || "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Welcome Back to Skyzz.closet</h1>
          <p className="mt-2 text-gray-500 text-base">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email required" })}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password required" })}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              isSubmitting || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting || isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </div>
        <div className="mt-8 text-xs text-gray-400 text-center select-none">
          © 2025 Skyzz.closet
        </div>
      </div>
    </div>
  );
};

export default Login;
