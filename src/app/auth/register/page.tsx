"use client";

import AuthLayout from "@/components/etc/auth/page";
import { AuthFormValues } from "@/types/auth";
import Link from "next/link";
import { useState } from "react";

const defaultValues = {
  email: "",
  password: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<AuthFormValues>(defaultValues);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: form?.name, email: form.email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message);
      } else {
        setMsg("Register success!");
      }
    } catch (e) {
      setMsg("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join Realnest today">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* NAME */}
        <div>
          <label className="text-sm">Full Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Name"
            value={form?.name || ""}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your email"
            value={form.email || ""}
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
            value={form.password || ""}
            onChange={handleChange}
          />
        </div>

        {/* MESSAGE */}
        {msg && <div className="text-red-500 text-sm">{msg}</div>}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 duration-200 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <div className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600">
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
