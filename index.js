import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const port = 8000;

async function executarSQL(comandoSQL){
    const conexao = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1234",
        port: "3307",
        database: "tarefas_db"
    });

    const [result] = await conexao.query(comandoSQL);
    conexao.end();

    return result;
}

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
    response.send("Olá mundo!");
});

app.get("/boas-vindas", (req, res) => {
    res.send(`Seja bem-vindo`);
});

app.get("/boas-vindas/:nome", (req, res) => {
    res.send(`Seja bem-vindo ${req.params.nome}`);
});


//Fazer login
app.post("/login", async (req, res) => {
    let busca = await executarSQL(`SELECT * FROM usuarios WHERE email = '${req.body.email}';`);
    if(busca.length > 0){
        let usuario = busca[0];
        if(usuario.senha == req.body.senha){
            delete usuario.senha;
            res.send({usuario});
            return;
        }
        res.send("Email ou senha inválidos");
    }
    res.send("Email ou senha inválidos");
});

//Busca usuarios
app.get("/usuarios", async (req, res) => {
    res.send(await executarSQL("SELECT * FROM usuarios;"));
});

//Busca um usuario
app.get("/usuarios/:id", async (req, res) => {
    res.send(await executarSQL(`SELECT * FROM usuarios WHERE id = ${req.params.id};`));
});

//Cria o usuario
app.post("/usuarios", async (req, res) => {
    const request = await executarSQL(`INSERT INTO usuarios (nome, email, senha) VALUES ('${req.body.nome}', '${req.body.email}', '${req.body.senha}')`);
    if(request.affectedRows > 0){
        res.send("Usuário cadastrado com sucesso!");
    }else{
        res.send("Ocorreu um erro");
    }
});

//Edita um usuario
app.put("/usuarios/:id", async (req, res) => {
    const request = await executarSQL(`UPDATE usuarios SET nome = '${req.body.nome}', email = '${req.body.email}', senha = '${req.body.senha}' WHERE id = ${req.params.id}; `);
    if(request.affectedRows > 0){
        res.send("Usuário atualizado com sucesso!");
    }else{
        res.send("Ocorreu um erro");
    }
});

//Deleta um usuario
app.delete("/usuarios/:id", async (req, res) => {
    const request = await executarSQL(`DELETE FROM usuarios WHERE id = ${req.params.id};`);
    if(request.affectedRows > 0){
        res.send("Usuário deletado com sucesso!");
    }else{
        res.send("Ocorreu um erro");
    }
});

//Busca tarefas
app.get("/tarefas", async (req, res) => {
    res.send(await executarSQL("SELECT * FROM tarefas;"));
});

app.get("/tarefas-do-usuario/:usuario_id", async (req, res) => {
    res.send(await executarSQL(`SELECT * FROM tarefas WHERE usuario_id = ${req.params.usuario_id};`));
});

//Cria tarefa
app.post("/tarefas", async (req, res) => {
    const request = await executarSQL(`INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES ('${req.body.titulo}', '${req.body.descricao}', '${req.body.usuario_id}')`);
    if(request.affectedRows > 0){
        res.send("Tarefa cadastrada com sucesso!");
    }else{
        res.send("Ocorreu um erro");
    }
});

//Edita um tarefa
app.put("/tarefas/:id", async (req, res) => {
    const request = await executarSQL(`UPDATE tarefas SET titulo = '${req.body.titulo}', descricao = '${req.body.descricao}', usuario_id = '${req.body.usuario_id}' WHERE id = ${req.params.id}; `);
    if(request.affectedRows > 0){
        res.send("Tarefa atualizada com sucesso!");
    }else{
        res.send("Ocorreu um erro");
    }
});

//Deleta um tarefa
app.delete("/tarefas/:id", async (req, res) => {
    const request = await executarSQL(`DELETE FROM tarefas WHERE id = ${req.params.id};`);
    if(request.affectedRows > 0){
        res.send("Tarefa deletada com sucesso!");
    }else{
        res.send("Ocorreu um erro");
    }
});

app.listen(port, () => {
    console.log(`Servidor de pé: http://localhost:${port}`);
});