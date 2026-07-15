import { useEffect, useState } from "react";
import "./Sizes.css";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getSizes,
  createSize,
  editSize,
  removeSize,
} from "../../features/Sizes/sizesSlice";
import { sizesValidation } from "../../validations/SizesValidation";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";

const Sizes = () => {
  const dispatch = useDispatch();
  const { sizes = [] } = useSelector((state) => state.sizes);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sizesValidation),
    defaultValues: { status: true },
  });

  useEffect(() => {
    dispatch(getSizes());
  }, [dispatch]);

  const onSubmit = (data) => {
    data.status = data.status === "true" || data.status === true;
    if (editId) {
      dispatch(editSize({ id: editId, sizeData: data })).then(() =>
        dispatch(getSizes()),
      );
    } else {
      dispatch(createSize(data)).then(() => dispatch(getSizes()));
    }
    reset({ status: true });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setShowForm(true);
    Object.keys(item).forEach((k) => setValue(k, item[k]));
    setValue("status", item.status ? "true" : "false");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this size?")) {
      dispatch(removeSize(id)).then(() => dispatch(getSizes()));
    }
  };

  return (
    <div className="sizes-container">
      <div className="page-header">
        <h2>Size Management</h2>
        <AddButton
          onClick={() => {
            reset({ status: true });
            setEditId(null);
            setShowForm(true);
          }}
        >
          Add Size
        </AddButton>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <form
            className="size-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2>{editId ? "Edit Size" : "Add Size"}</h2>

            <input placeholder="Size Code" {...register("sizeCode")} />
            <p>{errors.sizeCode?.message}</p>

            <input placeholder="Size Name" {...register("sizeName")} />
            <p>{errors.sizeName?.message}</p>

            <input
              type="number"
              placeholder="Display Order"
              {...register("displayOrder")}
            />
            <p>{errors.displayOrder?.message}</p>

            <input type="number" placeholder="Chest" {...register("chest")} />
            <p>{errors.chest?.message}</p>

            <input type="number" placeholder="Waist" {...register("waist")} />
            <p>{errors.waist?.message}</p>

            <input type="number" placeholder="Hip" {...register("hip")} />
            <p>{errors.hip?.message}</p>

            <select {...register("status")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <div className="form-buttons">
              <SaveButton type="submit" />
              <CancelButton
                type="button"
                onClick={() => {
                  reset({ status: true });
                  setShowForm(false);
                  setEditId(null);
                }}
              />
            </div>
          </form>
        </div>
      )}

      <table className="size-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Name</th>
            <th>Order</th>
            <th>Chest</th>
            <th>Waist</th>
            <th>Hip</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sizes.length ? (
            sizes.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.sizeCode}</td>
                <td>{s.sizeName}</td>
                <td>{s.displayOrder}</td>
                <td>{s.chest}</td>
                <td>{s.waist}</td>
                <td>{s.hip}</td>
                <td>{s.status ? "Active" : "Inactive"}</td>
                <td className="action-buttons">
                  <EditButton onClick={() => handleEdit(s)} />
                  <DeleteButton onClick={() => handleDelete(s._id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No Sizes Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Sizes;
