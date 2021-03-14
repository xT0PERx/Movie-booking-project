const choiceSeatsWrapper = document.getElementById("tickets_wrapper");
const seatsInCinema = document.querySelector("#cinemaHall");
const main = document.querySelector("body");
const calendar = document.querySelector(".calendar");
const filmName = "Monster Hunter";
const priceOfTicket = 8;
const futureDate = new Date();

init();

function init() {
  addDomElement(choiceSeatsWrapper);
}

////////////////////////////////// getting information about the days of the month   //////////////

const daysOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function tellsWhatDay(date) {
  let dayOfWeek = daysOfWeek[date.getDay()];
  return dayOfWeek;
}

function tellsWhatDate(date) {
  let dayOfMonth = date.getDate();
  return dayOfMonth;
}

function createDate(date, number) {
  let myDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getDay()
  );

  let numberDay = myDate.getDate() + number;
  myDate.setDate(numberDay);

  return myDate;
}

function tellsHowManyDaysInMonth(date) {
  const futureMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const howManyDay = Math.round((nextMonth - futureMonth) / 1000 / 3600 / 24);

  return howManyDay;
}

function createMonth(date) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < tellsHowManyDaysInMonth(date); i++) {
    let li = document.createElement("li");
    li.classList.add("calendar_item");
    li.innerHTML = `<a href="#" class="calendar_item_link">
         <span>${tellsWhatDay(createDate(date, i))}
           <br>${tellsWhatDate(createDate(date, i))}
         </span>
                </a>`;
    fragment.append(li);
  }
  return fragment;
}

function addCalendar(item, fragment) {
  item.append(fragment);
}

addCalendar(calendar, createMonth(futureDate));

/////////////////////////////////////////////////////////////////////////////////////////////////////

function createWrapperForChosenTickets() {
  return `  <div id="seatsChoice" class="seats_choice">
      <ul id="selectionsBuying" class="seats_choice_list"></ul>
      <input
        id="buyTickets"
        class="seats_choice_list_input"
        type="radio"
        value=""
      />
      <label for="buyTickets" class="seats_choice_list_label"
        >BUY SELECTED</label
      >
    </div>`;
}

function addDomElement(element) {
  element.insertAdjacentHTML("beforeEnd", createWrapperForChosenTickets());
}

function createTicket(seatNumber) {
  return ` <li data-ticket = ${seatNumber} class="seats_choice_list_ticket">
              <h4>${filmName}</h4>
              <span>${seatNumber}</span>
            </li>`;
}

function addedTicket(ticketsList, chosenSeat) {
  ticketsList.insertAdjacentHTML("beforeEnd", createTicket(chosenSeat));
}

function tellsWhatSeatChosen(ticketsList, seat) {
  const basket = ticketsList.children;
  let chosen = null;
  for (let i = 0; i < basket.length; i++) {
    if (basket[i].dataset.ticket === seat.value) {
      chosen = basket[i];
    }
  }
  return chosen;
}

function deleteTicket(ticketsList, chosenSeat) {
  ticketsList.removeChild(chosenSeat);
}

const ticketMovement = {
  true: (ticketsList, ticket) => addedTicket(ticketsList, ticket.value),
  false: (ticketsList, ticket) =>
    deleteTicket(ticketsList, tellsWhatSeatChosen(ticketsList, ticket)),
};

const chosenTicketsList = document.querySelector("#selectionsBuying");
const buyButton = document.querySelector(".seats_choice_list_label");

const visible = {
  true: (item) => (item.style.display = "block"),
  false: (item) => (item.style.display = "none"),
};

seatsInCinema.addEventListener("change", function ({ target }) {
  ticketMovement[target.checked](chosenTicketsList, target);
  visible[!!countsNumberOfSelectedTickets(chosenTicketsList)](buyButton);

  if (target.name === "buyButton") {
    answerAfterSelection[target.id](main);
  }
});

const ticketListWrapper = document.querySelector("#seatsChoice");

ticketListWrapper.addEventListener("change", function ({ target }) {
  visible[false](ticketListWrapper);
  addBuyingMessage(seatsInCinema);
});

function freesUpSpace(item) {
  item.innerHTML = null;
  item.style.display = "block";
}

function createConformingBuyMessage(count, price) {
  return `    <div id="basket" class="basket">
      <span>
        You buy ${count} ticket for ${price} $
      </span>
      <h4>Do you wont to continue?</h4>
      <input id="yes" name="buyButton" type="radio" value="" />
      <label for="yes" class="basket_btn">Yes</label>
      <input id="no" name="buyButton" type="radio" value="" />
      <label for="no" class="basket_btn">No</label>
    </div>`;
}

function addBuyingMessage(placeWhereAdd) {
  freesUpSpace(placeWhereAdd);
  placeWhereAdd.insertAdjacentHTML(
    "beforeEnd",
    createConformingBuyMessage(
      countsNumberOfSelectedTickets(chosenTicketsList),
      calculatesCostOfTickets(
        countsNumberOfSelectedTickets(chosenTicketsList),
        priceOfTicket
      )
    )
  );
}

function countsNumberOfSelectedTickets(ticketList) {
  let numberOfTickets = ticketList.children.length;
  return numberOfTickets;
}

function calculatesCostOfTickets(amount, price) {
  const priceForChosenTickets = amount * price;
  return priceForChosenTickets;
}

/////////////////////////////// confirming buying ticket(s)

function viewMassage(place, massage) {
  place.insertAdjacentHTML("afterBegin", massage);
}

function createConformBuyMassage() {
  return `<div class="message_wrapper">
  <span>Thank for buying,wait confirming message</span>
</div>`;
}

function createAbortMessage() {
  return `<div class="message_wrapper">
  <span>Thank for visiting our site, please come back next time </span>
</div>`;
}

const answerAfterSelection = {
  yes: (place) => viewMassage(place, createConformBuyMassage()),
  no: (place) => viewMassage(place, createAbortMessage()),
};

///////////////////////////////////////////////////////////////////////////////////////////////////
