// src/components/Modal.jsx
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <div className="bg-[#f3f3f3] w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative max-h-[95vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;