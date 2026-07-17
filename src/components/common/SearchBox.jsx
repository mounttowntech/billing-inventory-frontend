import "./SearchBox.css";

const SearchBox = ({
  value,
  onChange,
  placeholder = "Search...",
  width = "300px",
}) => {
  return (
    <div className="search-box" style={{ width }}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBox;
