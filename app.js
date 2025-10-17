const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// ================= MIDDLEWARE =================
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para JSON no Swagger/Postman
app.use(methodOverride('_method')); // Formulários POST com _method=PUT/DELETE

// ================= DADOS =================
const DADOS_ESTUDANTE = {
    nomeCompleto: "João Victor Dos Reis Santos", 
    curso: "Desenvolvimento de Software Multiplataforma (DSM)",
    instituicao: "Fatec (Profº Jessen Vidal - São José dos Campos)",
    anoDeIngresso: 2025,
    email: "batata@batata.com",
    telefone: "(xx) xxxxx-xxxx"
};

let DISCIPLINAS = [
    // Disciplinas do 1º 
    "Design Digital",
    "Sistemas Operacionais e Redes de Computadores",
    "Modelagem de Banco de Dados",
    "Algoritmos e Lógica de Programação",
    "Desenvolvimento Web I",
    "Engenharia de Software I",

    // Disciplinas do 2º 
    "Banco de Dados Relacional",
    "Desenvolvimento Web II",
    "Matemática para Computação",
    "Técnica de Programação I",
    "Engenharia de Software II",
    "Estruturas de Dados"
];
let PROJETOS = [
    { id: 1, titulo: "KernelPanic-2DSM-API", descricao: "Projeto DSM da FATEC", tecnologias: ["TypeScript", "Node.js", "React"], link: "#", concluido: false },
    { id: 2, titulo: "Aerocode CLI", descricao: "Sistema de gestão de aeronaves", tecnologias: ["TypeScript", "Node.js"], link: "#", concluido: false },
    { id: 3, titulo: "Projeto RI", descricao: "Recuperação da Informação fases 1-6", tecnologias: ["JavaScript", "TypeScript"], link: "#", concluido: true }
];
let nextProjectId = 4;

// ================= ROTAS GET =================
app.get('/', (req, res) => res.render('index', { nome: DADOS_ESTUDANTE.nomeCompleto }));
app.get('/sobre', (req, res) => res.render('sobre', { estudante: DADOS_ESTUDANTE }));
app.get('/disciplinas', (req, res) => res.render('disciplinas', { disciplinas: DISCIPLINAS }));
app.get('/projetos', (req, res) => res.render('projetos', { projetos: PROJETOS }));
app.get('/contato', (req, res) => res.render('contato', { estudante: DADOS_ESTUDANTE }));

app.get('/dashboard', (req, res) => {
    const projetosConcluidos = PROJETOS.filter(p => p.concluido).length;
    
    const todasTecnologiasEmUso = PROJETOS.flatMap(p => p.tecnologias);

    const contagemTecnologias = todasTecnologiasEmUso.reduce((acc, tec) => {
        acc[tec] = (acc[tec] || 0) + 1;
        return acc;
    }, {}); 

    const tecnologiasDashboard = Object.entries(contagemTecnologias).map(([nome, contagem]) => ({
        nome: nome,
        contagem: contagem
    }));

    const tecnologiasMaisUsadasTop5 = [...tecnologiasDashboard]
        .sort((a, b) => b.contagem - a.contagem)
        .slice(0, 5);

    res.render('dashboard', {
        totalDisciplinas: DISCIPLINAS.length,
        totalProjetos: PROJETOS.length,
        projetosConcluidos,
        tecnologiasMaisUsadas: tecnologiasDashboard, 
        tecnologiasMaisUsadasTop5
    });
});

// ================= CRUD DISCIPLINAS =================
app.post('/disciplinas', (req, res) => {
    const { nome } = req.body;
    if (nome) DISCIPLINAS.push(nome);
    res.redirect('/disciplinas');
});

app.put('/disciplinas/:index', (req, res) => {
    const idx = parseInt(req.params.index);
    const { nome } = req.body;
    if (DISCIPLINAS[idx] !== undefined && nome) DISCIPLINAS[idx] = nome;

    // Diferencia redirect no browser ou JSON
    if (req.headers.accept?.includes('text/html')) res.redirect('/disciplinas');
    else res.status(204).send();
});

app.delete('/disciplinas/:index', (req, res) => {
    const idx = parseInt(req.params.index);
    if (DISCIPLINAS[idx] !== undefined) DISCIPLINAS.splice(idx,1);

    if (req.headers.accept?.includes('text/html')) res.redirect('/disciplinas');
    else res.status(204).send();
});

// ================= CRUD PROJETOS =================
app.post('/projetos', (req, res) => {
    const { titulo, descricao, link, tecnologias, concluido } = req.body;
    if (titulo && descricao) {
        const tecArray = tecnologias ? tecnologias.split(',').map(t=>t.trim()).filter(t=>t) : [];
        PROJETOS.push({ id: nextProjectId++, titulo, descricao, link: link||'#', tecnologias: tecArray, concluido: !!concluido });
    }
    res.redirect('/projetos');
});

app.put('/projetos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const projeto = PROJETOS.find(p => p.id === id);
    if (projeto) {
        const { titulo, descricao, link, tecnologias } = req.body;
        projeto.titulo = titulo || projeto.titulo;
        projeto.descricao = descricao || projeto.descricao;
        projeto.link = link || projeto.link || '#';
        if (tecnologias !== undefined) projeto.tecnologias = tecnologias.split(',').map(t=>t.trim()).filter(t=>t);
        projeto.concluido = req.body.concluido !== undefined;
    }

    if (req.headers.accept?.includes('text/html')) res.redirect('/projetos');
    else res.status(204).send();
});

app.delete('/projetos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    PROJETOS = PROJETOS.filter(p => p.id !== id);

    if (req.headers.accept?.includes('text/html')) res.redirect('/projetos');
    else res.status(204).send();
});

// ================= SWAGGER =================
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: { title: "Portfólio Acadêmico API", version: "1.0.0", description: "API de projetos, disciplinas e estudante" }
    },
    apis: ["./app.js"]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /disciplinas:
 *   get:
 *     summary: Lista todas as disciplinas
 *     responses:
 *       200:
 *         description: Array de disciplinas
 *   post:
 *     summary: Adiciona uma nova disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redireciona para /disciplinas
 */

/**
 * @swagger
 * /disciplinas/{index}:
 *   put:
 *     summary: Atualiza uma disciplina
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *     responses:
 *       204:
 *         description: Atualização realizada
 *   delete:
 *     summary: Deleta uma disciplina
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Disciplina removida
 */

/**
 * @swagger
 * /projetos:
 *   get:
 *     summary: Lista todos os projetos
 *     responses: { 200: { description: Lista de projetos } }
 *   post:
 *     summary: Adiciona um projeto
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: { type: string }
 *               descricao: { type: string }
 *               link: { type: string }
 *               tecnologias: { type: string }
 *               concluido: { type: boolean }
 *     responses: { 302: { description: Redireciona para /projetos } }
 */

/**
 * @swagger
 * /projetos/{id}:
 *   put:
 *     summary: Atualiza um projeto pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: { type: string }
 *               descricao: { type: string }
 *               link: { type: string }
 *               tecnologias: { type: string }
 *               concluido: { type: boolean }
 *     responses: { 204: { description: Projeto atualizado } }
 *   delete:
 *     summary: Deleta um projeto pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses: { 204: { description: Projeto deletado } }
 */

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));