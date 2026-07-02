import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { registerValidation } from "../../validations/registerValidation";
import { registerUser } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import "./Register.css";

const businessTypeOptions = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Garments", value: "garments" },
  { label: "Department Store", value: "department_store" },
  { label: "General", value: "general" },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidation),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="login-page1">
      <form onSubmit={handleSubmit(onSubmit)} className="login-card1">
        <h2>Register Company</h2>

        {error && <p className="error">{error}</p>}

        <div className="register-grid">
          <div className="form-item">
            <Input
              label="Company Name"
              name="companyName"
              placeholder="Enter Company Name"
              register={register}
              error={errors.companyName?.message}
            />
          </div>

          <div className="form-item">
            <Input
              label="First Name"
              name="firstName"
              placeholder="Enter First Name"
              register={register}
              error={errors.firstName?.message}
            />
          </div>

          <div className="form-item">
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Enter Last Name"
              register={register}
              error={errors.lastName?.message}
            />
          </div>

          <div className="form-item">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter Email"
              register={register}
              error={errors.email?.message}
            />
          </div>

          <div className="form-item">
            <Input
              label="Phone"
              name="phone"
              type="tel"
              placeholder="Enter Phone"
              register={register}
              error={errors.phone?.message}
            />
          </div>

          <div className="form-item">
            <Select
              label="Business Type"
              name="businessType"
              register={register}
              error={errors.businessType?.message}
              options={businessTypeOptions}
              placeholder="Select Business Type"
            />
          </div>

          <div className="form-item full-width">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter Password"
              register={register}
              error={errors.password?.message}
            />
          </div>

          <div className="full-width">
            <button disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="full-width">
            <Link to="/login" className="register-link">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
