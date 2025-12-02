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

  // ==================== LISTAR ALUNOS ====================
  const studentsList = qs("#students-list");

  // Guard: AbortController para cancelar requests anteriores
  let studentsAbortController = null;

  async function loadStudents() {
    if (!studentsList) return;

    // Cancela request anterior se ainda estiver em andamento
    if (studentsAbortController) {
      studentsAbortController.abort();
    }
    studentsAbortController = new AbortController();

    studentsList.innerHTML = "<h3>Lista de Alunos</h3><p>Carregando...</p>";

    try {
      const response = await fetch(`${API_URL}/students/`, {
        signal: studentsAbortController.signal,
      });
      if (!response.ok) {
        throw new Error("Erro ao carregar alunos");
      }

      const students = await response.json();

      studentsList.innerHTML = "<h3>Lista de Alunos</h3>";

      if (!students || students.length === 0) {
        studentsList.innerHTML += "<p>Nenhum aluno cadastrado ainda.</p>";
        return;
      }

      const ul = document.createElement("ul");
      students.forEach((student) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="student-info">
              <span>${student.name}</span>
            <p>${student.email}</p>
          </div>
          <button class="btn-delete-student" data-id="${student.id}" data-name="${student.name}">Excluir</button>
        `;
        ul.appendChild(li);
      });
      studentsList.appendChild(ul);
    } catch (error) {
      // Ignora erro de abort (request cancelado intencionalmente)
      if (error.name === "AbortError") {
        return;
      }
      console.error("Erro ao carregar alunos:", error);
      studentsList.innerHTML =
        "<h3>Lista de Alunos</h3><p>Erro ao carregar alunos. Verifique se o servidor está rodando.</p>";
    }
  }

  async function deleteStudent(id) {
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir aluno");
      }

      showNotification("Aluno excluído com sucesso!", "success");
      loadStudents();
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      showNotification("Erro ao excluir aluno. Tente novamente.", "error");
    }
  }

  // Event Delegation: único listener no container pai para botões de delete
  if (studentsList) {
    studentsList.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-delete-student");
      if (!btn) return;

      const id = Number(btn.dataset.id);
      const name = btn.dataset.name;
      if (confirm(`Tem certeza que deseja excluir o aluno "${name}"?`)) {
        await deleteStudent(id);
      }
    });
  }

  // ==================== CADASTRAR ALUNO ====================
    const registerStudentForm = qs("#form-register-student");

  if (registerStudentForm) {
      registerStudentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = qs("#student-name").value.trim();
      const email = qs("#student-email").value.trim();
      const password = qs("#student-password").value;

      // Validações
      if (!name || !email || !password) {
        return showNotification("Por favor, preencha todos os campos obrigatórios.", "error");
      }

      if (password.length < 6) {
        return showNotification("Senha deve ter no mínimo 6 caracteres.", "error");
      }

      try {
        const response = await fetch(`${API_URL}/students/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              name: name,
            email: email,
            password: password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao cadastrar aluno");
        }

        showNotification("Aluno cadastrado com sucesso!", "success");
        registerStudentForm.reset();

        // Se houver lista de alunos na página, atualiza
        if (studentsList) {
          loadStudents();
        }
      } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        showNotification(error.message || "Erro ao cadastrar aluno. Tente novamente.", "error");
      }
    });
  }

  // Carregar lista de alunos se o elemento existir
  if (studentsList) {
    loadStudents();
  }
});
