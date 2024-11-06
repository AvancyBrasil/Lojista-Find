
document.getElementById('storeCep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');

    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('storeState').value = data.uf;
                    document.getElementById('storeCity').value = data.localidade;
                    document.getElementById('storeStreet').value = data.logradouro;
                } else {
                    alert('CEP não encontrado!');
                }
            })
            .catch(() => {
                alert('Erro ao buscar CEP!');
            });
    } else {
        alert('CEP inválido!');
    }
});

