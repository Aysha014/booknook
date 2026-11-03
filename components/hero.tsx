
"use client";

import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { ArrowRight } from "lucide-react";

// Hero Slider Data
const slides = [
  {
    tag: "YOUR NEXT CHAPTER STARTS HERE",
    title: (
      <>
        Find your next <em>favorite</em> story.
      </>
    ),
    desc: "A good book can take you anywhere. Explore a little, borrow a little, and pass the magic along.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000&q=85",
    bg: "var(--lav)",
    note: "A whole world, one page at a time.",
  },
  {
    tag: "READ. SHARE. REPEAT.",
    title: (
      <>
        Stories are better <em>shared.</em>
      </>
    ),
    desc: "Give a much-loved book a new home for a while. Your next great read is waiting on someone else's shelf.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1000&q=85",
    bg: "var(--butter)",
    note: "Pass a story. Start a connection.",
  },
  {
    tag: "A COMMUNITY OF CURIOUS MINDS",
    title: (
      <>
        Make room for <em>wonder.</em>
      </>
    ),
    desc: "From page-turning fiction to curious science, find books that make you think, feel and imagine.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1000&q=85",
    bg: "var(--mint)",
    note: "Your reading adventure begins here.",
  },
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-frame">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          loop
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="hero-slide"
                style={{ background: slide.bg }}
              >
                <div className="hero-copy">
                  <span className="eyebrow">
                    {slide.tag}
                  </span>

                  <h1>{slide.title}</h1>

                  <p>{slide.desc}</p>

                  <Link
                    href="/books"
                    className="btn btn-primary"
                  >
                    Browse books
                    <ArrowRight size={17} />
                  </Link>
                </div>

                <div className="hero-visual">
                  <div className="hero-orbit" />

                  <img
                    className="hero-image"
                    src={slide.image}
                    alt="Books and reading"
                  />

                  <div className="hero-sticker">
                    GOOD BOOKS
                    <br />
                    GOOD MOODS ✦
                  </div>

                  <div className="hero-note">
                    ✦ {slide.note}
                    <span>Welcome to BookNook</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
