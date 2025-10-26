import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(state => state.auth);

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: { firstName: data.firstName, lastName: data.lastName },
        email: data.email,
        password: data.password,
      };
      const resultAction = await dispatch(registerUser(payload));
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Registered Successfully");
        reset();
        navigate("/");
      } else {
        toast.error(resultAction.payload?.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Create an Account</h1>
          <p className="mt-2 text-gray-500 text-base">Start your journey with Skyzz.closet</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                {...register("firstName", { required: "First name is required" })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Your first name"
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Your last name"
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          Already have an account?
          <Link to="/login" className="ml-1 text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
        <div className="mt-8 text-xs text-gray-400 text-center select-none">
          © 2025 Skyzz.closet
        </div>
      </div>
    </div>
  );
};

export default Register;
