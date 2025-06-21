import { useCart } from "../hooks/useCart";
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // ข้อมูลลูกค้า
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ข้อมูลบัตรเครดิต
  const [cardName, setCardName] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Error states
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
    cardName?: string;
    creditCard?: string;
    expiryDate?: string;
    cvv?: string;
  }>({});

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Validation ฟังก์ชันเหมือนเดิม
  const isValidPhone = (phone: string) =>
    /^\d{9,15}$/.test(phone.replace(/\D/g, ""));
  const isValidCardNumber = (number: string) =>
    /^\d{13,19}$/.test(number.replace(/\s+/g, ""));
  const isValidExpiry = (expiry: string) =>
    /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry);
  const isValidCVV = (cvv: string) => /^\d{3,4}$/.test(cvv);

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = "Please enter your name";
    if (!phone) newErrors.phone = "Please enter your phone number";
    else if (!isValidPhone(phone)) newErrors.phone = "Invalid phone number";

    if (!address) newErrors.address = "Please enter your address";

    if (paymentMethod === "credit") {
      if (!cardName) newErrors.cardName = "Please enter cardholder name";
      if (!creditCard) newErrors.creditCard = "Please enter card number";
      else if (!isValidCardNumber(creditCard))
        newErrors.creditCard = "Invalid card number";

      if (!expiryDate) newErrors.expiryDate = "Please enter expiry date";
      else if (!isValidExpiry(expiryDate))
        newErrors.expiryDate = "Invalid expiry date (MM/YY)";

      if (!cvv) newErrors.cvv = "Please enter CVV";
      else if (!isValidCVV(cvv)) newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    alert(`Payment method: ${paymentMethod.toUpperCase()} \nTotal: ฿${total}`);
    navigate("/");
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Typography variant="h5" className="font-bold">
        Checkout
      </Typography>
      <div className="bg-gray-100 rounded-xl p-4 my-4 shadow">
        <p className="mb-2">Delivery address</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            required
            InputProps={{
              style: { backgroundColor: "white" },
            }}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="Numbers only"
            required
            InputProps={{
              style: { backgroundColor: "white" },
            }}
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            multiline
            rows={3}
            fullWidth
            className="md:col-span-2"
            error={!!errors.address}
            helperText={errors.address}
            required
            InputProps={{
              style: { backgroundColor: "white" },
            }}
          />
        </div>
      </div>

      <FormControl component="fieldset" className="mb-4">
        <FormLabel>Payment Method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label="Cash on Delivery"
          />
          <FormControlLabel
            value="bank"
            control={<Radio />}
            label="Bank Transfer"
          />
          <FormControlLabel
            value="promptpay"
            control={<Radio />}
            label="PromptPay (QR Code)"
          />
          <FormControlLabel
            value="credit"
            control={<Radio />}
            label="Credit / Debit Card"
          />
        </RadioGroup>
      </FormControl>
      <div className="my-4">
        {paymentMethod === "bank" && (
          <div className="mb-4 p-4 bg-gray-50 rounded border flex items-center">
            <p>Bank Transfer:</p>
            <img src="/images/payment/kbank.png" alt="kbank" className="w-16" />
            <p>KBank 123-4-56789-0</p>
          </div>
        )}

        {paymentMethod === "promptpay" && (
          <div className="mb-4 p-4 bg-gray-50 rounded border text-center">
            <Typography>PromptPay: 0987654321</Typography>
            <img
              src="/images/payment/qr-payment.png"
              alt="PromptPay QR"
              className="w-40 mx-auto my-4"
            />
            <Typography>Mr.QR Prompay</Typography>
          </div>
        )}

        {paymentMethod === "credit" && (
          <div className="mb-4 p-4 bg-gray-50 rounded border space-y-4 shadow">
            <TextField
              label="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              fullWidth
              placeholder="John Doe"
              error={!!errors.cardName}
              helperText={errors.cardName}
              required
            />
            <TextField
              label="Card Number"
              value={creditCard}
              onChange={(e) => setCreditCard(e.target.value)}
              fullWidth
              placeholder="1234 5678 9012 3456"
              error={!!errors.creditCard}
              helperText={errors.creditCard}
              required
              inputProps={{ maxLength: 19 }}
            />
            <div className="flex gap-4">
              <TextField
                label="Expiry Date (MM/YY)"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                fullWidth
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
                required
                inputProps={{ maxLength: 4 }}
              />
              <TextField
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                fullWidth
                error={!!errors.cvv}
                helperText={errors.cvv}
                required
                type="password"
                inputProps={{ maxLength: 3 }}
              />
            </div>
          </div>
        )}
      </div>
      <ul className="space-y-2 my-6 ">
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="min-w-14 min-h-14 bg-white rounded-xl overflow-hidden">
                <img
                  src={`/images/products/${item.image}`}
                  className="w-14 h-14 object-contain rounded"
                />
              </div>
              <p>
                <span>{item.name}</span>
                <span className="text-blue-500 ml-2">x {item.quantity}</span>
              </p>
            </div>
            <span>฿{item.price * item.quantity}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between font-bold text-lg mb-4">
        <span>Total</span>
        <span>฿{total}</span>
      </div>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Confirm Order
      </Button>
    </div>
  );
}
