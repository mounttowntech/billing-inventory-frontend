const Select = ({
  label,
  name,
  register,
  error,
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  optionValue = "value",
  optionLabel = "label",
}) => {
  console.log("Select options:", options);
  console.log("Select value:", value);
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
          <option key={item[optionValue]} value={item[optionValue]}>
            {item[optionLabel]}
          </option>
        ))}
      </select>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Select;
