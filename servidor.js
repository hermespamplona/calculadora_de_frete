// Servidor local para abrir o site no navegador (o fetch de valores.json não funciona via file://).
// Uso: node servidor.js  →  http://localhost:8000
const http = require("http");
const fs = require("fs");
const path = require("path");

const pasta = __dirname;
const porta = 8000;
const tipos = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

http.createServer((req, res) => {
  let caminho = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (caminho === "/") caminho = "/index.html";
  const arquivo = path.join(pasta, caminho);
  if (!arquivo.startsWith(pasta)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(arquivo, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404);
      return res.end("Arquivo não encontrado");
    }
    res.writeHead(200, {
      "Content-Type": tipos[path.extname(arquivo)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(conteudo);
  });
}).listen(porta, () => console.log(`Site disponível em http://localhost:${porta} (Ctrl+C para parar)`));
