const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const trackDetailDiv = document.querySelector("#track-detail");

  // Get track ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const trackId = urlParams.get("id");

  if (!trackId) {
    trackDetailDiv.innerHTML = `
      <div class="track-error">
        <h2>Trilha não encontrada</h2>
        <p>Nenhum ID de trilha foi fornecido.</p>
        <a href="index.html" class="primary-btn">Voltar para Trilhas</a>
      </div>
    `;
    return;
  }

  loadTrackDetails(trackId);

  async function loadTrackDetails(id) {
    try {
      const response = await fetch(`${API_URL}/tracks/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Trilha não encontrada");
        }
        throw new Error("Erro ao carregar detalhes da trilha");
      }

      const track = await response.json();
      displayTrackDetails(track);
    } catch (error) {
      console.error("Erro ao carregar trilha:", error);
      trackDetailDiv.innerHTML = `
        <div class="track-error">
          <h2>Erro ao carregar trilha</h2>
          <p>${error.message}</p>
          <a href="index.html" class="primary-btn">Voltar para Trilhas</a>
        </div>
      `;
    }
  }

  function displayTrackDetails(track) {
    // Parse description to extract objective and notes if present
    let description = track.description || "Sem descrição disponível.";
    let objective = "";
    let notes = "";

    if (description.includes("Objetivo:")) {
      const parts = description.split("Objetivo:");
      description = parts[0].trim();
      const objectivePart = parts[1];

      if (objectivePart.includes("Notas:")) {
        const noteParts = objectivePart.split("Notas:");
        objective = noteParts[0].trim();
        notes = noteParts[1].trim();
      } else {
        objective = objectivePart.trim();
      }
    }

    trackDetailDiv.innerHTML = `
      <div class="track-header">
        <h2>${track.name}</h2>
        <span class="track-id">ID: ${track.id}</span>
      </div>

      <div class="track-content">
        <div class="track-section">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Descrição
          </h3>
          <p>${description || "Sem descrição disponível."}</p>
        </div>

        ${objective ? `
        <div class="track-section">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
            Objetivo Principal
          </h3>
          <p>${objective}</p>
        </div>
        ` : ""}

        ${notes ? `
        <div class="track-section">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Notas
          </h3>
          <p>${notes}</p>
        </div>
        ` : ""}

        ${track.student_id ? `
        <div class="track-section">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Aluno Associado
          </h3>
          <p>ID do Aluno: ${track.student_id}</p>
        </div>
        ` : ""}
      </div>

    `;

    // Update page title
    document.title = `Conecte Saúde - ${track.name}`;
  }
});

