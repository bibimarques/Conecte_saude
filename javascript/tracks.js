const API_URL = "http://127.0.0.1:8000";

// Mostra notificação na tela
function showNotification(message, type = "success") {
  // Remove notificação existente
  const existingNotification = document.querySelector(".settings-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `settings-notification ${type}`;
  notification.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === "success" 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
      }
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  // Remove após 3 segundos
  setTimeout(() => {
    notification.classList.add("hide");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const qs = (s) => document.querySelector(s);

  const tracksList = qs("#tracks-list");

  // ==================== LIST TRACKS ====================
  async function loadTracks() {
    if (!tracksList) return;

    tracksList.innerHTML = "<p>Carregando trilhas...</p>";

    try {
      const response = await fetch(`${API_URL}/tracks/`);
      if (!response.ok) {
        throw new Error("Erro ao carregar trilhas");
      }

      const tracks = await response.json();

      tracksList.innerHTML = "";

      if (!tracks || tracks.length === 0) {
        tracksList.innerHTML = "<p>Nenhuma trilha cadastrada ainda.</p>";
        return;
      }

      tracks.forEach((track) => {
        const card = document.createElement("div");
        card.className = "card-track";
        card.dataset.id = track.id;
        card.innerHTML = `
          <h3>${track.name}</h3>
          <p>${track.description || "Sem descrição"}</p>
          <div class="card-buttons">
            <button class="btn-track">Ver Trilha</button>
            <button class="btn-delete-track" data-id="${track.id}">Excluir</button>
          </div>
        `;

        card.querySelector(".btn-track").addEventListener("click", () => {
          window.location.href = `view_track.html?id=${track.id}`;
        });

        card.querySelector(".btn-delete-track").addEventListener("click", async (e) => {
          const id = Number(e.target.dataset.id);
          if (confirm(`Tem certeza que deseja excluir a trilha "${track.name}"?`)) {
            await deleteTrack(id);
          }
        });

        tracksList.appendChild(card);
      });
    } catch (error) {
      console.error("Erro ao carregar trilhas:", error);
      tracksList.innerHTML =
        "<p>Erro ao carregar trilhas. Verifique se o servidor está rodando.</p>";
    }
  }

  // ==================== DELETE TRACK ====================
  async function deleteTrack(id) {
    try {
      const response = await fetch(`${API_URL}/tracks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir trilha");
      }

      showNotification("Trilha excluída com sucesso!", "success");
      loadTracks();
    } catch (error) {
      console.error("Erro ao excluir trilha:", error);
      showNotification("Erro ao excluir trilha. Tente novamente.", "error");
    }
  }

  // ==================== REGISTER TRACK ====================
  const registerTrackForm = qs("#form-register-track");

  if (registerTrackForm) {
    registerTrackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = qs("#track-name").value.trim();
      const description = qs("#track-description").value.trim();
      const objective = qs("#track-objective").value.trim();
      const modules = qs("#track-modules").value.trim();

      // Validations
      if (!name) {
        return showNotification("Por favor, preencha o nome da trilha.", "error");
      }

      // Combine description, objective and modules into a single description
      let fullDescription = description;
      if (objective) {
        fullDescription += `\n\nObjetivo: ${objective}`;
      }
      if (modules) {
        fullDescription += `\n\nNotas: ${modules}`;
      }

      try {
        const response = await fetch(`${API_URL}/tracks/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            description: fullDescription || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao cadastrar trilha");
        }

        showNotification("Trilha cadastrada com sucesso!", "success");
        registerTrackForm.reset();

        // If there's a tracks list on the page, update it
        if (tracksList) {
          loadTracks();
        }
      } catch (error) {
        console.error("Erro ao cadastrar trilha:", error);
        showNotification(error.message || "Erro ao cadastrar trilha. Tente novamente.", "error");
      }
    });
  }

  // Load tracks list if element exists
  if (tracksList) {
    loadTracks();
  }
});
