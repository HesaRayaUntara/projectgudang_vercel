import { useState } from "react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await fetch("http://localhost:3700/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        localStorage.setItem("token", token); // Simpan token ke local storage

        // Redirect ke halaman stock barang setelah login berhasil
        router.push("/");
      } else {
        // Tangani kesalahan saat login gagal
        console.log("Login failed");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-semibold mb-6">Login</h1>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input className="w-full border border-gray-400 p-2 rounded" id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input className="w-full border border-gray-400 p-2 rounded" id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className="flex">
            <button className="bg-blue-500 text-white py-2 px-4 w-full rounded hover:bg-blue-600">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
