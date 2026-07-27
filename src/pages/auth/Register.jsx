import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { registerValidation } from "../../validations/registerValidation";
import { registerUser } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import "./Register.css";

import { fetchRoles } from "../../features/rolls/roleSlice";
import { useEffect, useState } from "react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [roles, setRoles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidation),
  });

  useEffect(() => {
    dispatch(fetchRoles())
      .unwrap()
      .then((res) => {
        // Handle the fetched roles if needed
        console.log("rolesres:", res);
        // set role name in the state
        setRoles(
          res.map((role) => ({
            id: role._id,
            label: role.roleName,
            value: role.roleName,
          })),
        );
      });
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };
  console.log("roles:", roles);
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
              label="Select Role"
              name="role"
              register={register}
              error={errors.role?.message}
              options={roles}
              placeholder="Select Role"
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

          <div className="full-width register-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <Link to="/login" className="register-link1">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
