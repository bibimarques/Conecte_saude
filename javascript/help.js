document.addEventListener("DOMContentLoaded", () => {
  // FAQ Accordion functionality
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all other items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });

  // Search functionality
  const searchInput = document.querySelector("#help-search-input");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();

      faqItems.forEach((item) => {
        const questionText = item.querySelector(".faq-question span").textContent.toLowerCase();
        const answerText = item.querySelector(".faq-answer p").textContent.toLowerCase();

        if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
          item.style.display = "block";
        } else {
          item.style.display = searchTerm ? "none" : "block";
        }
      });
    });
  }
});

