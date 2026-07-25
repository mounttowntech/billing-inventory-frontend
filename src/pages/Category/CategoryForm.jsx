import "./CategoryForm.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/common/Input";
import {SaveButton} from "../../components/common/Button";

import { categoryValidation } from "../../validations/categoryValidation";
import { createCategory, updateCategory } from "../../features/Category/categorySlice";

import toaster from "../../utils/toaster";

import { useEffect } from "react";

export default function CategoryForm({ mode = "add", category = null, onClose, onSuccess }) {

    const dispatch = useDispatch();

    const { roles } = useSelector(state => state.role);
    console.log('users_roles:',roles);

    const {

        register,
        handleSubmit,
        reset,
        formState: { errors }

    } = useForm({

        resolver: yupResolver(categoryValidation),

    });

    useEffect(() => {
        if (mode === "edit" && category) {
            reset({
                categoryName: category.categoryName,
            });
        } else {
            reset({
                categoryName: "",
            });
        }
    }, [mode, category, reset]);

    const onSubmit = async (data) => {
        console.log("data:", data);
        let result;

        if (mode === "add") {
            result = await dispatch(createCategory(data));
            toaster.success("Category created successfully!");
        } else {
            result = await dispatch(
                updateCategory({
                    id: category._id,
                    category: data,
                })
            );
            toaster.success("Category updated successfully!");
        }

        if (
            createCategory.fulfilled.match(result) ||
            updateCategory.fulfilled.match(result)
        ) {
            onSuccess();
        }
    };

    


    return(

        <form onSubmit={handleSubmit(onSubmit)} className="user-form">

            <div className="form-grid">

                <Input
                    label="Category Name"
                    name="categoryName"
                    register={register}
                    error={errors.categoryName?.message}
                />

                <Input
                    label="Description"
                    name="description"
                    register={register}
                    error={errors.description?.message}
                />

            </div>

            <div className="form-footer">
                <SaveButton>
                    {mode === "add" ? "Add Category" : "Update Category"}
                </SaveButton>
            </div>

        </form>

    );

}