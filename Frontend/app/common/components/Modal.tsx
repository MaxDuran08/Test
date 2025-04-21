import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, type, onClose }) => {
  if (!isOpen) return null;

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  const textColor = type === "success" ? "text-white" : "text-white";

  return ReactDOM.createPortal(
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className={`max-w-sm p-6 rounded-lg ${bgColor}`}>
        <p className={`text-center font-semibold ${textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-white text-black font-semibold rounded-md"
        >
          Cerrar
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

