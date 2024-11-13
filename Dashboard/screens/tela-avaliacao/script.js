const allProgress = document.querySelectorAll('main .evaluation-card .progress');

allProgress.forEach(item=> {
    item.style.setProperty('--value', item.dataset.value);
})

document.getElementById('logout').addEventListener('click', function() {
    sessionStorage.removeItem('authToken');

    window.location.href = '../../../Login/login.html';
});

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

            // Preenche os campos de Nome da Empresa e Email
            document.getElementById('empresa-name').textContent = lojista.nomeEmpresa || 'Nome da Empresa';
            document.getElementById('empresa-email').textContent = lojista.email || 'email@gmail.com';

            console.log('Dados do lojista carregados:', lojista);
        })
        .catch(error => console.error('Erro ao buscar os dados do lojista:', error));
}