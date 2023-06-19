import { toast } from "react-toastify";
import { defaultToastrConfig } from "../utils/constants/common";

const useNotification = () => {
  const updateOrNew = (node, type, options = null) => {
    if (toast.isActive(defaultToastrConfig?.toastId)) {
      toast.update(defaultToastrConfig?.toastId, {render: node, type});
    } else {
      toast(node, {type, ...(options || defaultToastrConfig)});
    }
  }

  const basic = (node, options = null) => updateOrNew(node, toast.TYPE.DEFAULT, options);
  const success = (node, options = null) => updateOrNew(node, toast.TYPE.SUCCESS, options);
  const error = (node, options = null) => updateOrNew(node, toast.TYPE.ERROR, options);
  const warn = (node, options = null) => updateOrNew(node, toast.TYPE.WARNING, options);
  const info = (node, options = null) => updateOrNew(node, toast.TYPE.INFO, options);
  const dismiss = () =>  toast.dismiss();

  return {
    basic,
    success,
    error,
    warn,
    info,
    dismiss
  };
}

export default useNotification;