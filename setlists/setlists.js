window.liveData = window.liveData || [];

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
    performances
  });
}



let currentLiveArtist = "浦島坂田船";
let currentLiveYear = "";

document.addEventListener("DOMContentLoaded", () => {
  setupArtistTabs();
  renderYearTabs();
});


function setupArtistTabs() {
  const artistTabs =
    document.querySelectorAll(".live-artist-tab");

  artistTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      artistTabs.forEach(item => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      currentLiveArtist = tab.dataset.artist;
      currentLiveYear = "";

      renderYearTabs();
    });
  });
}


function renderYearTabs() {
  const yearTabs = document.getElementById("year-tabs");

  yearTabs.innerHTML = "";

  const artistData = window.liveData.filter(
    live => live.artist === currentLiveArtist
  );

  const years = [
    ...new Set(
      artistData.map(live => live.year)
    )
  ].sort((a, b) => Number(b) - Number(a));

  if (years.length === 0) {
    document.getElementById("live-title-list").innerHTML =
      "<p>登録されているセトリはありません。</p>";

    return;
  }

  if (
    !currentLiveYear ||
    !years.includes(currentLiveYear)
  ) {
    currentLiveYear = years[0];
  }

  years.forEach(year => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "year-tab";
    button.textContent = year;

    if (year === currentLiveYear) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentLiveYear = year;

      document
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



function renderLiveTitles() {
  const container =
    document.getElementById("live-title-list");

  container.innerHTML = "";

  const selectedLives = window.liveData.filter(
    live =>
      live.artist === currentLiveArtist &&
      live.year === currentLiveYear
  );

  if (selectedLives.length === 0) {
    container.innerHTML =
      "<p>この年のセトリは登録されていません。</p>";

    return;
  }

  selectedLives.forEach(live => {
    const liveBlock = document.createElement("section");
    liveBlock.className = "tour-block";

    const titleButton = document.createElement("button");
    titleButton.type = "button";
    titleButton.className = "tour-title-button";

    const titleText = document.createElement("span");
    titleText.textContent = live.liveTitle;

    const arrow = document.createElement("span");
    arrow.className = "accordion-arrow";
    arrow.textContent = "▼";

    titleButton.appendChild(titleText);
    titleButton.appendChild(arrow);

    const performanceList =
      document.createElement("div");

    performanceList.className =
      "performance-list hidden";

    live.performances.forEach(performance => {
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


function createPerformanceBlock(performance) {
  const performanceBlock =
    document.createElement("article");

  performanceBlock.className = "performance-block";

  const performanceButton =
    document.createElement("button");

  performanceButton.type = "button";
  performanceButton.className =
    "performance-button";

  const performanceTitle =
    document.createElement("span");

  performanceTitle.textContent =
    `${performance.date}　${performance.place}`;

  const arrow = document.createElement("span");
  arrow.className = "accordion-arrow";
  arrow.textContent = "▼";

  performanceButton.appendChild(performanceTitle);
  performanceButton.appendChild(arrow);

  const setlistArea = document.createElement("div");
  setlistArea.className = "performance-setlist hidden";

  const songList = document.createElement("ol");
  songList.className = "performance-song-list";

  performance.songs.forEach(song => {
    const item = document.createElement("li");

    const songName = song[0] || "";
    const songNote = song[1] || "";

    const name = document.createElement("span");
    name.className = "performance-song-name";
    name.textContent = songName;

    item.appendChild(name);

    if (songNote) {
      const note = document.createElement("span");
      note.className = "performance-song-note";
      note.textContent = songNote;

      item.appendChild(note);
    }

    songList.appendChild(item);
  });

  setlistArea.appendChild(songList);

  performanceButton.addEventListener("click", () => {
    performanceButton.classList.toggle("open");
    setlistArea.classList.toggle("hidden");
  });

  performanceBlock.appendChild(performanceButton);
  performanceBlock.appendChild(setlistArea);

  return performanceBlock;
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

      document
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
      live.year === currentLiveYear
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

    /*
      performancesが配列でない場合でも
      エラーで停止しないようにする
    */
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
    日付と会場のうち、
    入力されているものだけを表示する
  */
  const performanceInfo = [
    performance?.date,
    performance?.place
  ]
    .filter(Boolean)
    .join("　");

  /*
    addSetlist形式で日付と会場がない場合は
    「セットリスト」と表示する
  */
  performanceTitle.textContent =
    performanceInfo || "セットリスト";

  const arrow =
    document.createElement("span");

  arrow.className = "accordion-arrow";
  arrow.textContent = "▼";

  performanceButton.appendChild(
    performanceTitle
  );

  performanceButton.appendChild(arrow);

  /*
    曲一覧を入れる場所
  */
  const setlistArea =
    document.createElement("div");

  setlistArea.className =
    "performance-setlist hidden";

  const songList =
    document.createElement("ol");

  songList.className =
    "performance-song-list";

  /*
    songsが配列でない場合でも
    エラーで停止しないようにする
  */
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
  }

  songs.forEach(song => {
    const item =
      document.createElement("li");

    /*
      曲データが配列の場合
      [曲名, 歌唱者・注記, 読み方]
      として読み取る
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

    /*
      歌唱者や注記がある場合のみ表示する
    */
    if (songNote) {
      const note =
        document.createElement("span");

      note.className =
        "performance-song-note";

      note.textContent = songNote;

      item.appendChild(note);
    }

    songList.appendChild(item);
  });

  if (songs.length > 0) {
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
