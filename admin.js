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
          <td>R$ ${p.preco.toFixed(2)}</td>
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

// Exemplo: função corrigida para atualizar produtos.json incluindo sha atual
async function salvarProdutos(lista, message = 'Atualização de produtos') {
  // gh.owner, gh.repo, gh.branch e gh.token devem estar preenchidos como no seu admin.js
  const path = 'produtos.json';
  const url = `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${path}`;

  try {
    // 1) Pegar o SHA atual (se existir)
    const getRes = await fetch(url + `?ref=${gh.branch}`, {
      headers: { Authorization: 'token ' + gh.token }
    });

    let sha = null;
    if (getRes.ok) {
      const j = await getRes.json();
      sha = j.sha;
    }
    // 2) Preparar conteúdo em base64
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(lista, null, 2))));

    // 3) Montar corpo do PUT (incluir sha se existir)
    const body = {
      message,
      branch: gh.branch,
      content
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'token ' + gh.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      console.error('Erro ao salvar produtos:', putRes.status, text);
      alert('Erro ao salvar produtos. Veja o console para detalhes.');
      return false;
    }

    alert('Produtos atualizados com sucesso!');
    return true;
  } catch (err) {
    console.error('Erro salvarProdutos:', err);
    alert('Erro interno. Veja o console.');
    return false;
  }
}
