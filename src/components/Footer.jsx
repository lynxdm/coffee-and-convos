import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";

function Footer() {
  return (
    <footer className='border-t-2 border-primary flex items-center py-4'>
      <ul className='mx-auto flex gap-3'>
        <li>
          <FaLinkedin className='size-6' />
        </li>
        <li>
          <FaXTwitter className='size-6' />
        </li>
        <li>
          <FaInstagram className='size-6' />
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
