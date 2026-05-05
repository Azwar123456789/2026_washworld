"use client";

import Image from "next/image";

export default function QRPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Scan QR koden
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
          Scan QR koden i vaskehallen
        </p>
      </div>

      {/* QR Card */}
      <div className="bg-white rounded-3xl p-6 flex flex-col items-center shadow-lg">

        <Image
          src="/qr-placeholder.png"
          alt="QR kode"
          width={220}
          height={220}
          className="rounded-xl"
        />

        <p className="text-black font-semibold mt-4">
          Aktiv QR kode
        </p>

        <p className="text-zinc-500 text-sm mt-1">
          Gyldig i 05:00
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-zinc-900 rounded-2xl p-4 mt-6">
        <h2 className="font-semibold mb-2">
          Sådan virker det
        </h2>

        <ul className="text-sm text-zinc-400 space-y-2">
          <li>• Kør til vaskehallen</li>
          <li>• Scan QR koden ved indgangen</li>
          <li>• Start din vask automatisk</li>
        </ul>
      </div>

      {/* Button */}
      <button className="mt-auto bg-green-500 text-black font-semibold py-3 rounded-2xl">
        Tilbage
      </button>
    </div>
  );
}