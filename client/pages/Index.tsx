import logo from '../assets/logo-malowopati.png'
import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/use-auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../lib/api';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
const LOGIN_URL = '/auth/login';

export default function Index() {
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef?.current?.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const accessToken = response?.data?.access_token;
      setAuth({ username, password, accessToken });
      setUsername('');
      setpassword('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col justify-center px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                alt="Logo SIM"
                src={logo}
                className="mx-auto h-24 w-auto"
              />
            </div>
            <form action="#" method="POST" onSubmit={handleSubmit} className="space-y-3 pt-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    onChange={(e) => setpassword(e.target.value)}
                    value={password}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 bg-white hover:bg-blue-200 pl-4 rounded-r-md border border-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-500">
                  Remember Me
                </label>
              </div>

              <div className='pt-4'>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-500 hover:to-indigo-400"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  )
}
