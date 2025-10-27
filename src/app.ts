import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());


interface DadosPessoais {
  nome: string;
  descricao: string;
}

interface Sobre {
  apresentacao: string;
}

interface Formacao {
  id: number;
  curso: string;
  instituicao: string;
  ano: string;
}
interface SoftSkill {
  id: number;
  habilidade: string;
 
}
interface HardSkill {
  id: number;
  nomeHabilidade:string;
  habilidade: string;
 
}

interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
}

interface Contato {
  email: string;
  github: string;
  linkedin: string;
}



const DATA_PATH = path.join(__dirname, "../data");
const DADOS_PATH = path.join(DATA_PATH, "dadosPessoais.json");
const SOBRE_PATH = path.join(DATA_PATH, "sobre.json");
const FORMACOES_PATH = path.join(DATA_PATH, "formacoes.json");
const SOFT_PATH = path.join(DATA_PATH, "softskills.json")
const HARD_PATH = path.join(DATA_PATH, "hardskills.json")
const PROJETOS_PATH = path.join(DATA_PATH, "projetos.json");
const CONTATO_PATH = path.join(DATA_PATH, "contato.json");



function carregarJSON<T>(caminho: string, padrao: T): T {
  try {
    if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH);
    if (fs.existsSync(caminho)) {
      return JSON.parse(fs.readFileSync(caminho, "utf8"));
    } else {
      fs.writeFileSync(caminho, JSON.stringify(padrao, null, 2));
      return padrao;
    }
  } catch (err) {
    console.error(`Erro ao carregar ${caminho}:`, err);
    return padrao;
  }
}

function salvarJSON(caminho: string, dados: any) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}


let dadosPessoais: DadosPessoais = carregarJSON(DADOS_PATH, { nome: "", descricao: "" });
let sobre: Sobre = carregarJSON(SOBRE_PATH, { apresentacao: "" });
let formacoes: Formacao[] = carregarJSON(FORMACOES_PATH, []);
let softSkills: SoftSkill[] = carregarJSON(SOFT_PATH, []);
let hardSkills: HardSkill[] = carregarJSON(HARD_PATH, []);
let projetos: Projeto[] = carregarJSON(PROJETOS_PATH, []);
let contato = carregarJSON(CONTATO_PATH, { email: "", github: "", linkedin: "" });


app.get("/", (req, res) => {
  res.render("index", { dadosPessoais, sobre, formacoes, softSkills, hardSkills, projetos, contato });
});


app.get("/api/dados", (req, res) => res.json(dadosPessoais));

app.post("/api/dados", (req, res) => {
  const { nome, descricao } = req.body;
  if (nome) dadosPessoais.nome = nome;
  if (descricao) dadosPessoais.descricao = descricao;
  salvarJSON(DADOS_PATH, dadosPessoais);
  res.json(dadosPessoais);
});

app.put("/api/dados", (req, res) => {
  const { nome, descricao } = req.body;
  if (nome) dadosPessoais.nome = nome;
  if (descricao) dadosPessoais.descricao = descricao;
  salvarJSON(DADOS_PATH, dadosPessoais);
  res.json(dadosPessoais);
});

app.delete("/api/dados", (req, res) => {
  dadosPessoais = { nome: "", descricao: "" };
  salvarJSON(DADOS_PATH, dadosPessoais);
  res.json({ message: "Dados deletados com sucesso", dados: dadosPessoais });
});


app.get("/api/sobre", (req, res) => res.json(sobre));

app.post("/api/sobre", (req, res) => {
  const { apresentacao } = req.body;
  if (apresentacao) sobre.apresentacao = apresentacao;
  salvarJSON(SOBRE_PATH, sobre);
  res.json(sobre);
});

app.put("/api/sobre", (req, res) => {
  const { apresentacao } = req.body;
  if (apresentacao) sobre.apresentacao = apresentacao;
  salvarJSON(SOBRE_PATH, sobre);
  res.json(sobre);
});

app.delete("/api/sobre", (req, res) => {
  sobre = { apresentacao: "" };
  salvarJSON(SOBRE_PATH, sobre);
  res.json({ message: "Dados deletados com sucesso", sobre });
});


app.get("/api/formacoes", (req, res) => res.json(formacoes));

