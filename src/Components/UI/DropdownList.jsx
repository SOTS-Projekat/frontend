import { Select } from "antd";
import PropTypes from "prop-types";

const DropdownList = (props) => {
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChange = (selectedValue) => {
    props.onChangeDropdown(selectedValue);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px",
        ...props.containerStyle,
      }}
    >
      {props.label && (
        <label
          style={{
            marginBottom: "5px",
            fontWeight: "600",
            ...props.labelStyle,
          }}
        >
          {props.label}
        </label>
      )}
      <Select
        mode={props.mode}
        showSearch
        placeholder={props.placeholder}
        optionFilterProp="children"
        onChange={onChange}
        value={props.value}
        status={props.status}
        size={props.size}
        disabled={props.disabled}
        onClear={props.onClear}
        allowClear={props.allowClear}
        filterOption={filterOption}
        options={props.options}
        style={props.style}
        ref={props.forwardRef}
      />
    </div>
  );
};

DropdownList.propTypes = {
  mode: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  onChangeDropdown: PropTypes.func,
  value: PropTypes.any,
  status: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  onClear: PropTypes.func,
  allowClear: PropTypes.bool,
  style: PropTypes.object,
  forwardRef: PropTypes.object,
  label: PropTypes.string, // Novi prop za labelu
  labelStyle: PropTypes.object, // Stil za labelu
  containerStyle: PropTypes.object, // Stil za kontejner
};

export default DropdownList;
