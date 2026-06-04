// Splide slider (no changes needed here)
function slider1() {
  let splides = $('#splide-carousel');
  initializeSplides(splides, 'ltr');
}

function initializeSplides(splides, direction) {
  for (let i = 0, splideLength = splides.length; i < splideLength; i++) {
    new Splide(splides[i], {
      perPage: "auto",
      arrows: false,
      pagination: false,
      focus: 'center',
      direction: direction,
      gap: '1.5rem',
      autoScroll: {
        autoStart: true,
        speed: 0.8,
      },
      perMove: 1,
      type: "loop",
    }).mount(window.splide.Extensions);
  }
}
slider1();

// --- GLOBAL ELEMENTS & EVENT ---
// Define elements used by multiple functions at the top level
const rangeSlider = document.getElementById('Range');
const workerPrice = document.getElementById('workerPrice');
const nightPrice = document.getElementById('nightPrice');
const saturdayPrice = document.getElementById('saturdayPrice');
const eveningPrice = document.getElementById('eveningPrice');
const sundayPrice = document.getElementById('sundayPrice');
const publicPrice = document.getElementById('publicPrice');
const travelPrice = document.getElementById('travelPrice');
const totalPrice = document.getElementById('totalPrice');
const sleepOver = document.getElementById('sleepOver');

// Create custom event for updating the slider
var updateSliderEvent = document.createEvent("Event");
updateSliderEvent.initEvent("updateSliderValue");

// --- REFACTORED LOTTIE SLIDER SETUP ---
var totalValues = 14

console.log("Setting up Lottie slider with totalValues:", totalValues); // Debugging

let latestFrame = 0;
const resizableDiv = document.getElementById('resizableDiv');
const movingDiv = document.getElementById('movingDiv');

// Set the initial slider value to 0
rangeSlider.value = 0;

// Get the wings Lottie animation
const lottieElement = document.querySelector('.wings_lottie');
const lottieSrc = lottieElement.getAttribute('data-src');
const lottieInstance = lottie.loadAnimation({
  container: lottieElement,
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: lottieSrc,
});

window.lottieInstance = lottieInstance

lottieInstance.addEventListener('complete', function () {
  if (lottieInstance.renderer.renderedFrame !== latestFrame) {
    lottieInstance.playSegments([lottieInstance.renderer.renderedFrame, latestFrame], true)
  }
});

lottieInstance.addEventListener('DOMLoaded', function () {
  const maxFrames = lottieInstance.totalFrames;
  let initialSliderValue = Math.min(rangeSlider.value, totalValues);
  const initialFrame = (initialSliderValue / totalValues) * maxFrames;

  lottieInstance.setSpeed(1.2);
  lottieInstance.playSegments([lottieInstance.renderer.renderedFrame, initialFrame], true);
  latestFrame = initialFrame;

  resizableDiv.style.width = `${(initialSliderValue / totalValues) * 100}%`;
  movingDiv.style.left = `${(initialSliderValue / totalValues) * 100}%`;

  const updateSlider = () => {
    console.log({ totalValues })
    const sliderValue = rangeSlider.value;
    resizableDiv.style.width = `${(sliderValue / totalValues) * 100}%`;
    movingDiv.style.left = `${(sliderValue / totalValues) * 100}%`;

    let frame = (sliderValue / totalValues) * maxFrames;
    if (frame >= maxFrames) {
      frame = maxFrames - 1;
    }
    latestFrame = frame;

    if (lottieInstance.isPaused) {
      console.log("Playing segments...")
      lottieInstance.playSegments([lottieInstance.renderer.renderedFrame, frame], false);
    }
  };

  rangeSlider.addEventListener('input', updateSlider);
  rangeSlider.addEventListener("updateSliderValue", updateSlider, false);
});

// Second Lottie animation for thumb click
const secondLottieElement = document.querySelector('.pony-lottie');
const secondLottieSrc = secondLottieElement.getAttribute('data-src');
const secondLottieInstance = lottie.loadAnimation({
  container: secondLottieElement,
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: secondLottieSrc,
});

rangeSlider.addEventListener('mousedown', function () {
  secondLottieInstance.stop();
  secondLottieInstance.play();
});

rangeSlider.addEventListener("mouseup", function () {
  secondLottieInstance.stop();
  secondLottieInstance.play();
});

