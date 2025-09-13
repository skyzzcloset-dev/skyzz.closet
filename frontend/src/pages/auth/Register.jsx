import {useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate,Link} from "react-router-dom";
import Back from "../../components/Back";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Register Data:", data);

    try {
      axios.post("http://localhost:3000/api/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      reset();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
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
              className="bg-blue-500 w-full font-semibold py-2 px-4 rounded-lg transition text-white hover:bg-blue-600"
            >
              Register
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
