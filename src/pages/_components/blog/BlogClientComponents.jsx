"use client";
import React, { useState, useEffect } from "react";
import styles from "./BlogClientComponents.module.css";

// --- HELPERS REPLACING NEXT/NAVIGATION ---
const getPathname = () => window.location.pathname;
const getSearchParams = () => new URLSearchParams(window.location.search);
const navigate = (url) => {
  // window.location.assign updates the URL and triggers Astro to re-render the page
  window.location.assign(url);
};
export function ArrowBackwardsPagination(props) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path  d="M17.77 3.77L16 2L6 12l10 10l1.77-1.77L9.54 12z"></path></svg>);
}
export function ArrowForwardPagination(props) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path  d="M6.23 20.23L8 22l10-10L8 2L6.23 3.77L14.46 12z"></path></svg>);
}


export function CategorySelector1({ tags }) {
  // Get initial category from URL on mount
  const [tag, setTag] = useState("all");

  useEffect(() => {
    const params = getSearchParams();
    setTag(params.get("tag") || "all");
  }, []);

  function clickHandler(e) {
    const selected = e.target.value;
    const params = new URLSearchParams(window.location.search); // Винаги взимайте пресни параметри
    
    params.set("tag", selected);
    params.set("page", "1");

    // toString() ще направи "testing tag" на "testing+tag"
    // Това е правилното поведение за URL.
    navigate(`${getPathname()}?${params.toString()}`);
  }

  return (
    <section className={styles["category-container-1"]}>
      <button 
        className={styles["category-label-1"]} 
        value="all" 
        onClick={clickHandler}
      >
        Всички
      </button>
      {tags.map((cat, index) => (
        <button
          className={styles["category-label-1"]}
          type="button"
          value={cat.slug?.current || 'категория'}
          key={index}
          onClick={clickHandler}
          style={{ fontWeight: tag === cat ? "bold" : "normal" }}
        >
          {cat?.title || 'блог-категория'}
        </button>
      ))}
    </section>
  );
}

export function Pagination({ maxPages }) {
  const [page, setPage] = useState(1);
  // console.log(maxPages, 'from pagination')
  useEffect(() => {
    const params = getSearchParams();
    setPage(Number(params.get("page")) || 1);
  }, []);

 
 function incrementPage(e) {
    if (Number(page) + 1 > maxPages) return;
    setPage(Number(page) + 1);
     const params = getSearchParams();
    params.set("page", Number(page) + 1);
    navigate(`${getPathname()}?${params.toString()}`);
  }
  function decrementPage(e) {
    if (Number(page) - 1 > 0) {
      setPage(Number(page) - 1);
       const params = getSearchParams();
      params.set("page", Number(page) - 1);
      navigate(`${getPathname()}?${params.toString()}`);
    }
  }
  return (
 
    <div className={styles["pagination"]}>
      {Number(page) > 1 ? (
        <button
          onClick={decrementPage}
          className={styles["pagination-page-number"]}
        >
          <ArrowBackwardsPagination className={styles["arrow-icon"]} />
        </button>
      ) : (
        <button
          disabled
          onClick={decrementPage}
          className={styles["pagination-page-number"]}
        >
          <ArrowBackwardsPagination className={styles["arrow-icon"]} />
        </button>
      )}
      <div className={styles["pagination-page-number"]}>
        <p >
          {page}
        </p>

      </div>
      <button 
       onClick={incrementPage}
        className={styles["pagination-page-number"]}
      >
        <ArrowForwardPagination className={styles["arrow-icon"]} />
      </button>
    </div>
  );
}