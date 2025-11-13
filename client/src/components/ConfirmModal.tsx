import { X, AlertTriangle, LogOut, Trash2, ShoppingCart, CheckCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  icon?: 'logout' | 'delete' | 'cart' | 'warning' | 'success';
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = 'warning'
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (icon) {
      case 'logout':
        return <LogOut className="h-16 w-16" />;
      case 'delete':
        return <Trash2 className="h-16 w-16" />;
      case 'cart':
        return <ShoppingCart className="h-16 w-16" />;
      case 'success':
        return <CheckCircle className="h-16 w-16" />;
      default:
        return <AlertTriangle className="h-16 w-16" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default:
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBtn: 'bg-primary hover:bg-primary-dark text-white'
        };
    }
  };

  const styles = getTypeStyles();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`${styles.iconBg} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}>
            <div className={styles.iconColor}>
              {getIcon()}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-dark mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors shadow-lg ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
