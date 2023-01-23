import L, { LatLngExpression, Map } from "leaflet";

export default function () {
  let map: Map;
  const $ = document.querySelector.bind(document);

  const Modal: Modal = {
    data: null,
    ipAddress: "",
    errorMessage: "",
  };

  const Controller = {
    getData: () => Modal.data,
    setData: (val: Data) => (Modal.data = val),
    getIpAddress: () => Modal.ipAddress,
    setIpAddress: (val: string) => (Modal.ipAddress = val),
    getErrorMessage: () => Modal.errorMessage,
    setErrorMessage: (val: string) => (Modal.errorMessage = val),
    init: () => Views.init(),
  };

  const Views = {
    init: function () {
      this.render();
      $(".header__search")!.addEventListener("submit", (e) => {
        e.preventDefault();
        Controller.setErrorMessage("");
        if ($(".leaflet-container")) map.remove();
        $(".map")!.innerHTML = Components.loader("div");
        $(".header__info")!.innerHTML = Components.loader("li");
        Controller.setIpAddress((e.target as HTMLFormElement).search.value);
        this.render();
      });
    },

    render: function () {
      Helpers.fetchData().then(() => {
        const data = Controller.getData() as Data;
        const errorMessage = Controller.getErrorMessage();
        const template = errorMessage
          ? Components.error(errorMessage)
          : Components.slots(data);

        $(".map")!.innerHTML = "";
        $(".header__info")!.innerHTML = template;
        map = L.map("map", {
          center: data.cord,
          zoomControl: false,
          preferCanvas: true,
          attributionControl: false,
        }).setView(data?.cord, 16);

        if (!errorMessage) {
          const icon = L.icon({ iconUrl: "icon-location.svg" });
          L.marker(data.cord, { icon, alt: data.location }).addTo(map);
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
            map
          );
        }
      });
    },
  };

  const Components = {
    loader: (tag: string) =>
      `<${tag} class="loader" aria-label="Loading"></${tag}>`,
    error: (messages: string) => `<li class="error">${messages}</li>`,
    slots: ({ ip, location, timezone, isp }: Data) => `
      <li class="header__info__slot">
        <strong class="header__info__title">IP Address</strong>
        <span class="header__info__value">${ip}</span>
      </li>
      <li class="header__info__slot">
        <strong class="header__info__title">Location</strong>
        <span class="header__info__value">${location}</span>
      </li>
      <li class="header__info__slot">
        <strong class="header__info__title">Timezone</strong>
        <span class="header__info__value">${timezone}</span>
      </li>
      <li class="header__info__slot">
        <strong class="header__info__title">ISP</strong>
        <span class="header__info__value">${isp}</span>
      </li>
    `,
  };

  const Helpers = {
    dataFormat: ({ ip, location, isp }: ResData): Data => ({
      ip,
      isp,
      cord: [location?.lat, location?.lng],
      timezone: `UTC ${location?.timezone}`,
      location: `${location?.region}, ${location?.country}`,
    }),
    fetchData: function () {
      return fetch(
        `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${
          import.meta.env.VITE_GEO_API_KEY
        }&ipAddress=${Controller.getIpAddress()}`
      )
        .then((res) => res.json())
        .then((data: ResData) => {
          data?.code
            ? Controller.setErrorMessage(data.messages)
            : Controller.setData(this.dataFormat(data));
        })
        .catch(() => {
          Controller.setErrorMessage("Something went wrong. Try again.");
        });
    },
  };

  Controller.init();
}

interface Modal {
  data: Data | null;
  ipAddress: string;
  errorMessage: string;
}
type Data = {
  ip: string;
  isp: string;
  location: string;
  timezone: string;
  cord: LatLngExpression;
};
type ResData = {
  ip: string;
  isp: string;
  code: number;
  messages: string;
  location: ResLocation;
};
interface ResLocation extends Data {
  lat: number;
  lng: number;
  region: string;
  country: string;
}
