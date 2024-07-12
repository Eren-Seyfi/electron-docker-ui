document.addEventListener("DOMContentLoaded", async () => {
  const results = await window.electron.invoke("docker");
  displayResults(results);
});

const search = document.getElementById("search");
const cardContent = document.getElementById("card-content");

search.addEventListener("input", async function (event) {
  const searchParams = event.target.value;
  const results = await window.electron.invoke("search", searchParams);
  displayResults(results);
});

function displayResults(results) {
  cardContent.innerHTML = "";

  results.forEach((result) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "16rem";
    card.innerHTML = `
      <img
        src="${result.logo_url.large || "https://placehold.co/100"}"
        class="card-img-top"
        style="
          object-fit: scale-down;
          object-position: center;
        "
        alt="..."
      />
      <div class="card-body">
        <h5 class="card-title">${result.name}</h5>
        <p class="card-text">
          ${result.short_description}
        </p>
        <button onclick="download('${
          result.slug
        }')" type="button" class="btn btn-outline-success">
          <i class="bi bi-cloud-arrow-down-fill"></i>
        </button>
      </div>
    `;
    cardContent.appendChild(card);
  });
}

async function download(slug) {
  const result = await window.electron.invoke("download", slug);
  if ((result.message = "success")) {
    alert("Docker görüntüsü başarıyla indirildi.");
  } else {
    alert("Docker görüntüsü indirilirken hata oluştu.");
  }
}
