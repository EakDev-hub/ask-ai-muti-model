import React from 'react';
import Select from 'react-select';
import './MultiModelSelector.css';

const MultiModelSelector = ({
  models,
  selectedModels,
  onChange,
  disabled = false,
  maxModels = 4,
  minModels = 2
}) => {
  // Transform models for react-select format
  const options = models.map(model => ({
    value: model.id,
    label: model.name,
    model: model
  }));

  // Get currently selected options
  const selectedOptions = options.filter(opt => 
    selectedModels.includes(opt.value)
  );

  const handleChange = (selected) => {
    // Enforce max models limit
    if (selected && selected.length > maxModels) {
      return; // Don't allow more than maxModels
    }
    
    // Extract model IDs
    const modelIds = selected ? selected.map(opt => opt.value) : [];
    onChange(modelIds);
  };

  // Custom styles matching the existing design
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      border: state.isFocused 
        ? '2px solid var(--primary-color)' 
        : '2px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      boxShadow: state.isFocused 
        ? '0 0 0 3px rgba(102, 126, 234, 0.1)' 
        : 'none',
      '&:hover': {
        borderColor: 'var(--primary-color)'
      },
      cursor: 'pointer'
    }),
    multiValue: (provided) => ({
      ...provided,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 'var(--radius-md)',
      padding: '2px 4px'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
      fontWeight: '600',
      fontSize: '0.875rem',
      padding: '4px 8px'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      cursor: 'pointer',
      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--text-muted)',
      fontSize: '1rem'
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--text-primary)',
      fontSize: '1rem'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      zIndex: 1000
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      maxHeight: '250px',
      overflowY: 'auto'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#667eea' 
        : state.isFocused 
          ? 'rgba(102, 126, 234, 0.1)' 
          : 'white',
      color: state.isSelected ? 'white' : 'var(--text-primary)',
      fontWeight: state.isSelected ? '600' : '400',
      cursor: 'pointer',
      padding: '12px 16px',
      borderRadius: 'var(--radius-sm)',
      margin: '2px 0',
      transition: 'all 0.2s ease',
      '&:active': {
        backgroundColor: state.isSelected ? '#667eea' : 'rgba(102, 126, 234, 0.2)'
      }
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: 'var(--text-muted)',
      padding: '12px 16px'
    })
  };

  return (
    <div className="multi-model-selector">
      <label>
        Select Models ({minModels}-{maxModels}):
        <span className="selection-count">
          {selectedModels.length} selected
        </span>
      </label>
      
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isDisabled={disabled}
        placeholder="Search and select AI models..."
        noOptionsMessage={() => "No models found"}
        closeMenuOnSelect={false}
        styles={customStyles}
        className="model-select-dropdown"
        classNamePrefix="select"
        isClearable={false}
        isSearchable={true}
      />
      
      {selectedModels.length < minModels && (
        <p className="validation-message warning">
          ⚠️ Select at least {minModels} models to continue
        </p>
      )}
      
      {selectedModels.length === maxModels && (
        <p className="validation-message info">
          ℹ️ Maximum {maxModels} models selected
        </p>
      )}
    
    </div>
  );
};

export default MultiModelSelector;