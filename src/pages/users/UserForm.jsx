import "./UserForm.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import {SaveButton} from "../../components/common/Button";

import { userValidation } from "../../validations/userValidation ";
import { registerUser, updateUser } from "../../features/auth/authSlice";

import toaster from "../../utils/toaster";

import { useEffect } from "react";

export default function UserForm({ mode = "add", user = null, onClose, onSuccess }) {

    const dispatch = useDispatch();

    const { roles } = useSelector(state => state.role);
    console.log('users_roles:',roles);

    const {

        register,
        handleSubmit,
        reset,
        formState: { errors }

    } = useForm({

        resolver: yupResolver(userValidation(mode)),

    });

    useEffect(() => {
        if (mode === "edit" && user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                password: "",
                role: user.role?._id,
            });
        } else {
            reset({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                role: "",
            });
        }
    }, [mode, user, reset]);

    
const onSubmit = async (data) => {
  let result;

  if (mode === "add") {
    result = await dispatch(registerUser(data));
    toaster.success("User registered successfully!");
  } else {
    result = await dispatch(
      updateUser({
        id: user._id,
        data,
      })
    );
    toaster.success("User updated successfully!");
  }

  if (
    registerUser.fulfilled.match(result) ||
    updateUser.fulfilled.match(result)
  ) {
    onSuccess();
  }
};

    return(

        <form onSubmit={handleSubmit(onSubmit)} className="user-form">

            <div className="form-grid">

                <Input
                    label="First Name"
                    name="firstName"
                    register={register}
                    error={errors.firstName?.message}
                />

                <Input
                    label="Last Name"
                    name="lastName"
                    register={register}
                    error={errors.lastName?.message}
                />

            </div>

            <div className="form-grid">

                <Input
                    label="Email"
                    name="email"
                    register={register}
                    error={errors.email?.message}
                />

                <Input
                    label="Phone"
                    name="phone"
                    register={register}
                    error={errors.phone?.message}
                />

            </div>
            <div className="form-grid">

            <Input
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password?.message}
            />

            <Select 
                label="Role"
                name="role"
                register={register}
                error={errors.role?.message}
                options={roles.map(role => ({ _id: role._id, label: role.roleName }))}
            />
            </div>

            <div className="form-footer">
                <SaveButton>
                    {mode === "add" ? "Add User" : "Update User"}
                </SaveButton>
            </div>

        </form>

    );

}