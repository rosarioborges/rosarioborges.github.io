const SENHA = 'admin123';

function login() {
  const senha = document.getElementById('senha').value;
  if (senha === SENHA) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('painel').style.display = 'block';
    carregarProdutos();
  } else {
    alert('Senha incorreta!');
  }
}

function carregarProdutos() {
  fetch('produtos.json')
    .then(res => res.text())
    .then(conteudo => {
      let lista = [];
      try {
        lista = JSON.parse(conteudo);
      } catch (e) {
        console.error("Erro ao ler JSON:", e);
        alert("O arquivo de produtos está corrompido. Ele foi reiniciado.");
        lista = [];
      }

      document.getElementById('lista-produtos').innerHTML = lista.map((p, i) => `
        <tr>
          <td><img src="${p.imagem}" alt="${p.nome}" style="width:60px; border-radius:8px"></td>
          <td>${p.nome}</td>
          <td>${p.descricao}</td>
          <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
          <td><button onclick="excluirProduto(${i})">Excluir</button></td>
        </tr>
      `).join('');
    })
    .catch(err => {
      console.error("Erro ao carregar produtos:", err);
      alert("Não foi possível carregar os produtos.");
    });
}

function adicionarProduto() {
  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const preco = document.getElementById('preco').value;
  const imagem = document.getElementById('imagem').value;

  fetch('produtos.json')
    .then(res => res.json())
    .then(lista => {
      lista.push({ nome, descricao, preco, imagem });
      salvarProdutos(lista);
    })
    .catch(() => salvarProdutos([{ nome, descricao, preco, imagem }]));
}

function excluirProduto(i) {
  fetch('produtos.json')
    .then(res => res.json())
    .then(lista => {
      lista.splice(i, 1);
      salvarProdutos(lista);
    });
}

function salvarProdutos(lista) {
  fetch('https://rosarioborges-github-io-git-main-rosarioborges-projects.vercel.app/api/save-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ produtos: lista })
  })
  .then(res => res.json())
  .then(() => alert('Produtos atualizados com sucesso!'))
  .catch(err => alert('Erro ao salvar produtos: ' + err));
}
