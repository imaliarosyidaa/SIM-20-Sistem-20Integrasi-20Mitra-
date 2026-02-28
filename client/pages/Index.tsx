import logo from '../assets/logo-malowopati.png'
import BackgroundParticles from '../components/BackgroundParticles';
import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/use-auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';

import axios from '../lib/api';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { Box, Checkbox, FormControlLabel, LinearProgress } from '@mui/material';
import { pink, purple } from '@mui/material/colors';
const LOGIN_URL = '/auth/login';

export default function Index() {
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const accessToken = response?.data?.access_token;
      const roles = response?.data?.user?.roles
      setAuth({ username, password, accessToken, roles });
      setUsername('');
      setpassword('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Username atau Password Salah');
      } else if (err.response?.status === 404) {
        setErrMsg('Username atau Password Salah');
      } else {
        setErrMsg('Login Failed');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && (
        <Box sx={{ width: '100%', position: 'fixed', top: 0, zIndex: 9999 }}>
          <LinearProgress variant="indeterminate" />
        </Box>
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <BackgroundParticles />
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -top-40 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-4000"></div>
        </div>

        {/* Error Alert */}
        {errMsg && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <Alert variant="filled" severity="error" className='shadow-lg'>
              {errMsg}
            </Alert>
          </div>
        )}

        {/* Main Container - 3 Column Layout */}
        <div className="grid lg:col-4 relative z-10">

            {/* Center - Login Form */}
            <div className="col-span-4 animate-in zoom-in duration-700">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-95">
                {/* Top Accent Line */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"></div>

                {/* Content */}
                <div className="p-8 sm:p-10">
                  {/* Logo */}
                  <div className="mb-8 flex justify-center">
                    <img
                      alt="Logo SIM"
                      src={logo}
                      className="lg:h-20 h-6 w-auto drop-shadow-lg hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Header Text */}
                  <div className="text-center mb-8">
                    <h1 className="xl:text-3xl text-md font-bold text-gray-900 mb-2">
                      Selamat Datang
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Manajemen Pengelolaan dan Pengawasan Output Petugas Terintegrasi
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                        <input
                          id="username"
                          name="username"
                          type="text"
                          required
                          autoComplete="username"
                          placeholder="Masukkan username Anda"
                          onChange={(e) => setUsername(e.target.value)}
                          value={username}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          autoComplete="current-password"
                          placeholder="Masukkan password Anda"
                          onChange={(e) => setpassword(e.target.value)}
                          value={password}
                          className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: '#3b82f6',
                              '&.Mui-checked': {
                                color: '#2563eb',
                              },
                            }}
                          />
                        }
                        label={<span className="text-sm text-gray-700">Tetap masuk di perangkat ini</span>}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <CircularProgress size={20} color="inherit" />
                          <span>Sedang memproses...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          <span>MASUK</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer Info */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      © 2026 Malowopati. Semua hak dilindungi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}
