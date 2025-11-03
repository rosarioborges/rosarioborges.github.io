// script.js
// Carrega produtos diretamente da API do banco de dados

const API_URL = "https://vovfzdppsrxxikqcipky.supabase.co"; 
// ^^^ substitua pelo endpoint real do seu backend (ex: /api/produtos ou URL completa)

const loaderEl = document.getElementById('loader');
const mensagemEl = document.getElementById('mensagem');
const gridEl = document.getElementById('produtosGrid');

function renderProdutos(produtos) {
  if (!Array.isArray(produtos) || produtos.length === 0) {
    loaderEl.style.display = 'none';
    mensagemEl.style.display = 'block';
    mensagemEl.textContent = 'Nenhum produto encontrado.';
    return;
  }

  const html = produtos.map(p => `
    <div class="produto">
      <img src="${p.imagem || 'imagens/placeholder.png'}" alt="${p.nome || 'Sem nome'}">
      <h3>${p.nome || 'Produto sem nome'}</h3>
      <p>${p.descricao || ''}</p>
      <strong>R$ ${Number(p.preco || 0).toFixed(2)}</strong>
    </div>
  `).join('');

  loaderEl.style.display = 'none';
  mensagemEl.style.display = 'none';
  gridEl.style.display = 'grid';
  gridEl.innerHTML = html;
}

function handleError(err) {
  console.error("Erro ao carregar produtos:", err);
  loaderEl.style.display = 'none';
  gridEl.style.display = 'none';
  mensagemEl.style.display = 'block';
  mensagemEl.textContent = 'Erro ao carregar produtos. Tente novamente mais tarde.';
}

async function carregarProdutos() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const produtos = await res.json();
    renderProdutos(produtos);
  } catch (err) {
    handleError(err);
  }
}

carregarProdutos();
