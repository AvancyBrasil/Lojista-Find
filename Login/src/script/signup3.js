window.onload = function() {
    const storeName = sessionStorage.getItem('storeName');
    const storeCnpj = sessionStorage.getItem('storeCnpj');
    const storePhoneNum = sessionStorage.getItem('storePhoneNum');
    const storeCep = sessionStorage.getItem('storeCep');
    const storeLocalNum = sessionStorage.getItem('storeLocalNum');
    const storeState = sessionStorage.getItem('storeState');
    const storeCity = sessionStorage.getItem('storeCity');
    const storeStreet = sessionStorage.getItem('storeStreet');

    if (!storeName || !storeCnpj || !storePhoneNum || !storeCep || !storeLocalNum) {
        alert('Algumas informações estão faltando. Por favor, complete o cadastro.');
        window.location.href = './signup-stage-1.html';
    }
};

document.getElementById('dashboard').addEventListener('click', async () => {
    const userName = document.getElementById('userName').value;
    const userLastName = document.getElementById('userLastName').value;
    const userEmail = document.getElementById('userEmail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!userName || !userLastName || !userEmail || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!isValidEmail(userEmail)) {
        alert('Email inválido. Por favor, insira um email válido.');
        return;
    }

    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    const storeName = sessionStorage.getItem('storeName');
    const storeCnpj = sessionStorage.getItem('storeCnpj');
    const storePhoneNum = sessionStorage.getItem('storePhoneNum');
    const storeCep = sessionStorage.getItem('storeCep');
    const storeLocalNum = sessionStorage.getItem('storeLocalNum');
    const storeState = sessionStorage.getItem('storeState');
    const storeCity = sessionStorage.getItem('storeCity');
    const storeStreet = sessionStorage.getItem('storeStreet');

    const formData = {
        nome: userName,
        sobrenome: userLastName,
        email: userEmail,
        senha: password,
        nomeEmpresa: storeName,
        cnpj: storeCnpj,
        numContato: storePhoneNum,
        cep: storeCep,
        numEstab: storeLocalNum,
        estado: storeState,
        cidade: storeCity,
        logradouro: storeStreet,
    };

    try {
        const response = await fetch('http://localhost:4000/validacao/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Lojista cadastrado com sucesso:', data);
            window.location.href = './login.html?success=true';
            sessionStorage.clear();
        } else {
            const errorData = await response.json();
            alert('Erro ao cadastrar: ' + errorData.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar cadastrar. Tente novamente mais tarde.');
    }
});


function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
