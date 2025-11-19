# 🚀 Portfólio Acadêmico Full-Stack com API RESTful

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-A91B4C?style=for-the-badge&logo=ejs&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Status](https://img.shields.io/badge/status-concluído-green?style=for-the-badge)

Este projeto é um **Portfólio Acadêmico Full-Stack** que combina uma interface de usuário renderizada pelo servidor (SSR) com uma **API RESTful** completa para gerenciar dados de disciplinas e projetos.

A aplicação foi desenvolvida em **Node.js** com **Express** e demonstra proficiência em *backend*, arquitetura MVC (ou similar) e documentação de API usando **Swagger/OpenAPI**.

---

## 🎯 Sobre o Projeto: Arquitetura e Objetivo

O principal objetivo é servir como uma central de informações dinâmicas sobre o percurso acadêmico do estudante, indo além de um portfólio estático:

### 1. Backend (API)
* **Tecnologia:** Express.js (JavaScript/Node.js).
* **Função:** Gerencia os dados internos (disciplinas, projetos) em memória e expõe *endpoints* CRUD via REST.
* **Rotas CRUD:** Implementação completa de `POST`, `GET`, `PUT` e `DELETE` para as coleções `/disciplinas` e `/projetos`.

### 2. Frontend (View Layer)
* **Tecnologia:** EJS (Embedded JavaScript) como *View Engine*.
* **Função:** O servidor Express renderiza páginas HTML dinâmicas (`/`, `/sobre`, `/disciplinas`, `/projetos`, `/contato`), injetando os dados do *backend* nas views.

### 3. Dashboard e Lógica de Negócio
* A rota `/dashboard` demonstra lógica de processamento de dados em tempo real, calculando estatísticas como projetos concluídos e o *ranking* das tecnologias mais utilizadas.

---

## ✨ Tecnologias e Recursos Especiais

* **Documentação Interativa (Swagger):** O endpoint `/api-docs` documenta automaticamente as rotas CRUD, permitindo testar a API diretamente pelo navegador.
* **Métodos HTTP Completos:** Uso de `method-override` para permitir que formulários HTML realizem requisições `PUT` e `DELETE`.
* **Lógica de Dados em Memória:** Os dados são armazenados em variáveis JS (`DISCIPLINAS`, `PROJETOS`), simulando um banco de dados para a prova de conceito.
* **Middleware:** Uso de `body-parser` para processar dados de formulário e JSON.

---

## 💻 Estrutura e Dados

| Rota Principal | Tipo de Conteúdo | Função |
| :--- | :--- | :--- |
| `/` | EJS View | Página inicial. |
| `/disciplinas` | EJS View + CRUD API | Exibe lista de disciplinas e permite adicionar, editar e remover itens. |
| `/projetos` | EJS View + CRUD API | Exibe portfólio e permite gerenciar projetos (adicionar detalhes, tecnologias, status). |
| `/dashboard` | EJS View | Exibe métricas processadas (contagem de tecnologias, projetos concluídos, etc.). |
| `/api-docs` | Swagger UI | Documentação interativa da API REST. |

---

## 🔧 Pré-requisitos
Para executar o servidor, você precisará ter:
* **Node.js** (versão LTS ou superior).

---

## 🚀 Manual de Instalação e Execução

1.  **Inicialize e Instale Dependências:**
    ```bash
    npm init -y
    npm install 
    ```

2.  **Inicie o Servidor:**
    ```bash
    node app.js
    ```
3.  **Acesse a Aplicação:**
    * **Portfólio Web:** `http://localhost:3000/`
    * **Documentação da API:** `http://localhost:3000/api-docs`
