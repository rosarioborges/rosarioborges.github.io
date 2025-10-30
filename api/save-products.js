import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { produtos } = req.body;
    const filePath = path.join(process.cwd(), "public", "produtos.json");
    fs.writeFileSync(filePath, JSON.stringify(produtos, null, 2));
    res.status(200).json({ message: "Produtos salvos com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar produtos" });
  }
}
