import React from 'react'
import aboutImg from "../assets/images/about_img.jpg"

function About() {
  return (
    <main className='px-32'>
      <h1 className='mx-auto text-center text-6xl font-semibold my-8'>
        About Coffee and Convos
      </h1>
      <div>
        <img
          src={aboutImg}
          alt='a picture of three coffee mugs'
          className='aspect-video object-cover object-center w-[60rem] rounded-xl border-2 border-primary mx-auto'
        />
      </div>
      <article className='prose-xl max-w-[60rem] mx-auto my-10'>
        <p>
          Welcome to Coffee & Convos, a blog dedicated to exploring the world of
          research and writing with a dose of coffee and conversations. Here,
          you'll find interesting articles, essays, and stories that will help
          you to expand your knowledge on various topics.
        </p>
        <p>
          I'm also called the Beta Writer and I'm passionate about research and
          writing. I'm always looking for new and innovative ways to push my
          boundaries and create content that's both informative and
          entertaining. I'm here to share my love of coffee, conversation, and
          writing with the world. So come join me and let's explore the world
          together.
        </p>
      </article>
    </main>
  );
}

export default About