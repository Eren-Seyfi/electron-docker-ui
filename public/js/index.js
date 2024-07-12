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
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${result.name}</h5>
      <p class="card-text">
        ${result.description}
      </p>
      <div class="d-flex justify-content-between w-100">
        <button onclick="download('${
          result.slug
        }')" type="button" class="btn btn-outline-primary">
          <i class="bi bi-cloud-arrow-down-fill"></i>
        </button>
        ${
          result.is_official
            ? '<a type="button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top" class="btn btn-success"><i class="bi bi-check-circle-fill"></i></a>'
            : ""
        }
        ${
          result.source == "verified_publisher"
            ? '<button type="button" class="btn btn-success"><i class="bi bi-patch-check-fill"></i></i></button>'
            : ""
        }

        
      </div>
    </div>
  `;
    cardContent.appendChild(card);
  });
}

async function download(slug) {
  const result = await window.electron.invoke("download", slug);
  console.log(result.message);
  if ((result.message = "unsuccess")) {
    alert("Docker görüntüsü indirilirken hata oluştu.");
  } else {
    alert("Docker görüntüsü başarıyla indirildi.");
  }
}
