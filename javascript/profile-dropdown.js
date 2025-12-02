document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profile-btn");
  const profileMenu = document.getElementById("profile-menu");
  const dropdownIcon = profileBtn?.querySelector(".dropdown-icon");

  if (!profileBtn || !profileMenu) return;

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = profileMenu.classList.toggle("active");
    profileBtn.classList.toggle("active", isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.remove("active");
      profileBtn.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      profileMenu.classList.remove("active");
      profileBtn.classList.remove("active");
    }
  });

  profileMenu.querySelectorAll(".profile-menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      profileMenu.classList.remove("active");
      profileBtn.classList.remove("active");
      
      if (item.classList.contains("logout")) {
        e.preventDefault();
        if (confirm("Tem certeza que deseja sair da conta?")) {
          alert("Você foi desconectado com sucesso!");
        }
      }
    });
  });
});

