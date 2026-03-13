import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import AppProviders from "./AppProviders";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    document.title = "K Shop";
  }, []);
  return (
    <AppProviders>
      <div className="min-h-screen bg-white">
        <Navbar />
        <AppRouter />
      </div>
    </AppProviders>
  );
}
