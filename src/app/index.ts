const App = `
  <main>
    <header class="header">
      <h1 class="header__title">IP Address Tracker</h1>
      <form role="search" class="header__search">
        <input
          autofocus
          type="search"
          name="search"
          autocomplete="off"
          class="header__search__input"
          aria-label="Search for any IP address or domain"
          placeholder="Search for any IP address or domain"
        />
        <button type="submit" class="header__search__submit">
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="11" height="14"><path fill="none" stroke="#FFF" stroke-width="3" d="M2 1l6 6-6 6"/></svg>
        </button>
      </form>
      <ul class="header__info">
        <li class="loader" aria-label="Loading"></li>
      </ul>
    </header>
    <section aria-label="Map of the location" class="map" id="map">
      <div aria-label="Loading" class="loader"></div>
    </section>
  </main>
`;

export default App;
