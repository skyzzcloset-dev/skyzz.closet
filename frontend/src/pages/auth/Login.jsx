import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {useEffect} from "react";
import {login as loginUser} from "../../features/auth/authSlice";
import {toast} from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Only once
  const {user, isLoading} = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const resultAction = await dispatch(loginUser(payload));

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Logged in Successfully");
        reset();
        // ✅ Don't navigate here, let useEffect handle redirect by role
      } else {
        toast.error(resultAction.payload || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard", {replace: true});
      } else {
        navigate("/", {replace: true});
      }
    }
  }, [user, navigate]);

  return (
    <div className="">
      <div className="min-h-full flex flex-col items-center gap-5 lg:gap-0 p-6">
        <div className="space-y-1 px-2 py-8">
          <h1 className="text-2xl lg:text-[2rem] lg:font-bold text-center">
            Welcome Back to Skyzz.closet
          </h1>
          <p className="text-gray-500 text-md text-center">
            Sign in to your Account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-3"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition my-3
              ${
                isSubmitting || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            {isSubmitting || isLoading ? "Logging in..." : "Submit"}
          </button>
        </form>

        <div>
          <h1 className="py-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
