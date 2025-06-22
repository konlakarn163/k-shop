import { CheckCircleOutline } from "@mui/icons-material";
import { Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
const PaymentComplete = () => {
  useEffect(() => {
    document.title = "Beta shop | Status";
  }, []);
  return (
    <div className="flex my-auto h-full  items-center justify-center bg-gray-50 p-4">
      <div className="p-6 rounded-2xl border my-10 max-w-md w-full text-center bg-white shadow py-10 flex flex-col items-center justify-center gap-4">
        <CheckCircleOutline sx={{ fontSize: 60, color: "green" }} />
        <Typography variant="h5" className="mt-4 font-semibold">
          Payment Successful!
        </Typography>
        <Typography variant="body1" className="mt-2 text-gray-600">
          Thank you for your purchase. Your order number is{" "}
          <strong>#123456</strong>.
        </Typography>

        <Link to="/">
          <Button variant="contained" color="primary" className="mt-6">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentComplete;
