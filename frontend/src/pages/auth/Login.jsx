import {useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";
import Back from "../../components/Back";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);

      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        {withCredentials: true}
      );

      console.log("Login success:", res.data);

      reset(); // clear form after success
      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed, try again!");
    }
  };

  return (
    <div className="max-h-full  ">
      <div>
        <Back />
      </div>

      <div className="min-h-screen flex flex-col items-center gap-5 lg:gap-0 p-6  ">
        <div className="space-y-1 px-2 py-8">
          <h1 className="text-2xl lg:text-[2rem] lg:font-bold text-center">
            Welcome Back to Skyzz.closet
          </h1>
          <p className="text-gray-500 text-md text-center" >Sign in to your Account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md  space-y-3"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition my-3
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            {isSubmitting ? "Logging in..." : "Submit"}
          </button>
        </form>

        <div>
          <h1 className="py-4">
            Dont have account ?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium "
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
