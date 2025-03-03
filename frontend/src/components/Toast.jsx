import { ToastContainer } from 'react-toastify';

const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'colored',
};

const Toast = () => <ToastContainer {...TOAST_CONFIG} />;

export default Toast;
