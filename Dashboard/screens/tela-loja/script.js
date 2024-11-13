let email = sessionStorage.getItem('userEmail');

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
            console.log(lojista);

            if (!lojista) {
                console.error('Lojista não encontrado');
                return;
            }
            document.getElementById('name').value = lojista.nomeEmpresa || '';
            document.getElementById('email').value = lojista.email || '';
            document.getElementById('phone').value = lojista.numContato || '';
            document.getElementById('cep').value = lojista.cep || '';
            document.getElementById('state').value = lojista.estado || '';
            document.getElementById('city').value = lojista.cidade || '';
            document.getElementById('address').value = lojista.logradouro || '';
            document.getElementById('number').value = lojista.numEstab || '';

            document.getElementById('empresa-name').textContent = lojista.nomeEmpresa || 'Nome da Empresa';
            document.getElementById('empresa-email').textContent = lojista.email || 'email@gmail.com';
            const lojistaImage = document.getElementById('imagemLojista');
            if (lojista.imagemLojista) {
                lojistaImage.src = lojista.imagemLojista;
                lojistaImage.alt = `Foto de ${lojista.nomeEmpresa}`;
                document.getElementById('imageUrlInput').value = lojista.imagemLojista; // Preenche o campo com a imagem atual
            } else {
                lojistaImage.src = '/Dashboard/images/profile.jpg'; 
                lojistaImage.alt = 'Imagem padrão';
                document.getElementById('imageUrlInput').value = ''; // Se não houver imagem, limpa o campo
            }

            window.idLojista = lojista.id;
            console.log('ID do Lojista:', window.idLojista);
        })
        .catch(error => console.error('Erro ao buscar os dados do lojista:', error));
}

document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');

    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('state').value = data.uf;
                    document.getElementById('city').value = data.localidade;
                    document.getElementById('address').value = data.logradouro;
                } else {
                    alert('CEP não encontrado!');
                }
            })
            .catch(error => console.error('Erro ao buscar o CEP:', error));
    } else {
        alert('CEP inválido!');
    }
});

const editBtn = document.getElementById('edit-btn');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const editButtons = document.getElementById('edit-buttons');
const inputs = document.querySelectorAll('input');
const imageUrlInput = document.getElementById('imageUrlInput');
const imagemLojista = document.getElementById('imagemLojista');

function enableEditing() {
    inputs.forEach(input => input.disabled = false);
    editBtn.style.display = 'none';
    editButtons.style.display = 'block';
    imageUrlInput.style.display = 'block'; // Mostra o campo de input para URL de imagem
}

function disableEditing() {
    inputs.forEach(input => input.disabled = true);
    editBtn.style.display = 'block';
    editButtons.style.display = 'none';
    imageUrlInput.style.display = 'none'; // Oculta o campo de input para URL de imagem
}

editBtn.addEventListener('click', enableEditing);
cancelBtn.addEventListener('click', () => {
    disableEditing();
});
confirmBtn.addEventListener('click', () => {
    const data = {
        nomeEmpresa: document.getElementById('name').value,
        email: document.getElementById('email').value,
        numContato: document.getElementById('phone').value,
        cep: document.getElementById('cep').value,
        estado: document.getElementById('state').value,
        cidade: document.getElementById('city').value,
        logradouro: document.getElementById('address').value,
        numEstab: document.getElementById('number').value,
        imagemLojista: imageUrlInput.value // Adiciona o link da imagem ao objeto de dados
    };

    console.log('Fazendo requisição PUT para:', `http://localhost:4000/lojistas/${window.idLojista}`);
    console.log('Dados a serem atualizados:', data);

    fetch(`http://localhost:4000/lojistas/${window.idLojista}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log('Resposta da requisição:', response);
            return response.json();
        })
        .then(data => {
            console.log('Dados retornados:', data);
            alert('Dados atualizados com sucesso!');
            
            // Atualize a imagem no perfil com o novo link inserido
            if (data.imagemLojista) {
                imagemLojista.src = data.imagemLojista;
            }
            
            disableEditing();
        })
        .catch(error => {
            console.error('Erro ao atualizar os dados:', error);
        });
});

// Atualiza a imagem em tempo real conforme o valor do campo de URL é alterado
document.getElementById('imageUrlInput').addEventListener('input', function() {
    const imagemLojista = document.getElementById('imagemLojista');
    const newImageUrl = this.value;

    if (newImageUrl) {
        imagemLojista.src = newImageUrl;
        imagemLojista.alt = `Foto de ${newImageUrl}`;
    } else {
        imagemLojista.src = '/Dashboard/images/profile.jpg'; 
        imagemLojista.alt = 'Imagem padrão';
    }
});
