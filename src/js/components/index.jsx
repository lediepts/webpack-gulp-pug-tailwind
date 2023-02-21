import React, { useEffect, useRef, useState } from "react";

const slides = [
  {
    // title1: "春夏秋冬",
    title2: "具を食べるおにぎり、",
    title3: "仕出し弁当やロケ弁と食品加工製造",
    description: "仕出し 松うら",
    img: "/img/slides/01.jpg",
  },
  {
    // title1: "春夏秋冬",
    title2: "具を食べるおにぎり、",
    title3: "仕出し弁当やロケ弁と食品加工製造",
    description: "仕出し 松うら",
    img: "/img/slides/02.jpg",
  },
  {
    // title1: "春夏秋冬",
    title2: "具を食べるおにぎり、",
    title3: "仕出し弁当やロケ弁と食品加工製造",
    description: "仕出し 松うら",
    img: "/img/slides/03.jpg",
  },
];

function Home() {
  const [state, setState] = useState({
    activeSlide: 0,
    prevSlide: -1,
    sliderReady: true,
  });
  const changeSlides = (change = 1) => {
    const { length } = slides;
    const prevSlide = state.activeSlide;
    let activeSlide = prevSlide + change;
    if (activeSlide < 0) activeSlide = length - 1;
    if (activeSlide >= length) activeSlide = 0;
    setState({ ...state, activeSlide, prevSlide });
  };
  useInterval(() => {
    changeSlides(1);
  }, 6000);
  return (
    <div className={`slider ${state.sliderReady ? "s--ready" : ""}`}>
      <div className="slider__slides">
        {slides.map((slide, index) => {
          return (
            <div
              className={`slider__slide  ${
                state.activeSlide === index ? "s--active" : "s--prev"
              }`}
              key={slide.img}
            >
              <div className="slider__slide-content">
                <h2 className="slider__slide-heading">
                  <div>
                    {slide.title2.split("").map((c, i) => {
                      return <span key={i}>{c}</span>;
                    })}
                  </div>
                  <div>
                    {slide.title3.split("").map((c, i) => {
                      return <span key={i}>{c}</span>;
                    })}
                  </div>
                </h2>
                <h3 className="slider__slide-subheading">
                  {slide.description}
                </h3>
              </div>
              <div className="slider__slide-parts">
                {[...Array(8).fill(5)].map((_x, i) => {
                  return (
                    <div className="slider__slide-part" key={i}>
                      <div
                        className="slider__slide-part-inner"
                        style={{ backgroundImage: `url(${slide.img})` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
}
