import "./ColorForm.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import {SaveButton} from "../../components/common/Button";

import { colorValidation } from "../../validations/ColorValidation";
import { createColor, updateColor } from "../../features/color/colorSlice";

import toaster from "../../utils/toaster";

import { useEffect } from "react";

export default function ColorForm({ mode = "add", color = null, onClose, onSuccess }) {

    const dispatch = useDispatch();

    const { roles } = useSelector(state => state.role);
    console.log('users_roles:',roles);

    const {

        register,
        handleSubmit,
        reset,
        formState: { errors }

    } = useForm({

        resolver: yupResolver(colorValidation(mode)),

    });

    useEffect(() => {
        console.log('color_data:', color);
        if (mode === "edit" && color) {
            reset({
                colorCode: color.colorCode,
                colorName: color.colorName,
                hexCode: color.hexCode,
                status: color.status,
            });
        } else {
            reset({
                colorCode: "",
                colorName: "",
                hexCode: "",
                status: true,
            });
        }
    }, [mode, color, reset]);

    
const onSubmit = async (data) => {
  let result;
console.log('color_form_data:', data);
  if (mode === "add") {
    result = await dispatch(createColor(data));
    toaster.success("Color registered successfully!");
  } else {
    result = await dispatch(
      updateColor({
        id: color._id,
        colorData: data,
      })
    );
    toaster.success("Color updated successfully!");
  }

  if (
    createColor.fulfilled.match(result) ||
    updateColor.fulfilled.match(result)
  ) {
    onSuccess();
  }
};

    return(

        // <form onSubmit={handleSubmit(onSubmit)} className="user-form">

        //     <div className="form-grid">

        //         <Input
        //             label="First Name"
        //             name="firstName"
        //             register={register}
        //             error={errors.firstName?.message}
        //         />

        //         <Input
        //             label="Last Name"
        //             name="lastName"
        //             register={register}
        //             error={errors.lastName?.message}
        //         />

        //     </div>

        //     <div className="form-grid">

        //         <Input
        //             label="Email"
        //             name="email"
        //             register={register}
        //             error={errors.email?.message}
        //         />

        //         <Input
        //             label="Phone"
        //             name="phone"
        //             register={register}
        //             error={errors.phone?.message}
        //         />

        //     </div>
        //     <div className="form-grid">

        //     <Input
        //         label="Password"
        //         name="password"
        //         type="password"
        //         register={register}
        //         error={errors.password?.message}
        //     />

        //     <Select 
        //         label="Role"
        //         name="role"
        //         register={register}
        //         error={errors.role?.message}
        //         options={roles.map(role => ({ _id: role._id, label: role.roleName }))}
        //     />
        //     </div>

        //     <div className="form-footer">
        //         <SaveButton>
        //             {mode === "add" ? "Add User" : "Update User"}
        //         </SaveButton>
        //     </div>

        // </form>

        <form  onSubmit={handleSubmit(onSubmit)} className="user-form">

            <div className="form-grid">

        <Input  
        label="Color Code"
        name="colorCode"
        register={register}
        error={errors.colorCode?.message}
        
        />

        <Input 
        label="Color Name"
        name="colorName"
        register={register}
        error={errors.colorName?.message}
        />



              {/* <label>Color Code</label>

              <input
                placeholder="Enter Color Code"
                {...register("colorCode")}
              />

              <p>{errors.colorCode?.message}</p> */}

              {/* <div className="form-group">
              <label>Color Name</label>

              <input
                placeholder="Enter Color Name"
                {...register("colorName")}
              />

              <p>{errors.colorName?.message}</p>
            </div> */}
            </div>



            {/* <div className="form-group">
              <label>Color Name</label>

              <input
                placeholder="Enter Color Name"
                {...register("colorName")}
              />

              <p>{errors.colorName?.message}</p>
            </div> */}

            <div className="form-grid">
                <Input
                    label="Hex Code"
                    name="hexCode"
                    register={register}
                    error={errors.hexCode?.message}
                />

                <Select
                    label="Status"
                    name="status"
                    register={register}
                    error={errors.status?.message}
                    options={[
                        { _id: true, label: "Active" },
                        { _id: false, label: "Inactive" }
                    ]}
                />
            </div>

            {/* <div className="form-group">
              <label>Hex Code</label>

              <input
                type="text"
                placeholder="#FF0000"
                {...register("hexCode")}
              />

              <p>{errors.hexCode?.message}</p>
            </div> */}

            {/* <div className="form-group">
              <label>Status</label>

              <select {...register("status")}>
                <option value="true">Active</option>

                <option value="false">Inactive</option>
              </select>
            </div> */}

            <div className="form-footer">
                <SaveButton>
                    {mode === "add" ? "Add Color" : "Update Color"}
                </SaveButton>
            </div>

            {/* <div className="form-buttons">
              <SaveButton type="submit">
                {editId ? "Update" : "Save"}
              </SaveButton>

              <CancelButton
                type="button"
                onClick={() => {
                  reset({
                    status: true,
                  });

                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </CancelButton>
            </div> */}
          </form>

    );

}