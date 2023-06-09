import { useState } from "react";
import { useRouter } from "next/router";
import React, { FormEvent, ChangeEvent } from "react";
import { message } from "antd";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [exist, setExist] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3700/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        setExist(true);
        message.error("Masukkan data yang valid")
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-semibold mb-6">Login</h1>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full border border-gray-400 p-2 rounded bg-stone-50"
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border border-gray-400 p-2 rounded bg-stone-50"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border border-gray-400 p-2 rounded bg-stone-50"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="flex">
            <button className="bg-blue-500 text-white py-2 px-4 w-full rounded-lg hover:bg-blue-600" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
