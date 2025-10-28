fetch('produtos.json')
  .then(response => response.json())
  .then(produtos => {
    const catalogo = document.getElementById('catalogo');
    catalogo.innerHTML = produtos.map(p => `
      <div class="produto">
        <img src="${p.imagem}" alt="${p.nome}">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <strong>R$ ${p.preco}</strong>
      </div>
    `).join('');
  });