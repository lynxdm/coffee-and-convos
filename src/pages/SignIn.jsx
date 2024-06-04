import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg1 from "../assets/images/loginImg1.webp";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../Utilis/firebase";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useGlobalContext } from "../context";

function SignIn() {
  let navigate = useNavigate();

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

  const signInWithGoogle = () => {
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
      className='flex w-full justify-between py-10 pt-6 px-32 items-center'
    >
      <section className='w-[40%] overflow-clip shadow-black shadow h-[33rem]'>
        <img
          src={loginImg1}
          className='brightness-90  w-full max-h-full object-cover'
          alt='an abstract artwork'
        />
      </section>
      <section className='flex flex-col gap-2 p-8 w-[55%] border-primary border-2 rounded-sm shadow  max-h-[33rem]'>
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
            Continue
          </button>
        </form>
        <p className='relative text-center after:absolute after:border-b after:border-gray-500 after:top-1/2 after:right-0 after:w-[47%] before:absolute before:border-b before:border-gray-500 before:top-1/2 before:w-[47%] before:left-0'>
          Or
        </p>
        <button
          className='border border-primary flex items-center mt-4 gap-4 p-2 rounded-sm justify-center hover:outline outline-1'
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
