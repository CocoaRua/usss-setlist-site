const data = [];

function addSetlist(artist, year, liveName, songs) {
  songs.forEach(item => {
    data.push({
      artist,
      song: item[0],
      note: item[1],
      alias: item[2] || "",
      live: liveName,
      year
    });
  });
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[ぁ-ん]/g, s =>
      String.fromCharCode(s.charCodeAt(0) + 0x60)
    )
    .replace(/ー/g, "")
    .replace(/\s+/g, "");
}

window.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");
  const suggest = document.getElementById("suggest");
  const result = document.getElementById("result");
  const searchBtn = document.getElementById("searchBtn");
  const tabs = document.querySelectorAll(".artist-tab");

  let selectedIndex = -1;
  let currentArtist = "浦島坂田船";

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      currentArtist = tab.dataset.artist;
      searchBox.value = "";
      suggest.innerHTML = "";
      result.innerHTML = "";
      selectedIndex = -1;
    });
  });

  function searchSong() {
    const key = normalize(searchBox.value.trim());
    result.innerHTML = "";

    if (!key) return;

    const filtered = data.filter(item =>
      item.artist === currentArtist &&
      (
        normalize(item.song) === key ||
        normalize(item.alias).includes(key)
      )
    );

    if (filtered.length === 0) {
      result.innerHTML = "<li>見つかりませんでした</li>";
      return;
    }

    const grouped = {};

    filtered.forEach(item => {
      const year = item.year || "その他";
      const liveText = item.note
        ? `${item.live}（${item.note}）`
        : item.live;

      if (!grouped[year]) grouped[year] = new Set();
      grouped[year].add(liveText);
    });

    Object.keys(grouped).sort().forEach(year => {
      const yearLi = document.createElement("li");
      yearLi.className = "year-title";
      yearLi.textContent = `[${year}]`;
      result.appendChild(yearLi);

      grouped[year].forEach(live => {
        const liveLi = document.createElement("li");
        liveLi.className = "live-item";
        liveLi.textContent = live;
        result.appendChild(liveLi);
      });
    });
  }

  searchBox.addEventListener("input", () => {
    const keyNorm = normalize(searchBox.value.trim());

    suggest.innerHTML = "";
    selectedIndex = -1;

    if (!keyNorm) return;

    const matches = [];

    data.forEach(item => {
      if (item.artist !== currentArtist) return;

      if (
        normalize(item.song).includes(keyNorm) ||
        normalize(item.alias).includes(keyNorm)
      ) {
        matches.push(item.song);
      }
    });

    [...new Set(matches)].slice(0, 10).forEach(song => {
      const li = document.createElement("li");
      li.textContent = song;

      li.onclick = () => {
        searchBox.value = song;
        suggest.innerHTML = "";
        searchSong();
      };

      suggest.appendChild(li);
    });
  });

  function updateSelection(items) {
    items.forEach(item => item.classList.remove("selected"));

    if (items[selectedIndex]) {
      items[selectedIndex].classList.add("selected");
      items[selectedIndex].scrollIntoView({ block: "nearest" });
    }
  }

  searchBox.addEventListener("keydown", e => {
    const items = suggest.querySelectorAll("li");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length === 0) return;

      selectedIndex =
        selectedIndex < items.length - 1
          ? selectedIndex + 1
          : 0;

      updateSelection(items);
    }

    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length === 0) return;

      selectedIndex =
        selectedIndex > 0
          ? selectedIndex - 1
          : items.length - 1;

      updateSelection(items);
    }

    else if (e.key === "Enter") {
      e.preventDefault();

      if (selectedIndex >= 0 && items[selectedIndex]) {
        searchBox.value = items[selectedIndex].textContent;
      }

      suggest.innerHTML = "";
      searchSong();
    }
  });

  searchBtn.addEventListener("click", searchSong);
});
