document.addEventListener("DOMContentLoaded", () => {
  const KEY = "hubSaude_alunos";
  const qs = (s) => document.querySelector(s);

  const save = (v) => localStorage.setItem(KEY, JSON.stringify(v));
  const load = () => {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  };

  let alunos = load();
  if (!alunos) {
    alunos = [
      { id: 101, nome: "Maria Silva", email: "maria.s@email.com" },
      { id: 102, nome: "João Oliveira", email: "joao.o@email.com" },
    ];
    save(alunos);
  }

  const listaAlunosDiv = qs("#lista-alunos");

  function carregarAlunos() {
    if (!listaAlunosDiv) return;
    listaAlunosDiv.innerHTML = "<h3>Lista de Alunos</h3>";
    if (!alunos || alunos.length === 0) {
      listaAlunosDiv.innerHTML += "<p>Nenhum aluno cadastrado ainda.</p>";
      return;
    }

    const ul = document.createElement("ul");
    alunos.forEach((a) => {
      const li = document.createElement("li");
      li.innerHTML = `\n        <div class="aluno-info">\n          <span>${a.nome}</span>\n          <p>${a.email}</p>\n        </div>\n        <button class="btn-excluir-aluno" data-id="${a.id}">Excluir</button>`;
      ul.appendChild(li);
    });
    listaAlunosDiv.appendChild(ul);

    listaAlunosDiv.querySelectorAll(".btn-excluir-aluno").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        const nome = e.target.closest("li").querySelector("span").textContent;
        if (confirm(`Tem certeza que deseja excluir o aluno "${nome}"?`)) {
          excluirAluno(id);
        }
      });
    });
  }

  function excluirAluno(id) {
    alunos = alunos.filter((a) => a.id !== id);
    save(alunos);
    carregarAlunos();
    alert("Aluno excluído com sucesso!");
  }

  // Form
  const formCadastroAluno = qs("#form-cadastro-aluno");
  if (formCadastroAluno) {
    formCadastroAluno.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = qs("#nome-aluno").value.trim();
      const email = qs("#email-aluno").value.trim();
      const senha = qs("#senha-aluno").value;
      if (!nome || !email || !senha)
        return alert("Por favor, preencha todos os campos obrigatórios.");
      if (senha.length < 6)
        return alert("Senha deve ter no mínimo 6 caracteres.");
      if (alunos.some((al) => al.email === email))
        return alert("Este email já está cadastrado!");

      // Não armazenar senha em localStorage (sensível). Salvamos somente dados não sensíveis.
      const novo = {
        id: alunos.length ? Math.max(...alunos.map((a) => a.id)) + 1 : 101,
        nome,
        email,
      };
      alunos.push(novo);
      save(alunos);
      alert("Aluno cadastrado com sucesso!");
      formCadastroAluno.reset();
      const listagemAlunosSection = qs("#listagem-alunos");
      if (listagemAlunosSection)
        listagemAlunosSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      carregarAlunos();
    });
  }

  if (listaAlunosDiv) carregarAlunos();
});
