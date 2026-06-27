const slides = Array.from(document.querySelectorAll('.slide'));
const progressBar = document.getElementById('progressBar');
const currentSlide = document.getElementById('currentSlide');
const totalSlides = document.getElementById('totalSlides');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let index = 0;
let isAnimating = false;

totalSlides.textContent = String(slides.length).padStart(2, '0');

function normalizedIndex(value){
  return (value + slides.length) % slides.length;
}

function setDirection(nextIndex){
  const normalized = normalizedIndex(nextIndex);
  const goingNext = normalized === 0 && index === slides.length - 1 ? true : normalized > index;
  document.body.classList.remove('nav-next','nav-prev');
  // restart CSS animation cleanly
  void document.body.offsetWidth;
  document.body.classList.add(goingNext ? 'nav-next' : 'nav-prev');
}

function showSlide(nextIndex){
  if(isAnimating) return;
  isAnimating = true;
  setDirection(nextIndex);
  index = normalizedIndex(nextIndex);
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    if(i === index) slide.scrollTop = 0;
  });
  currentSlide.textContent = String(index + 1).padStart(2, '0');
  progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  document.title = `${slides[index].dataset.title} | نظام إدارة الفعاليات`;
  setTimeout(() => { isAnimating = false; }, 250);
}

nextBtn.addEventListener('click', () => showSlide(index + 1));
prevBtn.addEventListener('click', () => showSlide(index - 1));

document.addEventListener('keydown', (e) => {
  if(['ArrowLeft','PageDown',' '].includes(e.key)) showSlide(index + 1);
  if(['ArrowRight','PageUp'].includes(e.key)) showSlide(index - 1);
  if(e.key === 'Home') showSlide(0);
  if(e.key === 'End') showSlide(slides.length - 1);
});

let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive:true});
document.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if(Math.abs(delta) > 60) showSlide(index + (delta > 0 ? -1 : 1));
}, {passive:true});

// Premium button feedback
[nextBtn, prevBtn].forEach(btn => {
  btn.addEventListener('pointerdown', () => btn.classList.add('pressed'));
  btn.addEventListener('pointerup', () => btn.classList.remove('pressed'));
  btn.addEventListener('pointerleave', () => btn.classList.remove('pressed'));
});

showSlide(0);
