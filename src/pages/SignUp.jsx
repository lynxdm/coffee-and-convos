import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { auth, storage } from "../Utilis/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import { BiLogoGmail } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import useNotification from "../Hooks/useNotification";
import { v4 } from "uuid";

function SignUp() {
  const [signInWithGoogle] = useOutletContext();
  const [isUsingEmail, setIsUsingEmail] = useState(false);
  const { createUserNotification } = useNotification();

  const [userInfo, setUserInfo] = useState(
    JSON.parse(sessionStorage.getItem("userInfo")) || {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      photoURL: "",
      profileId: v4(),
    },
  );
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

  useEffect(() => {
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  const uploadProfileImage = (e) => {
    if (e.target.files[0]) {
      // setCoverIsLoading(true);
      const profileImage = e.target.files[0];
      const profileImageRef = ref(
        storage,
        `profile_photos/image-${userInfo.profileId}`,
      );
      uploadBytes(profileImageRef, profileImage)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setUserInfo({
              ...userInfo,
              photoURL: url,
            });
            console.log(url);
            // setCoverIsLoading(false);
          });
        })
        .catch((error) => {
          // setCoverIsLoading(false);
          // setArticleDraft({
          //   ...articleDraft,
          //   coverImg: "",
          //   coverImgPath: "",
          // });
          // setErrorComponent({
          //   show: true,
          //   content: "There was a problem uploading the image:",
          // });
          console.log(error);
        });
    }
  };

  const deleteProfileImage = () => {
    const profileImageRef = ref(
      storage,
      `profile_photos/image-${userInfo.profileId}`,
    );

    deleteObject(profileImageRef)
      .then(() => {
        setUserInfo({ ...userInfo, photoURL: "" });
        console.log("deletetd");
      })
      .catch((error) => {
        // setErrorComponent({ show: true, content: "Whoops an error occurred:" });
        console.log(error);
      });
  };

  const changeProfileImage = (e) => {
    deleteProfileImage();
    uploadProfileImage(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: `${userInfo.firstName} ${userInfo.lastName}`,
          photoURL: userInfo.photoURL,
        });
        createUserNotification(user)
        setUserInfo({});
        navigate("/");
        console.log(user);
      })
      .catch((error) => console.log(error)); 
  };

  return (
    <>
      {!isUsingEmail ? (
        <>
          <h2 className='mx-auto mb-4 text-2xl font-bold'>Hello there.</h2>
          <div className='flex flex-col gap-2 text-lg *:flex *:gap-3 *:rounded-[3rem] *:bg-primary *:px-12 *:py-4 *:font-semibold *:text-white dark:*:bg-[#262626] md:*:text-xl'>
            <button onClick={signInWithGoogle}>
              {" "}
              <svg className='size-6' viewBox='0 0 1152 1152'>
                {" "}
                <path
                  d='M1055.994 594.42a559.973 559.973 0 0 0-8.86-99.684h-458.99V683.25h262.28c-11.298 60.918-45.633 112.532-97.248 147.089v122.279h157.501c92.152-84.842 145.317-209.78 145.317-358.198z'
                  fill='#4285f4'
                ></path>
                <path
                  d='M588.144 1070.688c131.583 0 241.9-43.64 322.533-118.07l-157.5-122.28c-43.64 29.241-99.463 46.52-165.033 46.52-126.931 0-234.368-85.728-272.691-200.919H152.636v126.267c80.19 159.273 245 268.482 435.508 268.482z'
                  fill='#34a853'
                ></path>{" "}
                <path
                  d='M315.453 675.94a288.113 288.113 0 0 1 0-185.191V364.482H152.636a487.96 487.96 0 0 0 0 437.724z'
                  fill='#fbbc05'
                ></path>{" "}
                <path
                  d='M588.144 289.83c71.551 0 135.792 24.589 186.298 72.88l139.78-139.779C829.821 144.291 719.504 96 588.143 96c-190.507 0-355.318 109.21-435.508 268.482L315.453 490.75c38.323-115.19 145.76-200.919 272.691-200.919z'
                  fill='#ea4335'
                ></path>
              </svg>
              <p>Sign up with Google</p>
            </button>
            <button onClick={() => setIsUsingEmail(true)}>
              <BiLogoGmail className='size-6' />
              <p>Sign up with Email</p>
            </button>
          </div>
          <p className='mx-auto mt-6'>
            Already have an account?{" "}
            <Link className='font-extrabold text-blue-700' to={"/login"}>
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <>
          <h2 className='mx-auto mb-4 mt-4 text-xl font-semibold lg:mt-0 lg:text-2xl'>
            Sign up with Email
          </h2>
          <div className='w-[21rem] rounded-3xl border-2 border-primary p-5 dark:border-[#3a3a3a] lg:w-[30rem] lg:p-6'>
            <button
              className='float-right flex items-center gap-1 font-bold text-blue-800'
              onClick={() => setIsUsingEmail(false)}
            >
              <FaChevronLeft className='size-2 lg:size-3' />
              <p className='text-sm lg:text-[1rem]'>All sign up options</p>
            </button>
            <form
              className='clear-both my-4 mt-9 flex flex-col gap-4'
              onSubmit={handleSubmit}
            >
              <div className='flex w-full flex-col gap-2'>
                {!userInfo.photoURL ? (
                  <label
                    htmlFor='profile_photo'
                    className='mb-4 w-fit cursor-pointer rounded-md border-2 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-gray-700 dark:border-[#3a3a3a] dark:text-darkPrimary lg:px-4 lg:text-base'
                  >
                    <p>Upload a profile photo</p>
                    <input
                      type='file'
                      className='hidden'
                      id='profile_photo'
                      name='profile_photo'
                      onInput={uploadProfileImage}
                      required
                    />
                  </label>
                ) : (
                  <div className='mb-4 flex items-center gap-3 lg:gap-4'>
                    <img
                      src={userInfo.photoURL}
                      alt='profile photo'
                      className='size-[5rem] rounded-full border border-gray-700 object-cover dark:border-[#3a3a3a]'
                    />
                    <label
                      htmlFor='change_image'
                      className='w-fit cursor-pointer rounded-md border-2 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-gray-700 dark:border-[#3a3a3a] dark:text-darkPrimary lg:px-4 lg:text-base'
                    >
                      <p>Change photo</p>
                      <input
                        type='file'
                        name='change_image'
                        id='change_image'
                        className='hidden'
                        onInput={changeProfileImage}
                      />
                    </label>
                  </div>
                )}
                <div className='flex w-full flex-col gap-1'>
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
                    className='relative border-b border-primary bg-inherit font-semibold focus:border-b-2 focus:outline-none dark:border-[#3a3a3a] dark:focus-within:border-darkSecondary'
                  />
                </div>
                <div className='flex w-full flex-col gap-1'>
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
                    className='border-b border-primary bg-inherit font-semibold focus:border-b-2 focus:outline-none dark:border-[#3a3a3a] dark:focus:border-darkSecondary'
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
                  className='border-b border-primary bg-inherit font-semibold focus:border-b-2 focus:outline-none dark:border-[#3a3a3a] dark:focus:border-darkSecondary'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='password' className='text-sm'>
                  Password
                </label>
                <div className='flex gap-1 border-b border-primary focus-within:border-b-2 dark:border-[#3a3a3a] dark:focus-within:border-darkSecondary'>
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
                className='mt-4 rounded-3xl border border-primary bg-primary py-2 text-white dark:border-[#3a3a3a] dark:bg-[#262626]'
              >
                Create Account
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default SignUp;
