import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { changePassword } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import { SaveButton, CancelButton } from "../../components/common/Button";

import { changePasswordValidation } from "../../validations/changePasswordValidation";

export default function ChangePasswordForm({ onClose, onSuccess }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordValidation),
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    try {
      const result = await dispatch(changePassword(data)).unwrap();
      console.log("API Result:", result);
      onSuccess();
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
      <div className="form-grid">
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          register={register}
          error={errors.currentPassword?.message}
        />

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          register={register}
          error={errors.newPassword?.message}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="form-footer">
        <SaveButton>Change Password</SaveButton>

        <CancelButton type="button" onClick={onClose}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
}
