export default async function handler(req, res) {
  const { produtos } = req.body;

  const response = await fetch(
    "https://api.github.com/repos/rosarioborges/rosarioborges.github.io/contents/produtos.json",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Atualizar produtos",
        content: Buffer.from(JSON.stringify(produtos, null, 2)).toString("base64"),
        sha: req.body.sha, // se quiser sobrescrever o existente
      }),
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
