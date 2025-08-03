import { JSX } from "react";

interface IEditableOverviewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: JSX.Element | string;
};

const EditableOverviewButton: React.FC<IEditableOverviewButtonProps> = (props) => (
  <button
    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }} // Prevent drag start
    onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }} // Prevent touch-based drag
    onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }} // Disable default dragging
    {...props}
  >
    {props.children}
  </button>
);

export default EditableOverviewButton;