import { useEffect, useState } from 'react';

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of toast ('success' or 'error')
 * @param {number} props.duration - How long to display the toast (in ms)
 * @param {Function} props.onClose - Callback when toast is closed
 */
const Toast = ({ message, type = 'success', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) setTimeout(onClose, 300); // Allow time for exit animation
  };

  if (!visible) return null;

  return (
    <div className={`toast ${type}`} style={{ opacity: visible ? 1 : 0 }}>
      <div className="toast-icon">
        {type === 'success' ? '✓' : '⚠'}
      </div>
      <div className="toast-message">{message}</div>
      <div className="toast-close" onClick={handleClose}>×</div>
    </div>
  );
};

export default Toast; 