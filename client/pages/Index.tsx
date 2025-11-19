import logo from '../assets/logo-malowopati.png'
import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/use-auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';

import axios from '../lib/api';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
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
      setAuth({ username, password, accessToken,roles });
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
      {errMsg && <Alert variant="filled" severity="error" className='w-fit top-4 right-4 absolute'>{errMsg}
      </Alert>}
      {isLoading && (
        <Box sx={{ width: '100%', position: 'absolute' }}>
          {/* Menggunakan variant="indeterminate" */}
          <LinearProgress variant="indeterminate" />
        </Box>
      )}
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth">
            <div className="row flex-grow">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-left p-5">
                  <div className="brand-logo">
                    <img
                      alt="Logo SIM"
                      src={logo}
                      className="mx-auto h-24 w-auto"
                    />
                  </div>
                  <h4>Halo! Mari kita mulai.</h4>
                  <h6 className="font-weight-light">Masuk untuk melanjutkan.</h6>
                  <form className="pt-3" method="POST" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className="form-control form-control-lg"
                      />
                    </div>
                    <div className="form-group relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        placeholder="Paswword"
                        onChange={(e) => setpassword(e.target.value)}
                        value={password}
                        className="form-control form-control-lg w-4/5 lg:w-5/6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-gray-700 bg-white hover:bg-blue-200 pl-4 w-1/5 lg:w-1/6 border border-gray-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button className="mt-3 d-grid gap-2 w-full" type="submit">
                      <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn grid">
                        SIGN IN</a>
                    </button>
                    <div className="my-2 d-flex justify-content-between align-items-center">
                      <FormControlLabel control={<Checkbox sx={{
                        color: purple[300],
                        '&.Mui-checked': {
                          color: purple[300],
                        },
                      }} />} label="Biarkan saya tetap masuk" className="form-check-label text-muted" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
