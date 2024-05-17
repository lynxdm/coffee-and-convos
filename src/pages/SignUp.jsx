import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg2 from "../assets/images/loginImg3.jpg";
import { auth, provider } from "../Utilis/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useGlobalContext } from "../context";

function SignUp() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

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

    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: `${userInfo.firstName} ${userInfo.lastName}`,
        });
        navigate("/");
        console.log(user);
      })
      .catch((error) => console.log(error));

    setUserInfo({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    });
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/");
        console.log(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main
      className='flex w-full justify-center
    gap-16 py-12 pt-6 px-20 items-center'
    >
      <section className='w-[35%] shadow-black shadow'>
        <img
          src={loginImg2}
          className='brightness-90 aspect-[12/16] h-[35rem]'
          alt='an abstract artwork'
        />
      </section>
      <section className='flex flex-col gap-2 p-6 w-1/2 border-primary border-2 rounded-sm max-h-[35rem]'>
        <h2 className='text-4xl font-semibold'>Coffee & Convos</h2>
        <h3 className='text-2xl'>Sign up</h3>
        <button
          type='button'
          className='border border-primary px-10 py-2 rounded w-full items-center justify-center hover:outline outline-1 flex gap-2 mt-2'
          onClick={signUpWithGoogle}
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
          <p>Sign in with Google</p>
        </button>
        <p className='relative my-2 text-center after:absolute after:border-b after:border-gray-500 after:top-1/2 after:right-0 after:w-[47%] before:absolute before:border-b before:border-gray-500 before:top-1/2 before:w-[47%] before:left-0'>
          Or
        </p>
        {/* <h3 className='text-xl font-semibold'>Sign up with email</h3> */}
        <form className='flex flex-col gap-4 mt-1 my-4' onSubmit={handleSubmit}>
          <div className='flex gap-2 w-full'>
            <div className='flex flex-col gap-1 w-1/2'>
              <label htmlFor='firstName' className='text-md'>
                First Name
              </label>
              <input
                type='text'
                required
                name='firstName'
                id='firstName'
                value={userInfo.firstName}
                onChange={handleChange}
                className='bg-inherit border-b relative border-primary focus:outline-none focus:border-b-2 font-semibold'
              />
            </div>
            <div className='flex flex-col gap-1 w-1/2'>
              <label htmlFor='lastName' className='text-md'>
                Last Name
              </label>
              <input
                type='text'
                required
                name='lastName'
                id='lastName'
                value={userInfo.lastName}
                onChange={handleChange}
                className='bg-inherit border-b border-primary focus:outline-none focus:border-b-2 font-semibold'
              />
            </div>
          </div>
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
              className='bg-inherit border-b border-primary focus:outline-none focus:border-b-2 font-semibold'
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
                className='bg-inherit focus:outline-none w-[95%]'
              />
              {userInfo.password.length > 0 && (
                <button
                  type='button'
                  className='w-[5%] text-3xl grid place-items-center'
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
            className='border border-primary mt-4 py-2 rounded-sm hover:outline outline-1'
          >
            Create Account
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to={"/login"} className='text-black font-bold'>
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}

export default SignUp;
