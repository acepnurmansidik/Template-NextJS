"use client";

import AuthLayout from "@/components/etc/auth/page";
import { AuthFormValues, AuthResponse, LoginData } from "@/types/auth";
import { apiPost } from "@/utils/api";
import {
  checkAuthAvailable,
  secureStore,
  setAccess,
  setToken,
  setUserInfo,
} from "@/utils/secureCookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const defaultValues: AuthFormValues = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<AuthFormValues>(defaultValues);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi email & password",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost<AuthResponse<LoginData>>(
        "/auth/sign-in",
        { email: form.email, password: form.password },
        false,
        false,
      );

      if (res.status && res.data?.token) {
        // Simpan sesi ke cookie (semua terenkripsi crypto-js AES):
        //  - TT : JWT
        //  - AM : path_access (hak akses)
        //  - UI : info user login (email + nama)
        setToken(res.data.token);
        setAccess(res.data.path_access ?? []);
        setUserInfo({
          email: res.data.email || form.email,
          name: res.data.name || "",
        });

        await Swal.fire({
          icon: "success",
          title: "Login successfully",
          text: res.message || "Welcome back!",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        router.push("/dashboard");
      } else {
        throw new Error(res.message || "Login failed!");
      }
    } catch (error) {
      const serverMessage =
        (axios.isAxiosError(error) &&
          (error.response?.data?.message || error.response?.data?.error)) ||
        (error instanceof Error ? error.message : "");
      Swal.fire({
        icon: "error",
        title: "Login failed!",
        text: serverMessage || "Check your email or password!",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkConnection = checkAuthAvailable();
    if (checkConnection) {
      router.push("/dashboard");
    }
  }, []);

  if (!mounted) return null;

  return (
    <AuthLayout
      title="Selamat datang kembali"
      subtitle="Masuk ke akun Anda untuk melanjutkan"
    >
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
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
              value={form.email}
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
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="••••••••"
              value={form.password}
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
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Daftar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
