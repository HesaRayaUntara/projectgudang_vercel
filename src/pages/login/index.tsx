import { useState } from "react";
import { useRouter } from "next/router";
import React, { FormEvent, ChangeEvent } from "react";
import { message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [exist, setExist] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    try {

      const response = {}
      
      if (response) {
        router.push('/');      
      }
    } catch (error) {
      alert('Terjadi kesalahan saat Login');
    }  
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 rounded shadow-md shadow-gray-400 mx-10"  onSubmit={handleSubmit}>
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
            <button className="bg-blue-500 text-white py-2 px-4 w-full rounded-sm mb-7 hover:bg-blue-600">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default LoginPage;
