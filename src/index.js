const fetchData = async () => {
  const response = await fetch("../data.json");
  return response.json();
};

const formatTitles = (title) => {
  return title.toLowerCase().replace(" ", "-");
};

// Create cards
const createOneCard = async ({ title, current, previous }) => {
  const card = document.createElement("article");
  card.classList.add("card", `background-${formatTitles(title)}`);

  const cardImageWrapper = document.createElement("div");
  cardImageWrapper.classList.add(
    "card-image-wrapper",
    `background-${formatTitles(title)}`
  );

  const cardImage = document.createElement("img");
  cardImage.src = `../images/icon-${formatTitles(title)}.svg`;
  cardImage.alt = `${title} icon`;

  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");

  const cardContentTitle = document.createElement("div");
  cardContentTitle.classList.add("card-content-title");

  const cardTitle = document.createElement("h2");
  cardTitle.textContent = `${title}`;

  const cardControls = document.createElement("button");
  cardControls.setAttribute("aria-label", "More actions");
  const cardControlsIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  const cardControlsIconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  cardControlsIcon.setAttribute("width", "21px");
  cardControlsIcon.setAttribute("height", "5px");
  cardControlsIconPath.setAttribute(
    "d",
    "M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
  );
  cardControlsIconPath.setAttribute("fill", "#BBC0FF");
  cardControlsIconPath.setAttribute("fill-rule", "evenodd");

  cardControlsIcon.appendChild(cardControlsIconPath);
  cardControls.appendChild(cardControlsIcon);

  const cardContentNumbers = document.createElement("div");
  cardContentNumbers.classList.add("card-content-numbers");

  const cardContentNumbersCurrent = document.createElement("p");
  cardContentNumbersCurrent.textContent = `${current}hrs`;
  const cardContentNumbersPrevious = document.createElement("p");
  cardContentNumbersPrevious.textContent = `Last Week - ${previous}hrs`;

  // From bottom to top
  cardContentNumbers.appendChild(cardContentNumbersCurrent);
  cardContentNumbers.appendChild(cardContentNumbersPrevious);

  cardContentTitle.appendChild(cardTitle);
  cardContentTitle.appendChild(cardControls);

  cardContent.appendChild(cardContentTitle);
  cardContent.appendChild(cardContentNumbers);

  cardImageWrapper.appendChild(cardImage);

  card.appendChild(cardImageWrapper);
  card.appendChild(cardContent);

  const cardsContainer = document.querySelector(".dashboard-cards");
  cardsContainer.appendChild(card);
};

const createCards = (preparedData) => {
  for (let i = 0; i < preparedData.length; i++) {
    createOneCard(preparedData[i]);
  }
};

// Create an array of objects for requested time value
const gatherTimeData = (timeValue, jsonData) => {
  const preparedData = [];

  for (let i = 0; i < jsonData.length; i++) {
    const item = {};

    item.title = jsonData[i].title;
    item.current = jsonData[i].timeframes[timeValue].current;
    item.previous = jsonData[i].timeframes[timeValue].previous;

    preparedData.push(item);
  }

  return preparedData;
};

// Clean up for DOM updates
const showActiveTab = (newSelectedTab) => {
  const allTimesTabs = document.querySelectorAll("[data-timevalue]");
  allTimesTabs.forEach((tab) => {
    tab.classList.remove("selected");
  });

  const selectedTab = document.querySelector(
    `[data-timevalue="${newSelectedTab}"]`
  );
  selectedTab.classList.add("selected");
};

const clearExistingCards = (cssSelector) => {
  const cardsContainer = document.querySelector(cssSelector);

  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.lastChild);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  let preparedData;
  const data = await fetchData();
  preparedData = gatherTimeData("daily", data);
  createCards(preparedData);

  const dailyTimeLink = document.querySelector('[data-timevalue="daily"]');
  dailyTimeLink.classList.add("selected");

  const allTimes = document.querySelectorAll("[data-timevalue]");
  allTimes.forEach((timeLink) => {
    timeLink.addEventListener("click", (event) => {
      clearExistingCards(".dashboard-cards");
      preparedData = gatherTimeData(event.target.dataset.timevalue, data);
      createCards(preparedData);
      showActiveTab(event.target.dataset.timevalue);
    });
  });
});
