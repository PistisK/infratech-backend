let slides = [
  {
    id: 1,
    title: "Reliable ICT Solutions",
    subtitle: "Empowering businesses with secure and scalable technology",
    image: "http://localhost:5000/images/slider1.jpg",
    ctaText: "Our Services",
    ctaLink: "/services",
  },
  {
    id: 2,
    title: "Digital Transformation",
    subtitle: "Modern systems that drive efficiency and growth",
    image: "http://localhost:5000/images/slider2.jpg",
    ctaText: "View Projects",
    ctaLink: "/projects",
  },
  {
    id: 3,
    title: "Professional IT Support",
    subtitle: "Your trusted technology partner in Malawi",
    image: "http://localhost:5000/images/slider3.jpg",
    ctaText: "Contact Us",
    ctaLink: "/contact",
  },
  {
    id: 4,
    title: "Development of Scalable Systems",
    subtitle: "Your trusted partner when it comes to system development",
    image: "http://localhost:5000/images/slider4.jpg",
    ctaText: "Contact Us",
    ctaLink: "/contact",
  },
];

export const getSlides = () => slides;

export const addSlide = (slide) => {
  slide.id = Date.now();
  slides.push(slide);
};

export const updateSlide = (id, data) => {
  slides = slides.map((s) => (s.id === id ? { ...s, ...data } : s));
};

export const deleteSlide = (id) => {
  slides = slides.filter((s) => s.id !== id);
};
