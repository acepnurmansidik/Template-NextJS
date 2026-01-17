"use client";

import AuthLayout from "@/components/etc/auth/page";
import { AuthFormValues } from "@/types/auth";
import Link from "next/link";
import { useState } from "react";

const defaultValues = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [form, setForm] = useState<AuthFormValues>(defaultValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
    } catch (error) {}

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back to World!"
      subtitle="Sign in to your account"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* EMAIL */}
        <div>
          <label className="text-sm">Your Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@mail.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* BUTTON LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 duration-200 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <div className="text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-blue-600">
            Register
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
