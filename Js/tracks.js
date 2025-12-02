const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const qs = (s) => document.querySelector(s);

  const listaTrilhasDiv = qs("#tracks-list");

  // ==================== LISTAR TRILHAS ====================
  async function carregarTrilhas() {
    if (!listaTrilhasDiv) return;

    listaTrilhasDiv.innerHTML = "<p>Carregando trilhas...</p>";

    try {
      const response = await fetch(`${API_URL}/tracks/`);
      if (!response.ok) {
        throw new Error("Erro ao carregar trilhas");
      }

      const trilhas = await response.json();

      listaTrilhasDiv.innerHTML = "";

      if (!trilhas || trilhas.length === 0) {
        listaTrilhasDiv.innerHTML = "<p>Nenhuma trilha cadastrada ainda.</p>";
        return;
      }

      trilhas.forEach((t) => {
        const card = document.createElement("div");
        card.className = "card-track";
        card.dataset.id = t.id;
        card.innerHTML = `
          <h3>${t.name}</h3>
          <p>${t.description || "Sem descrição"}</p>
          <div class="card-buttons">
            <button class="btn-track">Ver Trilha</button>
            <button class="btn-delete-track" data-id="${t.id}">Excluir</button>
          </div>
        `;

        card.querySelector(".btn-track").addEventListener("click", () => {
          alert(
            `Você selecionou a trilha: ${t.name}. Em breve, uma página de detalhes será implementada!`
          );
        });

        card.querySelector(".btn-delete-track").addEventListener("click", async (e) => {
          const id = Number(e.target.dataset.id);
          if (confirm(`Tem certeza que deseja excluir a trilha "${t.name}"?`)) {
            await excluirTrilha(id);
          }
        });

        listaTrilhasDiv.appendChild(card);
      });
    } catch (error) {
      console.error("Erro ao carregar trilhas:", error);
      listaTrilhasDiv.innerHTML =
        "<p>Erro ao carregar trilhas. Verifique se o servidor está rodando.</p>";
    }
  }

  // ==================== EXCLUIR TRILHA ====================
  async function excluirTrilha(id) {
    try {
      const response = await fetch(`${API_URL}/tracks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir trilha");
      }

      alert("Trilha excluída com sucesso!");
      carregarTrilhas();
    } catch (error) {
      console.error("Erro ao excluir trilha:", error);
      alert("Erro ao excluir trilha. Tente novamente.");
    }
  }

  // ==================== CADASTRAR TRILHA ====================
  const formCadastroTrilha = qs("#form-register-track");

  if (formCadastroTrilha) {
    formCadastroTrilha.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = qs("#track-name").value.trim();
      const descricao = qs("#track-description").value.trim();
      const objetivo = qs("#track-objective").value.trim();
      const modulos = qs("#track-modules").value.trim();

      // Validações
      if (!nome) {
        return alert("Por favor, preencha o nome da trilha.");
      }

      // Combina descrição, objetivo e módulos em uma única descrição
      let descricaoCompleta = descricao;
      if (objetivo) {
        descricaoCompleta += `\n\nObjetivo: ${objetivo}`;
      }
      if (modulos) {
        descricaoCompleta += `\n\nNotas: ${modulos}`;
      }

      try {
        const response = await fetch(`${API_URL}/tracks/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nome,
            description: descricaoCompleta || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao cadastrar trilha");
        }

        alert("Trilha cadastrada com sucesso!");
        formCadastroTrilha.reset();

        // Se houver lista de trilhas na página, atualiza
        if (listaTrilhasDiv) {
          carregarTrilhas();
        }
      } catch (error) {
        console.error("Erro ao cadastrar trilha:", error);
        alert(error.message || "Erro ao cadastrar trilha. Tente novamente.");
      }
    });
  }

  // Carregar lista de trilhas se o elemento existir
  if (listaTrilhasDiv) {
    carregarTrilhas();
  }
});
