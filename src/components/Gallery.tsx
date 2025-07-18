"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Head from "next/head";

const categories = {
  חדרים: ["1st_bedroom.jpeg", "1st_bedroom2.jpeg", "2nd_bedroom.jpeg"],
  סלון: ["livingroom1.jpeg", "livingroom2.jpeg", "livingroom3.jpeg"],
  מטבח: ["kitchen1.jpeg", "kitchen2.jpeg", "kitchen3.jpeg"],
  "חדרי רחצה": ["1st_bathroom.jpeg", "2nd_bathroom.jpeg", "2nd_bathroom2.jpeg"],
  חוץ: ["garden1.jpeg", "garden2.jpeg", "outside_house.jpeg"],
};

const fallbackImage = "/gallery/house_from_mountain.jpeg";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const tCategories = t.raw("categories") as Record<string, string>;
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>("חדרים");
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const initialSrcs = categories[selectedCategory].reduce((acc, img) => {
    acc[img] = `/gallery/${img}`;
    return acc;
  }, {} as Record<string, string>);

  const [imageSrcs, setImageSrcs] = useState<Record<string, string>>(initialSrcs);

  const handleCategoryChange = (category: keyof typeof categories) => {
    setSelectedCategory(category);
    const newSrcs = categories[category].reduce((acc, img) => {
      acc[img] = `/gallery/${img}`;
      return acc;
    }, {} as Record<string, string>);
    setImageSrcs(newSrcs);
  };

  const slides = categories[selectedCategory].map((img) => ({
    src: imageSrcs[img],
  }));

  return (
    <>
      <Head>
        <title>{t("title")} | Dream Vacation</title>
        <meta
          name='description'
          content='גלריה עם תמונות החדרים, הסלון, המטבח והחצר.'
        />
      </Head>
      <main className='p-8 max-w-5xl mx-auto flex flex-col min-h-screen'>
        <h1 className='text-4xl font-bold text-center mb-8'>{t("title")}</h1>

        <div className='hidden sm:flex flex-wrap justify-center mb-8 gap-4'>
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() =>
                handleCategoryChange(category as keyof typeof categories)
              }
              className={`py-2 px-4 rounded ${
                selectedCategory === category
                  ? "bg-sky-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tCategories[category] || category}
            </button>
          ))}
        </div>

        <div className='sm:hidden mb-8 text-center'>
          <select
            value={selectedCategory}
            onChange={(e) =>
              handleCategoryChange(e.target.value as keyof typeof categories)
            }
            className='p-2 border rounded w-full max-w-xs'
          >
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {tCategories[category] || category}
              </option>
            ))}
          </select>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center flex-grow'>
          {categories[selectedCategory].map((img, index) => (
            <div
              key={index}
              className='relative overflow-hidden rounded-lg shadow aspect-[4/3] w-full h-64 sm:h-72 md:h-80 cursor-pointer'
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={imageSrcs[img]}
                alt={`${tCategories[selectedCategory] || selectedCategory} ${
                  index + 1
                }`}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                className='object-cover hover:scale-105 transition-transform duration-300'
                onError={() =>
                  setImageSrcs((prev) => ({
                    ...prev,
                    [img]: fallbackImage,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          slides={slides}
          index={lightboxIndex}
        />
      </main>
    </>
  );
}
