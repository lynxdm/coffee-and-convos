import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginImg1 from "../assets/images/loginImg1.webp";

function SignIn() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

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
    setUserInfo({
      email: "",
      password: "",
    });
  };

  return (
    <main
      className='flex w-full justify-center
    gap-16 py-10 pt-6 px-20'
    >
      <section className='w-1/2'>
        <img
          src={loginImg1}
          className='brightness-90'
          alt='an abstract artwork'
        />
      </section>
      <section className='flex flex-col gap-4 p-8 w-1/2 border-primary border rounded-sm'>
        <h2 className='text-4xl font-semibold'>Coffee & Convos</h2>
        <h3 className='text-2xl'>Sign in</h3>
        <p>
          Don't have an account?{" "}
          <Link to={"signup"} className='text-black font-bold'>
            Create one
          </Link>
        </p>
        <form className='flex flex-col gap-4 my-6' onSubmit={handleSubmit}>
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
              className='bg-inherit border-b border-primary focus:outline-none focus:border-b-2'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='text-sm'>
              Password
            </label>
            <input
              type='password'
              required
              name='password'
              id='password'
              value={userInfo.password}
              onChange={handleChange}
              className='bg-inherit border-b border-primary focus:outline-none focus:border-b-2'
            />
          </div>
          <button
            type='submit'
            className='border border-primary mt-4 py-2 rounded-sm hover:outline outline-1'
          >
            Continue
          </button>
        </form>
        <p className='relative text-center after:absolute after:border-b after:border-gray-500 after:top-1/2 after:right-0 after:w-[47%] before:absolute before:border-b before:border-gray-500 before:top-1/2 before:w-[47%] before:left-0'>
          Or
        </p>
        <div className='flex flex-col gap-4 mt-4'>
          <button className='border border-primary flex items-center gap-4 p-2 rounded-sm justify-center hover:outline outline-1'>
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
          <button className='border border-primary flex items-center gap-4 p-2 rounded-sm justify-center hover:outline outline-1'>
            <svg
              className='size-6'
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='100'
              height='100'
              viewBox='0 0 48 48'
            >
              <path
                fill='#039be5'
                d='M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z'
              ></path>
              <path
                fill='#fff'
                d='M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z'
              ></path>
            </svg>
            <p>Continue with Facebook</p>
          </button>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
