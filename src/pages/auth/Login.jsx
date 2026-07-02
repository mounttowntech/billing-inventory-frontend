import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidation } from "../../validations/loginValidation";
import { loginUser } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import "./Login.css"

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidation),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit(onSubmit)} className="login-card">
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          register={register}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          register={register}
          error={errors.password?.message}
        />
        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {/* new to register */}
        <Link to="/register" className="register-link">
          <p>New to Register? Click here</p>
        </Link>
      </form>
    </div>
  );
};

export default Login;