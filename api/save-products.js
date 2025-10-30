export default async function handler(req, res) {
  // Permite requisições vindas do Netlify (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { produtos } = req.body;

    // Requisição para o GitHub API para atualizar o produtos.json
    const response = await fetch('https://api.github.com/repos/rosarioborges/rosarioborges.github.io/contents/produtos.json', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
    });

    const data = await response.json();
    const sha = data.sha;

    const updateResponse = await fetch('https://api.github.com/repos/rosarioborges/rosarioborges.github.io/contents/produtos.json', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Atualização de produtos via painel admin',
        content: Buffer.from(JSON.stringify(produtos, null, 2)).toString('base64'),
        sha
      })
    });

    const result = await updateResponse.json();
    res.status(200).json({ message: 'Produtos atualizados com sucesso', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao salvar produtos', error: err.message });
  }
}
