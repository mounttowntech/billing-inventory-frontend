const Select = ({
  label,
  name,
  register,
  error,
  options = [],
  placeholder = "Select option",
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}

      <select {...register(name)} className="form-control">
        <option value="">{placeholder}</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Select;