import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#16213e",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#6366f1",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default Toast;
