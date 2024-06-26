import React from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { collection } from "firebase/firestore";
import useGetArticles from "../Hooks/useGetArticles";
import heroImg from "../assets/images/hero.jpg";
import Articlecard from "../components/Articlecard";
import { db } from "../Utilis/firebase";

function Drafts() {
  const { articles, isLoading, error } = useGetArticles(
    collection(db, "drafts"),
  );

  if (isLoading) {
    return <Loader />;
  }

  if (articles.length > 0) {
    return (
      <>
        <Navbar />
        <main>
          <section className='mx-16 grid h-[50vh] place-items-center rounded-xl bg-[url("src/assets/images/hero.jpg")] bg-cover bg-no-repeat'>
            <h2 className='relative text-5xl font-extrabold after:absolute after:bottom-0 after:left-[10%] after:w-[120%] after:border after:border-primary before:absolute before:w-[120%] before:border before:border-primary before:top-0 py-3 before:right-[10%]'>
              Your Drafts
            </h2>
          </section>
          <section className='my-16 flex flex-col px-32'>
            <article className='grid grid-cols-2 gap-12'>
              {articles.map((article) => {
                return <Articlecard {...article} type="drafts" key={article.id} />;
              })}
            </article>
            </section>
        </main>
      </>
    );
  }
}

export default Drafts;
