import * as React from 'react';
import * as service from '../controller/service';
import "./wording_options.css";

const Icon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};

export interface DropdownProps {
    placeHolder: string;
    onChange: (selection: string) => void;
}

export const WordingOptions = ({ placeHolder, onChange } : DropdownProps) => {
    const options = service.wordings;
    const [showMenu, setShowMenu] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(options[0]);
    
    React.useEffect(() => {
          const handler = () => setShowMenu(false);

          window.addEventListener("click", handler);

          return () => {
            window.removeEventListener("click", handler);
          };
    });

    const isSelected = (option: string) => option === selectedValue; 

    const handleInputEvent = (e: React.MouseEvent<HTMLDivElement>) => {
       e.stopPropagation();
       setShowMenu(!showMenu);
    };

    const handleSelectionEvent = (option: string) => {
        setSelectedValue(option);
        onChange(option);
    }

  const getDisplay = () => {
    if (selectedValue !== "") {
        return selectedValue;
    }
    return placeHolder;
  };


  return (
    <div className="dropdown-container">
      <div onClick={handleInputEvent} className="dropdown-input">
        <div className="dropdown-selected-value">{getDisplay()}</div>
        <div className="dropdown-tools">
          <div className="dropdown-tool">
            <Icon />
          </div>
        </div>
      </div>
      {showMenu && <div className="dropdown-menu">
        {options.map((option) => (
            <div key={option} onClick={() => handleSelectionEvent(option)} className={`dropdown-item ${isSelected(option) && "selected"}`}>{option}</div>
        ))}
      </div>}
    </div>
  );
};