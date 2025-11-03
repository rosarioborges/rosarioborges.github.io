// script.js
// Carrega produtos diretamente do Supabase

const SUPABASE_URL = "https://vovfzdppsrxxikqcipky.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmZ6ZHBwc3J4eGlrcWNpcGt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg1NTE0OCwiZXhwIjoyMDc3NDMxMTQ4fQ.4NVB4fyLYSj30n8kEN3N01GdnEZXY0LBBQ_4CIqy6C4"; // ⚠️ substitua pela sua chave pública anon

const loaderEl = document.getElementById('loader');
const mensagemEl = document.getElementById('mensagem');
const gridEl = document.getElementById('produtosGrid');

// Inicializa cliente Supabase
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    const { data, error } = await supabase.from('produtos').select('*');
    if (error) throw error;
    renderProdutos(data);
  } catch (err) {
    handleError(err);
  }
}

carregarProdutos();
