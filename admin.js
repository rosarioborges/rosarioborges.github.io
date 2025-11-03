 const SENHA = "admin123";

    function login() {
      const senha = document.getElementById("senha").value;
      if (senha === SENHA) {
        document.getElementById("login").style.display = "none";
        document.getElementById("painel").style.display = "block";
        carregarTercos();
      } else {
        alert("Senha incorreta!");
      }
    }

    // ✅ Instanciar o cliente Supabase CORRETAMENTE
    const SUPABASE_URL = "https://vovfzdppsrxxikqcipky.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdmZ6ZHBwc3J4eGlrcWNpcGt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg1NTE0OCwiZXhwIjoyMDc3NDMxMTQ4fQ.4NVB4fyLYSj30n8kEN3N01GdnEZXY0LBBQ_4CIqy6C4";
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ---- ADICIONAR TERÇO ----
    async function adicionarTerco() {
      const nome = document.getElementById("nome").value.trim();
      const descricao = document.getElementById("descricao").value.trim();
      const preco = document.getElementById("preco").value.trim();
      const imagem = document.getElementById("imagem").files[0];

      if (!nome || !descricao || !preco || !imagem) {
        alert("Preencha todos os campos e selecione uma imagem!");
        return;
      }

      try {
        const nomeArquivo = `${Date.now()}_${imagem.name}`;

        // 1️⃣ Upload da imagem
        const { error: uploadError } = await supabase.storage
          .from("imagem_tercos")
          .upload(nomeArquivo, imagem);

        if (uploadError) throw uploadError;

        // 2️⃣ URL pública
        const { data } = supabase.storage.from("imagem_tercos").getPublicUrl(nomeArquivo);
        const imagemUrl = data.publicUrl;

        // 3️⃣ Inserir no banco
        const { error: insertError } = await supabase
          .from("tercos")
          .insert([{ nome, descricao, preco, imagem_url: imagemUrl }]);

        if (insertError) throw insertError;

        alert("✅ Terço adicionado com sucesso!");
        document.getElementById("nome").value = "";
        document.getElementById("descricao").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("imagem").value = "";
        carregarTercos();
      } catch (err) {
        console.error(err);
        alert("Erro ao adicionar: " + err.message);
      }
    }

    // ---- CARREGAR LISTA ----
    async function carregarTercos() {
      const { data, error } = await supabase
        .from("tercos")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const tbody = document.querySelector("#tabela-tercos tbody");
      tbody.innerHTML = "";

      data.forEach(t => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><img src="${t.imagem_url}" alt="${t.nome}"></td>
          <td>${t.nome}</td>
          <td>${t.descricao}</td>
          <td>R$ ${Number(t.preco).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });
    }
