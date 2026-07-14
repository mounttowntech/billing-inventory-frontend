const Select = ({
  label,
  name,
  register,
  error,
  value,
  onChange,
  options = [],
  placeholder = "Select option",
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}

      <select
        {...register(name)}
        className="form-control"
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>

        {options.map((item, index) => (
          <option key={index} value={item.id || item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Select;