import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import AppProviders from "./AppProviders";

export default function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AppRouter />
      </div>
    </AppProviders>
  );
}
