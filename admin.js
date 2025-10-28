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
    .then(res => res.json())
    .then(lista => {
      const container = document.getElementById('lista');
      container.innerHTML = lista.map((p, i) => `
        <div>
          <img src="${p.imagem}" width="100"><br>
          ${p.nome} - R$${p.preco}
          <button onclick="excluirProduto(${i})">Excluir</button>
        </div>
      `).join('');
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
    });
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
  fetch('https://api.github.com/repos/SEU_USUARIO/RosarioBorges/contents/produtos.json', {
    method: 'PUT',
    headers: {
      'Authorization': 'token SEU_TOKEN_GITHUB',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Atualização de produtos',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(lista, null, 2))))
    })
  }).then(() => alert('Produtos atualizados com sucesso!'));
}