// --- DATA FETCHING & PRICE UPDATING LOGIC ---
async function fetchPricingData() {
  const url = "https://humdrum.app/api/1.1/wf/payrates-current-payrates";
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function updatePrices(data, index) {
  if (!data || !data.hourly_rates || !data.hourly_rates.rates || data.hourly_rates.rates.length <=
    index) return;
  const selectedRate = data.hourly_rates.rates[index];

  // Helper: only set innerText if the element actually exists
  const setText = (el, value) => {
    if (el) el.innerText = value;
    else console.warn('updatePrices: missing target element for value:', value);
  };

  setText(workerPrice, `${selectedRate['baserate_(weekday)_pay']}`);
  setText(nightPrice, `${selectedRate.night_cost}`);
  setText(saturdayPrice, `${selectedRate.saturday_cost}`);
  setText(eveningPrice, `${selectedRate.evening_cost}`);
  setText(sundayPrice, `${selectedRate.sunday_cost}`);
  setText(publicPrice, `${selectedRate.public_holiday_cost}`);
  setText(travelPrice, `${data.kms.rate} ${data.kms.units}`);
  setText(totalPrice, `${selectedRate['baserate_(weekday)_cost']}`);
  setText(sleepOver, `${data.sleepovers.rate} ${data.sleepovers.units}`);
}

// --- MODIFIED INITIALIZE FUNCTION ---
async function initialize() {
  let textData = localStorage.getItem('pricingData');
  if (!textData) {
    console.error("No pricing data found in localStorage. Call updatePricingData first.");
    return;
  }

  let data;
  try {
    // Clean potential non-printable characters before parsing
    const cleanedTextData = textData.replace(/[^\x20-\x7E]/g, '');
    data = JSON.parse(cleanedTextData);
  } catch (parseError) {
    console.error("Error parsing JSON from localStorage:", parseError);
    return;
  }

  const hourlyRates = data.response?.hourly_rates?.rates;
  if (!hourlyRates || hourlyRates.length === 0) {
    console.error("Data structure is not as expected or no rates found.");
    return;
  }

  // ✅ THIS IS THE KEY: Set slider max and Lottie values from the fetched data
  const dynamicTotalValues = hourlyRates.length - 1;
  rangeSlider.max = dynamicTotalValues;
  rangeSlider.value = 0;
  totalValues = dynamicTotalValues

  // Now, initialize the Lottie animation with the correct number of steps
  // setupLottieSlider(dynamicTotalValues);

  // Initial price update for the default slider value (0)
  updatePrices(data.response, rangeSlider.value);

  // Add event listener for slider change to update prices
  rangeSlider.addEventListener('input', function () {
    updatePrices(data.response, this.value);
  });

  // ScrollTrigger to update the slider's value on screen view
  ScrollTrigger.create({
    trigger: $('.participant_cards-wrap'),
    start: 'top 50%',
    once: true,
    onEnter: () => {
      setTimeout(function () {
        rangeSlider.value = 7; // Or any other desired value
        rangeSlider.dispatchEvent(
          updateSliderEvent); // This triggers updateSlider via the event listener
        updatePrices(data.response, rangeSlider.value); // Also update prices directly
      }, 200)
    },
  });
}

// --- DATA MANAGEMENT & SCRIPT EXECUTION ---
async function updatePricingData() {
  const dataFetched = await fetchPricingData();
  if (dataFetched) {
    localStorage.setItem('pricingData', dataFetched);
    localStorage.setItem('Date', new Date().toISOString());
    initialize(); // Initialize after fetching new data
  }
}

function handlePricingData() {
  const pricingData = localStorage.getItem('pricingData');
  const storedDateStr = localStorage.getItem('Date');

  if (pricingData && storedDateStr) {
    const storedDate = new Date(storedDateStr);
    const today = new Date();
    const diffTime = Math.abs(today - storedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 7) {
      console.log("Data is older than 7 days. Fetching new data...");
      updatePricingData();
    } else {
      console.log("Using fresh data from localStorage.");
      initialize(); // Initialize with existing data
    }
  } else {
    console.log("No data found in localStorage. Fetching new data...");
    updatePricingData(); // Fetch data for the first time
  }
}

// Event listener for the cookie consent button
const cookieButton = document.querySelector('.fs-consent_allow.w-button');
cookieButton?.addEventListener('click', handlePricingData);

// Also run the check in case cookies were already allowed
handlePricingData();
