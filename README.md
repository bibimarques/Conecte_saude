
# Conecte Saúde
Projeto desenvolvido para a conclusão do curso Code Wise, oferecido pelo Senai.

# Modelagem UML<> Back end.

## 📚 Descrição
O sistema consiste em uma lista de aprendizagem, cujo objetivo é gerenciar uma lista de cadastros com o nome da trilha, sua descrição, módulos e objetivo.  
O cadastro de aluno permitirá adicionar uma nova trilha, habilitando o acesso a uma lista de aprendizagem.  
O sistema é fundamentado em consultar (pesquisar) itens relacionados à área de saúde.

---

## 🛠 Funcionalidades
- **Cadastrar Trilha de Aprendizagem:** Armazena as informações da trilha de aprendizagem.
- **Cadastrar Aluno:** Armazena informações do aluno.
- **Relacionar Aluno à Trilha:** Permite vincular alunos às trilhas cadastradas.

---

## 📐 Documentação UML
### Classes

#### **Alunos**
- **Atributos:**
  - `Name: String`
  - `E-mail: String`
- **Métodos:**
  - `Create()`
  - `Create_Trail()`
  - `Delete()`

#### **Trilha_Aprendizagem**
- **Atributos:**
  - `Trail_Name: String`
  - `Description: String`
  - `Objective: String`
- **Métodos:**
  - `List_all()`
  - `Create()`
  - `Delete()`

---

## 🔗 Relações
- **Alunos → Trilha de Aprendizagem:**  
  Um aluno pode ter múltiplas trilhas cadastradas.  
  Mas a trilha de aprendizagem só pode estar disponível se houver uma ou várias trilhas cadastradas.

---

## ✅ Objetivo
Gerenciar trilhas de aprendizagem e alunos, permitindo consultas e cadastros de forma organizada.





# Modelagem UML<> Data Base.


# Projeto: Listagem de Aprendizagem

## 📚 Descrição
Este projeto tem como objetivo gerenciar trilhas de aprendizagem e alunos, permitindo que cada aluno possa ter nenhuma ou várias trilhas cadastradas.

---

## 🛠 Modelo de Dados (DER)
O sistema é composto por duas entidades principais:

### **Tabela: Alunos**
- **PK**: `ID_aluno_id_not_null`
- **FK1**: `id_Nome_da_Trilha_int`
- **Descrição**: `varchar(655) not_null`
- **Objetivo**: `varchar(255) not_null`

### **Tabela: Trilha_Aprendizagem**
- **PK**: `ID_aluno_id_not_null`
- **FK1**: `id_Nome_da_Trilha_int`
- **Descrição**: `varchar(655) not_null`
- **Objetivo**: `varchar(255) not_null`
- **Notas**: `varchar(300) not_null`

---

## 🔗 Relacionamentos
- **Alunos → Trilha de Aprendizagem**  
  Um aluno pode não ter nenhuma trilha ou ter várias trilhas cadastradas.

---

## ✅ Objetivo
Gerenciar trilhas de aprendizagem e alunos, permitindo consultas e cadastros de forma organizada.

---

## 📌 Observações
- Cada trilha possui descrição, objetivo e notas.
- Cada aluno pode estar vinculado a uma ou mais trilhas.






