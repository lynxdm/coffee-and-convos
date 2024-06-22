import React, { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import loginImg1 from "../assets/images/loginImg1.webp";
import {
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, provider } from "../Utilis/firebase";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useGlobalContext } from "../context";
import useNotification from "../Hooks/useNotification";

function SignIn() {
  let navigate = useNavigate();
  const [signInWithGoogle] = useOutletContext();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setUserInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserInfo({
          email: "",
          password: "",
        });
        navigate("/");
        console.log(user);
      })
      .catch((error) => console.log(error));
  };

  return (
    <main className='flex w-full items-center justify-between px-32 py-10 pt-6'>
      <section className='h-[33rem] w-[40%] overflow-clip shadow shadow-black'>
        <img
          src={loginImg1}
          className='max-h-full w-full object-cover brightness-90'
          alt='an abstract artwork'
        />
      </section>
      <section className='flex max-h-[33rem] w-[55%] flex-col gap-2 rounded-sm border-2 border-primary p-8 shadow'>
        <h2 className='text-4xl font-semibold'>Coffee & Convos</h2>
        <h3 className='text-2xl'>Sign in</h3>
        <p>
          Don't have an account?{" "}
          <Link to={"signup"} className='font-bold text-black'>
            Create one
          </Link>
        </p>
        <form className='my-6 flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='email' className='text-sm'>
              Email
            </label>
            <input
              type='email'
              required
              name='email'
              id='email'
              value={userInfo.email}
              onChange={handleChange}
              className='border-b border-primary bg-inherit focus:border-b-2 focus:outline-none'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='text-sm'>
              Password
            </label>
            <div className='flex gap-1 border-b border-primary focus-within:border-b-2'>
              <input
                type={showPassword ? "text" : "password"}
                required
                name='password'
                id='password'
                value={userInfo.password}
                onChange={handleChange}
                className='w-[95%] bg-inherit focus:outline-none'
              />
              {userInfo.password.length > 0 && (
                <button
                  type='button'
                  className='grid w-[5%] place-items-center text-3xl'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEyeSlash className='size-5' />
                  ) : (
                    <FaRegEye className='size-5' />
                  )}
                </button>
              )}
            </div>
          </div>
          <button
            type='submit'
            className='mt-4 rounded-sm border border-primary py-2 outline-1 hover:outline'
          >
            Continue
          </button>
        </form>
        <p className='relative text-center before:absolute before:left-0 before:top-1/2 before:w-[47%] before:border-b before:border-gray-500 after:absolute after:right-0 after:top-1/2 after:w-[47%] after:border-b after:border-gray-500'>
          Or
        </p>
        <button
          className='mt-4 flex items-center justify-center gap-4 rounded-sm border border-primary p-2 outline-1 hover:outline'
          onClick={signInWithGoogle}
        >
          <svg className='size-6' viewBox='0 0 1152 1152'>
            <path
              d='M1055.994 594.42a559.973 559.973 0 0 0-8.86-99.684h-458.99V683.25h262.28c-11.298 60.918-45.633 112.532-97.248 147.089v122.279h157.501c92.152-84.842 145.317-209.78 145.317-358.198z'
              fill='#4285f4'
            ></path>
            <path
              d='M588.144 1070.688c131.583 0 241.9-43.64 322.533-118.07l-157.5-122.28c-43.64 29.241-99.463 46.52-165.033 46.52-126.931 0-234.368-85.728-272.691-200.919H152.636v126.267c80.19 159.273 245 268.482 435.508 268.482z'
              fill='#34a853'
            ></path>
            <path
              d='M315.453 675.94a288.113 288.113 0 0 1 0-185.191V364.482H152.636a487.96 487.96 0 0 0 0 437.724z'
              fill='#fbbc05'
            ></path>
            <path
              d='M588.144 289.83c71.551 0 135.792 24.589 186.298 72.88l139.78-139.779C829.821 144.291 719.504 96 588.143 96c-190.507 0-355.318 109.21-435.508 268.482L315.453 490.75c38.323-115.19 145.76-200.919 272.691-200.919z'
              fill='#ea4335'
            ></path>
          </svg>
          <p>Continue with Google</p>
        </button>
      </section>
    </main>
  );
}

export default SignIn;
