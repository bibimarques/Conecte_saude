const API_URL = "http://127.0.0.1:8000";

// ID do admin logado (em produção, isso viria de um sistema de autenticação)
// Por padrão, usamos o admin com ID 1
let currentAdminId = localStorage.getItem("adminId") || 1;

document.addEventListener("DOMContentLoaded", () => {
  loadAdminProfile();
  setupFormListeners();
});

// Carrega os dados do admin do banco
async function loadAdminProfile() {
  try {
    const response = await fetch(`${API_URL}/admin/${currentAdminId}`);
    
    if (response.ok) {
      const admin = await response.json();
      populateForm(admin);
    } else if (response.status === 404) {
      // Admin não existe, criar um padrão
      console.log("Admin não encontrado. Criando admin padrão...");
      await createDefaultAdmin();
    }
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// Cria um admin padrão se não existir
async function createDefaultAdmin() {
  try {
    const defaultAdmin = {
      name: "Administrador",
      email: "admin@conectasaude.com",
      password: "admin123",
      role: "Coordenador de Trilhas"
    };

    const response = await fetch(`${API_URL}/admin/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(defaultAdmin)
    });

    if (response.ok) {
      const admin = await response.json();
      currentAdminId = admin.id;
      localStorage.setItem("adminId", admin.id);
      populateForm(admin);
      showNotification("Perfil de administrador criado!", "success");
    }
  } catch (error) {
    console.error("Erro ao criar admin padrão:", error);
  }
}

// Preenche o formulário com os dados do admin
function populateForm(admin) {
  const nameInput = document.getElementById("settings-name");
  const emailInput = document.getElementById("settings-email");
  const roleInput = document.getElementById("settings-role");

  if (nameInput) nameInput.value = admin.name || "";
  if (emailInput) emailInput.value = admin.email || "";
  if (roleInput) roleInput.value = admin.role || "";
}

// Configura os listeners dos formulários
function setupFormListeners() {
  // Formulário de perfil
  const profileForm = document.getElementById("form-admin-profile");
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate);
  }

  // Formulário de senha
  const passwordForm = document.getElementById("form-admin-password");
  if (passwordForm) {
    passwordForm.addEventListener("submit", handlePasswordUpdate);
  }
}

// Atualiza o perfil do admin
async function handleProfileUpdate(e) {
  e.preventDefault();

  const name = document.getElementById("settings-name").value.trim();
  const email = document.getElementById("settings-email").value.trim();
  const role = document.getElementById("settings-role").value.trim();

  if (!name || !email) {
    showNotification("Nome e email são obrigatórios", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin/${currentAdminId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role })
    });

    if (response.ok) {
      showNotification("Perfil atualizado com sucesso!", "success");
    } else {
      const error = await response.json();
      showNotification(error.detail || "Erro ao atualizar perfil", "error");
    }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

// Atualiza a senha do admin
async function handlePasswordUpdate(e) {
  e.preventDefault();

  const currentPassword = document.getElementById("settings-current-password").value;
  const newPassword = document.getElementById("settings-new-password").value;
  const confirmPassword = document.getElementById("settings-confirm-password").value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    showNotification("Preencha todos os campos de senha", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    showNotification("As senhas não coincidem", "error");
    return;
  }

  if (newPassword.length < 6) {
    showNotification("A nova senha deve ter no mínimo 6 caracteres", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin/${currentAdminId}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    if (response.ok) {
      showNotification("Senha alterada com sucesso!", "success");
      // Limpa os campos de senha
      document.getElementById("settings-current-password").value = "";
      document.getElementById("settings-new-password").value = "";
      document.getElementById("settings-confirm-password").value = "";
    } else {
      const error = await response.json();
      showNotification(error.detail || "Erro ao alterar senha", "error");
    }
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    showNotification("Erro ao conectar com o servidor", "error");
  }
}

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

