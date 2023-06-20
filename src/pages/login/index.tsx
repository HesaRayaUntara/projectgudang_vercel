import { useState } from "react";
import { useRouter } from "next/router";
import React, { FormEvent, ChangeEvent } from "react";
import { message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [exist, setExist] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 rounded shadow-md shadow-gray-400 mx-10" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-semibold mb-8">Login</h1>
          <div className="mb-4">
            <div className="relative">
              <label htmlFor="email" className="absolute -top-1 left-5 transform -translate-x-2 -translate-y-2 bg-white px-1">
                <span className="text-gray-400">Email</span>
              </label>
              <input
                className="w-full border border-gray-400 p-2.5 rounded mb-2"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="relative">
              <label htmlFor="password" className="absolute -top-1 left-5 transform -translate-x-2 -translate-y-2 bg-white px-1">
                <span className="text-gray-400">Password</span>
              </label>
              <input
                className="w-full border border-gray-400 p-2.5 rounded pr-10"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {showPassword ? (
                <EyeInvisibleOutlined
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <EyeOutlined
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>
          <div className="flex">
            <button className="bg-blue-500 text-white py-2 px-4 w-full rounded-sm mb-7 hover:bg-blue-600" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
