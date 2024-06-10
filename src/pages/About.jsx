import React from "react";
import aboutImg from "../assets/images/about_img.jpg";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar"
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";

function About() {
  return (
    <>
    <Navbar/>
      <main className='px-32'>
        <h1 className='mx-auto text-center text-5xl font-semibold mt-4 mb-0'>
          About Coffee & Convos
        </h1>
        <div className='flex gap-[10rem] items-center my-[4rem] mb-[8rem] justify-center'>
          <div className='relative after:absolute after:w-[10rem] after:top-[80%] aspect-square h-[30rem] border after:right-0 after:translate-x-[80%] after:border after:border-primary bg-[#fdadb8]'>
            <img
              src={aboutImg}
              alt='a picture of three coffee mugs'
              className='absolute top-[3rem] left-[3rem] aspect-square object-cover object-center h-[30rem]'
            />
          </div>
          <section className='max-w-[30rem]'>
            <article className='prose-xl max-w-full mx-auto'>
              <p>
                Welcome to Coffee & Convos, a blog dedicated to exploring the
                world of research and writing with a dose of coffee and
                conversations. Here, you'll find interesting articles, essays,
                and stories that will help you to expand your knowledge on
                various topics.
              </p>
              <p>
                I'm also called the Beta Writer and I'm passionate about
                research and writing. I'm always looking for new and innovative
                ways to push my boundaries and create content that's both
                informative and entertaining. I'm here to share my love of
                coffee, conversation, and writing with the world. So come join
                me and let's explore the world together.
              </p>
            </article>
            <Link to={"/"} className="flex items-center gap-3 justify-end mt-2">
              <p className="font-semibold font-overpass text-lg">View blog</p>
              <HiOutlineArrowNarrowRight className="size-6" />
            </Link>
            {/* <ul className='mt-5 flex gap-5 justify-center *:*:size-6'>
              <li>
                <FaLinkedinIn />
              </li>
              <li>
                <FaXTwitter />
              </li>
              <li>
                <FaInstagram />
              </li>
              <li>
                <FaMedium />
              </li>
              <li>
                <BiLogoGmail />
              </li>
            </ul> */}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default About;
