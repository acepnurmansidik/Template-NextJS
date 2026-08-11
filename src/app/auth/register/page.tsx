"use client";

import AuthLayout from "@/components/etc/auth/page";
import { AuthFormValues, AuthResponse } from "@/types/auth";
import { apiPost } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { checkAuthAvailable } from "@/utils/secureCookie";

const defaultValues: AuthFormValues = {
  name: "",
  email: "",
  password: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<AuthFormValues>(defaultValues);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkConnection = checkAuthAvailable();
    if (checkConnection) {
      router.push("/dashboard");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi semua field",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (form.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password minimal 6 karakter",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setLoading(true);
    try {
      // Backend sign-up menerima { username, email, password }.
      const res = await apiPost<AuthResponse<null>>(
        "/auth/sign-up",
        {
          username: form.name,
          email: form.email,
          password: form.password,
        },
        false,
        false,
      );

      if (res.status) {
        await Swal.fire({
          icon: "success",
          title: "Registrasi berhasil",
          text: res.message || "Silakan masuk dengan akun Anda.",
          confirmButtonColor: "#2563eb",
        });
        router.push("/auth/login");
      } else {
        throw new Error(res.message || "Registrasi gagal");
      }
    } catch (error) {
      const serverMessage =
        (axios.isAxiosError(error) &&
          (error.response?.data?.message || error.response?.data?.error)) ||
        (error instanceof Error ? error.message : "");
      Swal.fire({
        icon: "error",
        title: "Gagal mendaftar",
        text: serverMessage || "Coba lagi beberapa saat.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <AuthLayout
      title="Buat akun baru"
      subtitle="Daftar untuk mulai menggunakan platform"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* NAME */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nama Lengkap
          </label>
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              name="name"
              autoComplete="name"
              className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="Nama Anda"
              value={form.name || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="you@company.com"
              value={form.email || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="Minimal 6 karakter"
              value={form.password || ""}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Masuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
