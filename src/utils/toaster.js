import toast from "react-hot-toast";

const toaster = {
  success(message) {
    toast.success(message);
  },

  error(message) {
    toast.error(message);
  },

  info(message) {
    toast(message);
  },

  loading(message = "Please wait...") {
    return toast.loading(message);
  },

  dismiss(id) {
    toast.dismiss(id);
  },

  promise(promise, messages) {
    toast.promise(promise, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success",
      error: messages.error || "Something went wrong",
    });
  },
};

export default toaster;