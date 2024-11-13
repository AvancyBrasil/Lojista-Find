let idLojista = null;

const email = sessionStorage.getItem('userEmail');

if (!email) {
    console.error('E-mail não encontrado no sessionStorage');
} else {
    fetch(`http://localhost:4000/lojistas?email=${email}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const lojista = Array.isArray(data) ? data[0] : data;

            if (!lojista) {
                console.error('Lojista não encontrado');
                return;
            }
            document.getElementById('empresa-name').textContent = lojista.nomeEmpresa || 'Nome da Empresa';
            document.getElementById('empresa-email').textContent = lojista.email || 'email@gmail.com';

            idLojista = lojista.id;
            
            console.log('ID do lojista:', idLojista);
            sessionStorage.setItem("idLojista",idLojista);
            sessionStorage.setItem("imgLojista",lojista.imagemLojista);
            
        })
        .catch(error => console.error('Erro ao buscar os dados do lojista:', error));
}



document.getElementById("profile-pic").addEventListener("click", function() {
  const input = document.createElement("input");
  input.type = "text"; 
  input.id = "profile-link";
  input.placeholder = "Insira o link para a imagem de perfil"; 

  const inputContainer = document.querySelector(".input-container");
  inputContainer.innerHTML = "";
  inputContainer.appendChild(input);


  input.addEventListener("blur", function(event) {
      const link = event.target.value;
      if (link) {
          const profileImg = document.getElementById("profile-img");
          profileImg.src = link;
      }
  });
});


document.getElementById("edit-btn").addEventListener("click", function() {
  const nomeProduto = document.getElementById("nomeProduto").value;
  const preco = document.getElementById("preco").value.toString();
  const descricao = document.getElementById("descricao").value;
  const categoria = document.getElementById("categoria").value;
  const imageLink = document.getElementById("profile-link") ? document.getElementById("profile-link").value : "";

  
  const produtoData = {
      nome: nomeProduto,
      preco: preco,
      descricao: descricao,
      categoria: categoria,
      imagemProduto: imageLink,
      idLojista: idLojista
  };

  console.log("Dados do produto:", produtoData); 

  fetch("http://localhost:4000/produtos/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(produtoData)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        alert("Produto adicionado com sucesso!");
        document.getElementById("nomeProduto").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("descricao").value = "";
        document.getElementById("categoria").value = "Doces e Salgados";
        document.getElementById("profile-link").value = "";
    } else {
      location.reload();
        alert("Produto adicionado com produto sucesso.");
    }
})
.catch(error => {
    console.error("Erro na requisição:", error);
    alert("Erro ao enviar os dados.");
});
}); 

const lojista_id = sessionStorage.getItem('idLojista');
const lojista_img = sessionStorage.getItem('imgLojista');

async function fetchProdutos(idLojista) {
    try {
      const response = await fetch(`http://localhost:4000/produtos/?idLojista=${lojista_id}`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const produtos = await response.json();
      
      if (Array.isArray(produtos) && produtos.length > 0) {
        console.log(produtos);
        renderProdutos(produtos);
      } else {
        console.error('Nenhum produto encontrado.');
        alert('Nenhum produto encontrado para este lojista.');
      }
    } catch (error) {
      console.error(error);
      alert('Não foi possível carregar os produtos.');
    }
  }
  
  function renderProdutos(produtos) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    produtos.forEach(produto => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img class="imagemProduto" src="${produto.imagemProduto}" alt="Produto">
        <div class="linha">
          <div class="product-name">${produto.nome}</div>
          <div class="botoes">
            <button class="editar-btn">Editar</button>
            <button class="deletar-btn">Deletar</button>
          </div>
        </div>
      `;
    
      productCard.querySelector('.editar-btn').addEventListener('click', () => {
        editarProduto(produto);
      });
    
      productCard.querySelector('.deletar-btn').addEventListener('click', () => {
        deletarProduto(produto.id);
      });
      
      function deletarProduto(idProduto) {
        fetch(`http://localhost:4000/produtos/${idProduto}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            
            alert("Produto deletado com sucesso!");
            location.reload();
          } else {
            alert("Erro ao deletar produto.");
          }
        })
        .catch(error => console.error('Erro ao deletar produto:', error));
      }
    
      productGrid.appendChild(productCard);
    });
  }
  
  function editarProduto(produto) {
    document.getElementById('1nomeProduto').value = produto.nome;
    document.getElementById('1descricaoProduto').value = produto.descricao;
    document.getElementById('1precoProduto').value = produto.preco;
    document.getElementById('1imagemProduto').value = produto.imagemProduto;
  
    const imagemProdutoExibida = document.getElementById('imagemProdutoExibida');
    imagemProdutoExibida.src = produto.imagemProduto;
  
    const modal = document.getElementById('modalEditProduto');
    modal.style.display = "block";
    
    document.getElementById('closeModal').addEventListener('click', () => {
      modal.style.display = "none";
    });

    const campoImagemProduto = document.getElementById('1imagemProduto');
    campoImagemProduto.addEventListener('input', () => {
      imagemProdutoExibida.src = campoImagemProduto.value || produto.imagemProduto;
    });
  
    document.getElementById('editForm').addEventListener('submit', (event) => {
      event.preventDefault();
      
   
      const produtoAtualizado = {
        id: produto.id,
        nome: document.getElementById('1nomeProduto').value,
        descricao: document.getElementById('1descricaoProduto').value,
        preco: document.getElementById('1precoProduto').value,
        imagemProduto: document.getElementById('1imagemProduto').value
      };
  
      fetch(`http://localhost:4000/produtos/${produto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoAtualizado)
      })
      .then(response => response.json())
      .then(data => {
        modal.style.display = "none";
        location.reload();
        renderProdutos(data.produtos);
      })
      .catch(error => console.error('Erro ao editar produto:', error));
    });
  }
  fetchProdutos(idLojista);
