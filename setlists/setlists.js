window.liveData = window.liveData || [];

/*
  ライブツアー形式のデータを登録する
*/
function addLiveTour(
  artist,
  year,
  liveTitle,
  performances
) {
  window.liveData.push({
    artist,
    year: String(year),
    liveTitle,
    performances: Array.isArray(performances)
      ? performances
      : []
  });
}

/*
  別のJSファイルからも確実に呼び出せるようにする
*/
window.addLiveTour = addLiveTour;


let currentLiveArtist = "浦島坂田船";
let currentLiveYear = "";


/*
  HTMLの読み込みが完了してから一覧を作成する
*/
document.addEventListener("DOMContentLoaded", () => {
  setupArtistTabs();
  renderYearTabs();
});


/*
  アーティスト切り替えタブを設定する
*/
function setupArtistTabs() {
  const artistTabs =
    document.querySelectorAll(".live-artist-tab");

  artistTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      artistTabs.forEach(item => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      currentLiveArtist =
        tab.dataset.artist || "浦島坂田船";

      currentLiveYear = "";

      renderYearTabs();
    });
  });
}


/*
  選択中のアーティストに登録されている年を表示する
*/
function renderYearTabs() {
  const yearTabs =
    document.getElementById("year-tabs");

  const liveTitleList =
    document.getElementById("live-title-list");

  if (!yearTabs) {
    console.error(
      "year-tabs が見つかりません。"
    );
    return;
  }

  if (!liveTitleList) {
    console.error(
      "live-title-list が見つかりません。"
    );
    return;
  }

  yearTabs.innerHTML = "";

  const artistData = window.liveData.filter(
    live =>
      live.artist === currentLiveArtist
  );

  const years = [
    ...new Set(
      artistData.map(live => String(live.year))
    )
  ].sort(
    (a, b) => Number(b) - Number(a)
  );

  if (years.length === 0) {
    currentLiveYear = "";

    liveTitleList.innerHTML =
      "<p>登録されているセトリはありません。</p>";

    return;
  }

  /*
    最初は一番新しい年を選択する
  */
  if (
    !currentLiveYear ||
    !years.includes(currentLiveYear)
  ) {
    currentLiveYear = years[0];
  }

  years.forEach(year => {
    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "year-tab";
    button.textContent = year;

    if (year === currentLiveYear) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentLiveYear = year;

      yearTabs
        .querySelectorAll(".year-tab")
        .forEach(tab => {
          tab.classList.remove("active");
        });

      button.classList.add("active");

      renderLiveTitles();
    });

    yearTabs.appendChild(button);
  });

  renderLiveTitles();
}


/*
  選択したアーティストと年に該当する
  ライブタイトルを表示する
*/
function renderLiveTitles() {
  const container =
    document.getElementById("live-title-list");

  if (!container) {
    console.error(
      "live-title-list が見つかりません。"
    );
    return;
  }

  container.innerHTML = "";

  const selectedLives = window.liveData.filter(
    live =>
      live.artist === currentLiveArtist &&
      String(live.year) === currentLiveYear
  );

  if (selectedLives.length === 0) {
    container.innerHTML =
      "<p>この年のセトリは登録されていません。</p>";

    return;
  }

  selectedLives.forEach(live => {
    const liveBlock =
      document.createElement("section");

    liveBlock.className = "tour-block";

    /*
      ライブタイトルを開閉するボタン
    */
    const titleButton =
      document.createElement("button");

    titleButton.type = "button";
    titleButton.className =
      "tour-title-button";

    const titleText =
      document.createElement("span");

    titleText.textContent =
      live.liveTitle || "タイトル未設定";

    const arrow =
      document.createElement("span");

    arrow.className = "accordion-arrow";
    arrow.textContent = "▼";

    titleButton.appendChild(titleText);
    titleButton.appendChild(arrow);

    /*
      公演一覧を入れる場所
    */
    const performanceList =
      document.createElement("div");

    performanceList.className =
      "performance-list hidden";

    const performances =
      Array.isArray(live.performances)
        ? live.performances
        : [];

    if (performances.length === 0) {
      const message =
        document.createElement("p");

      message.textContent =
        "このライブの公演データはありません。";

      performanceList.appendChild(message);
    }

    performances.forEach(performance => {
      performanceList.appendChild(
        createPerformanceBlock(performance)
      );
    });

    titleButton.addEventListener("click", () => {
      titleButton.classList.toggle("open");
      performanceList.classList.toggle("hidden");
    });

    liveBlock.appendChild(titleButton);
    liveBlock.appendChild(performanceList);
    container.appendChild(liveBlock);
  });
}


/*
  公演日・会場・曲一覧を表示するブロックを作る
*/
function createPerformanceBlock(performance) {
  const performanceBlock =
    document.createElement("article");

  performanceBlock.className =
    "performance-block";

  /*
    公演情報を開閉するボタン
  */
  const performanceButton =
    document.createElement("button");

  performanceButton.type = "button";
  performanceButton.className =
    "performance-button";

  const performanceTitle =
    document.createElement("span");

  /*
    日付と会場を表示
  */
  const performanceInfo = [
    performance?.date,
    performance?.place
  ]
    .filter(Boolean)
    .join("　");

  performanceTitle.textContent =
    performanceInfo || "セットリスト";

  const arrow =
    document.createElement("span");

  arrow.className = "accordion-arrow";
  arrow.textContent = "▼";

  performanceButton.appendChild(
    performanceTitle
  );

  performanceButton.appendChild(
    arrow
  );

  /*
    曲一覧
  */
  const setlistArea =
    document.createElement("div");

  setlistArea.className =
    "performance-setlist hidden";

  const songs =
    Array.isArray(performance?.songs)
      ? performance.songs
      : [];

  if (songs.length === 0) {
    const message =
      document.createElement("p");

    message.textContent =
      "曲目は登録されていません。";

    setlistArea.appendChild(message);
  } else {
    const songList =
      document.createElement("ol");

    songList.className =
      "performance-song-list";

    songs.forEach(song => {
      const item =
        document.createElement("li");

      /*
        song が
        [曲名, 注記, 読み]
        の形式
      */
      const songName =
        Array.isArray(song)
          ? song[0] || ""
          : String(song || "");

      const songNote =
        Array.isArray(song)
          ? song[1] || ""
          : "";

      const name =
        document.createElement("span");

      name.className =
        "performance-song-name";

      name.textContent =
        songName || "曲名未設定";

      item.appendChild(name);

      if (songNote) {
        const note =
          document.createElement("span");

        note.className =
          "performance-song-note";

        note.textContent =
          songNote;

        item.appendChild(note);
      }

      songList.appendChild(item);
    });

    setlistArea.appendChild(songList);
  }

  performanceButton.addEventListener(
    "click",
    () => {
      performanceButton.classList.toggle(
        "open"
      );

      setlistArea.classList.toggle(
        "hidden"
      );
    }
  );

  performanceBlock.appendChild(
    performanceButton
  );

  performanceBlock.appendChild(
    setlistArea
  );

  return performanceBlock;
}
