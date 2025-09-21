import {useForm} from "react-hook-form";
import {useNavigate, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {register as registerUser} from "../../features/auth/authSlice";
import Back from "../../components/Back";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user, isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.auth
  );

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: {firstName: data.firstName, lastName: data.lastName},
        email: data.email,
        password: data.password,
      };
      const resultAction = await dispatch(registerUser(payload));

      if (registerUser.fulfilled.match(resultAction)) {
       
        toast.success("Logged in Successfully");
        reset();
        navigate("/"); // redirect home
      } else {
      
         toast.error(resultAction.payload?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
       toast.error( "Invalid credentials");
    }

 
  };

  return (
    <>
      <div className="max-h-full">
        <div>
          <Back />
        </div>

        <div className="min-h-screen flex flex-col items-center gap-5 lg:gap-0 p-6 ">
          <div className="space-y-1 px-2 py-8">
            <h1 className="text-2xl lg:text-[2rem] lg:font-bold text-center">
              Create an Account
            </h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">Register</h2>

            {/* Full Name Field */}

            <div className="flex flex-col sm:flex-row flex-1 gap-5">
              {/* First Name */}
              <div className="flex-1">
                <label className="block text-gray-700 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="flex-1">
                <label className="block text-gray-700 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
              <label className="block text-gray-700 font-medium">
                Password
              </label>
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
              disabled={isLoading}
              className={`bg-blue-500 w-full font-semibold py-2 px-4 rounded-lg transition text-white hover:bg-blue-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <div>
            <h1 className="py-4">
              Already have an Account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
