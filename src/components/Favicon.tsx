import React from "react";

const Favicon: React.FC = () => {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon-180x180.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/favicon-192x192.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      
      {/* <link rel="manifest" href="static/favion/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" /> */}
    </>
  );
}

export default Favicon;
