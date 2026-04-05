import Navbar from "../components/Navbar";

export default function SuccessPage() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Payment Success!</h1>
      </div>
    </div>
  );
}