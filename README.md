# 🏥 Conecta Saúde

<p align="center">
  <img src="assets/logo.svg" alt="Conecta Saúde Logo" width="400"/>
</p>

<p align="center">
  <strong>Hub de Aprendizagem para Profissionais da Saúde</strong>
</p>

<p align="center">
  <em>Projeto de Conclusão de Curso - Code Wise | SENAI</em>
</p>

---

## 📋 Sobre o Projeto

O **Conecta Saúde** é uma plataforma web desenvolvida para gerenciar trilhas de aprendizagem voltadas para profissionais e estudantes da área da saúde. O sistema permite o cadastro de alunos e a criação de trilhas de conhecimento personalizadas, facilitando o acompanhamento do progresso educacional.

## ✨ Funcionalidades

### 👨‍🎓 Gestão de Alunos
- ✅ Cadastro de novos alunos
- ✅ Listagem de todos os alunos cadastrados
- ✅ Visualização de detalhes do aluno
- ✅ Exclusão de alunos

### 📚 Gestão de Trilhas de Aprendizagem
- ✅ Criação de novas trilhas
- ✅ Listagem de trilhas disponíveis
- ✅ Visualização de detalhes da trilha
- ✅ Associação de trilhas a alunos
- ✅ Exclusão de trilhas

### 👤 Painel do Administrador
- ✅ Configurações do perfil
- ✅ Alteração de senha
- ✅ Central de ajuda com FAQ

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e design responsivo
- **JavaScript (ES6+)** - Interatividade e consumo da API

### Backend
- **Python 3.10+** - Linguagem principal
- **FastAPI** - Framework web moderno e de alta performance
- **SQLAlchemy** - ORM para manipulação do banco de dados
- **Pydantic** - Validação de dados

### Banco de Dados
- **MySQL** - Sistema de gerenciamento de banco de dados relacional

## 📁 Estrutura do Projeto

```
Conecte_saude/
├── assets/                   # Arquivos de mídia
│   ├── favicon.png           # Ícone do site
│   └── logo.svg              # Logo principal
├── backend/                  # Código do servidor
│   ├── .env                  # Variáveis de ambiente (não versionado)
│   ├── database.py           # Configuração do banco de dados
│   ├── main.py               # Aplicação FastAPI e rotas
│   ├── models.py             # Modelos do banco de dados
│   └── schemas.py            # Esquemas de validação Pydantic
├── javascript/               # Scripts JavaScript
│   ├── help.js               # Lógica da página de ajuda
│   ├── profile-dropdown.js   # Lógica do dropdown de perfil
│   ├── settings.js           # Lógica das configurações
│   ├── students.js           # Lógica de alunos
│   ├── tracks.js             # Lógica de trilhas
│   └── view-track.js         # Lógica de visualização de trilha
├── style/                    # Folhas de estilo
│   └── style.css             # Estilos principais
├── help.html                 # Página de ajuda
├── index.html                # Página principal (Trilhas)
├── register_student.html     # Página de cadastro de alunos
├── register_track.html       # Página de cadastro de trilhas
├── settings.html             # Página de configurações
├── student.html              # Página de listagem de alunos
├── view_track.html           # Página de detalhes da trilha
└── README.md                 # Este arquivo
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Python 3.10 ou superior
- MySQL 8.0 ou superior
- pip (gerenciador de pacotes Python)

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/conecte-saude.git
cd conecte-saude
```

### 2️⃣ Configure o Banco de Dados

Crie um banco de dados no MySQL:

```sql
CREATE DATABASE conecte_saude;
```

### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
DATABASE_URL=mysql+pymysql://usuario:senha@localhost:3306/conecte_saude
```

### 4️⃣ Instale as Dependências do Backend

```bash
cd backend
pip install fastapi uvicorn sqlalchemy pymysql python-dotenv pydantic
```

### 5️⃣ Execute o Servidor Backend

```bash
uvicorn main:app --reload
```

O servidor estará disponível em: `http://127.0.0.1:8000`

### 6️⃣ Acesse o Frontend

Abra o arquivo `index.html` em seu navegador ou utilize uma extensão como **Live Server**.

## 📡 Endpoints da API

### Alunos (`/students/`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/students/` | Lista todos os alunos |
| `GET` | `/students/{id}` | Retorna um aluno específico |
| `POST` | `/students/` | Cadastra um novo aluno |
| `PUT` | `/students/{id}` | Atualiza dados de um aluno |
| `DELETE` | `/students/{id}` | Remove um aluno |

### Trilhas (`/tracks/`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/tracks/` | Lista todas as trilhas |
| `GET` | `/tracks/{id}` | Retorna uma trilha específica |
| `POST` | `/tracks/` | Cadastra uma nova trilha |
| `DELETE` | `/tracks/{id}` | Remove uma trilha |

### Administrador (`/admin/`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/admin/{id}` | Retorna dados do administrador |
| `POST` | `/admin/` | Cadastra um novo administrador |
| `PUT` | `/admin/{id}` | Atualiza dados do administrador |
| `PUT` | `/admin/{id}/password` | Altera a senha do administrador |

### Documentação Interativa

Acesse a documentação automática da API em:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## 📊 Modelo de Dados

### Admin (Administrador)
```python
{
    "id": int,
    "name": str,
    "email": str,
    "password": str,
    "role": str (opcional),
    "created_at": datetime,
    "updated_at": datetime
}
```

### Student (Aluno)
```python
{
    "id": int,
    "name": str,
    "email": str,
    "password": str,
    "phone": str (opcional),
    "birth_date": date (opcional)
}
```

### Track (Trilha)
```python
{
    "id": int,
    "name": str,
    "description": str (opcional),
    "student_id": int (opcional)
}
```

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido como trabalho de conclusão do curso **Code Wise** do **SENAI**, pelos seguintes alunos:

- Gabriella Marques
- Iago Rodrigues
- Renan Rocha
- André Barbosa
- João Victor Mendes
- Raphael Bicalho
- Alexandre Silveira

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso Code Wise do SENAI.

---

<p align="center">
  <strong>© 2025 Conecta Saúde - Todos os direitos reservados</strong>
</p>