app.post("/api/formacoes", (req, res) => {
  const novaFormacao: Formacao = { id: formacoes.length + 1, ...req.body };
  formacoes.push(novaFormacao);
  salvarJSON(FORMACOES_PATH, formacoes);
  res.json(novaFormacao);
});

app.put("/api/formacoes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = formacoes.findIndex(f => f.id === id);
  if (index >= 0) {
    formacoes[index] = { id, ...req.body };
    salvarJSON(FORMACOES_PATH, formacoes);
    res.json(formacoes[index]);
  } else {
    res.status(404).json({ message: "Formação não encontrada" });
  }
});

app.delete("/api/formacoes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  formacoes = formacoes.filter(f => f.id !== id);
  salvarJSON(FORMACOES_PATH, formacoes);
  res.sendStatus(204);
});

app.get("/api/softskills", (req: Request, res: Response) => {
  res.json(softSkills);
});


app.post("/api/softskills", (req: Request, res: Response) => {
  const novaSkill: SoftSkill = { id: softSkills.length + 1, ...req.body };
  softSkills.push(novaSkill);
  salvarJSON(SOFT_PATH, softSkills);
  res.json(novaSkill);
});


app.put("/api/softskills/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = softSkills.findIndex(s => s.id === id);
  if (index >= 0) {
    softSkills[index] = { id, ...req.body };
    salvarJSON(SOFT_PATH, softSkills);
    res.json(softSkills[index]);
  } else {
    res.status(404).json({ message: "Soft skill não encontrada" });
  }
});


app.delete("/api/softskills/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  softSkills = softSkills.filter(s => s.id !== id);
  salvarJSON(SOFT_PATH, softSkills);
  res.sendStatus(204);
});

app.get("/api/hardskills", (req: Request, res: Response) => {
  res.json(hardSkills);
});

app.post("/api/hardskills", (req: Request, res: Response) => {
  const novaSkill: HardSkill = { id: hardSkills.length + 1, ...req.body };
  hardSkills.push(novaSkill);
  salvarJSON(HARD_PATH, hardSkills);
  res.json(novaSkill);
});

app.put("/api/hardskills/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = hardSkills.findIndex(s => s.id === id);
  if (index >= 0) {
    hardSkills[index] = { id, ...req.body };
    salvarJSON(HARD_PATH, hardSkills);
    res.json(hardSkills[index]);
  } else {
    res.status(404).json({ message: "Hard skill não encontrada" });
  }
});

app.delete("/api/hardskills/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  hardSkills = hardSkills.filter(s => s.id !== id);
  salvarJSON(HARD_PATH, hardSkills);
  res.sendStatus(204);
});

app.get("/api/projetos", (req, res) => res.json(projetos));

app.post("/api/projetos", (req, res) => {
  const novoProjeto: Projeto = { id: projetos.length + 1, ...req.body };
  projetos.push(novoProjeto);
  salvarJSON(PROJETOS_PATH, projetos);
  res.json(novoProjeto);
});

app.put("/api/projetos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = projetos.findIndex(p => p.id === id);
  if (index >= 0) {
    projetos[index] = { id, ...req.body };
    salvarJSON(PROJETOS_PATH, projetos);
    res.json(projetos[index]);
  } else {
    res.status(404).json({ message: "Projeto não encontrado" });
  }
});

app.delete("/api/projetos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  projetos = projetos.filter(p => p.id !== id);
  salvarJSON(PROJETOS_PATH, projetos);
  res.sendStatus(204);
});


app.post("/api/contato", (req, res) => {
  const { email, github, linkedin } = req.body;
  if (email) contato.email = email;
  if (github) contato.github = github;
  if (linkedin) contato.linkedin = linkedin;
  salvarJSON(CONTATO_PATH, contato);
  res.json(contato);
});

app.put("/api/contato", (req, res) => {
  const { email, github, linkedin } = req.body;
  if (email) contato.email = email;
  if (github) contato.github = github;
  if (linkedin) contato.linkedin = linkedin;
  salvarJSON(CONTATO_PATH, contato);
  res.json(contato);
});

app.delete("/api/contato", (req, res) => {
  contato = { email: "", github: "", linkedin: "" };
  salvarJSON(CONTATO_PATH, contato);
  res.json({ message: "Contato deletado com sucesso", contato });
});

const PORT = 3000; app.listen(PORT, () => 
{ console.log("rodando em: http://localhost:3000"); }); 