const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const qs = (s) => document.querySelector(s);

  // ==================== LISTAR ALUNOS ====================
  const listaAlunosDiv = qs("#students-list");

  async function carregarAlunos() {
    if (!listaAlunosDiv) return;

    listaAlunosDiv.innerHTML = "<h3>Lista de Alunos</h3><p>Carregando...</p>";

    try {
      const response = await fetch(`${API_URL}/students/`);
      if (!response.ok) {
        throw new Error("Erro ao carregar alunos");
      }

      const alunos = await response.json();

      listaAlunosDiv.innerHTML = "<h3>Lista de Alunos</h3>";

      if (!alunos || alunos.length === 0) {
        listaAlunosDiv.innerHTML += "<p>Nenhum aluno cadastrado ainda.</p>";
        return;
      }

      const ul = document.createElement("ul");
      alunos.forEach((a) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="student-info">
            <span>${a.name}</span>
            <p>${a.email}</p>
          </div>
          <button class="btn-delete-student" data-id="${a.id}">Excluir</button>
        `;
        ul.appendChild(li);
      });
      listaAlunosDiv.appendChild(ul);

      // Adicionar eventos de exclusão
      listaAlunosDiv.querySelectorAll(".btn-delete-student").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = Number(e.target.dataset.id);
          const nome = e.target.closest("li").querySelector("span").textContent;
          if (confirm(`Tem certeza que deseja excluir o aluno "${nome}"?`)) {
            await excluirAluno(id);
          }
        });
      });
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      listaAlunosDiv.innerHTML =
        "<h3>Lista de Alunos</h3><p>Erro ao carregar alunos. Verifique se o servidor está rodando.</p>";
    }
  }

  async function excluirAluno(id) {
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir aluno");
      }

      alert("Aluno excluído com sucesso!");
      carregarAlunos();
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      alert("Erro ao excluir aluno. Tente novamente.");
    }
  }

  // ==================== CADASTRAR ALUNO ====================
  const formCadastroAluno = qs("#form-register-student");

  if (formCadastroAluno) {
    formCadastroAluno.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = qs("#student-name").value.trim();
      const email = qs("#student-email").value.trim();
      const senha = qs("#student-password").value;

      // Validações
      if (!nome || !email || !senha) {
        return alert("Por favor, preencha todos os campos obrigatórios.");
      }

      if (senha.length < 6) {
        return alert("Senha deve ter no mínimo 6 caracteres.");
      }

      try {
        const response = await fetch(`${API_URL}/students/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nome,
            email: email,
            password: senha,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao cadastrar aluno");
        }

        alert("Aluno cadastrado com sucesso!");
        formCadastroAluno.reset();

        // Se houver lista de alunos na página, atualiza
        if (listaAlunosDiv) {
          carregarAlunos();
        }
      } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        alert(error.message || "Erro ao cadastrar aluno. Tente novamente.");
      }
    });
  }

  // Carregar lista de alunos se o elemento existir
  if (listaAlunosDiv) {
    carregarAlunos();
  }
});
