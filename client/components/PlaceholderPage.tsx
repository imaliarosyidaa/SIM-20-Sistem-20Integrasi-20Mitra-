import React from "react";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
        <Construction className="h-10 w-10 text-brand-600" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 max-w-md text-gray-600">
        {description ||
          "Halaman ini sedang dalam pengembangan. Silakan lanjutkan dengan memberikan prompt untuk mengisi konten halaman ini."}
      </p>
    </div>
  );
}
