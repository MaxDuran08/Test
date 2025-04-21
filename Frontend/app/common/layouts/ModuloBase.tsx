import { Outlet } from "react-router";

export default function ModuloBase({ titulo }: { titulo: string }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center text-white-500 mb-8">
        {titulo}
      </h1>
      <Outlet />
    </div>
  );
}