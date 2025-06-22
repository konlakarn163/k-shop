import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import AppProviders from "./AppProviders";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    document.title = "Beta shop";
  }, []);
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AppRouter />
      </div>
    </AppProviders>
  );
}
