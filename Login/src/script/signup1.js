document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tela2').addEventListener('click', function() {
        const storeName = document.querySelector('input[placeholder="Digite o nome da loja"]').value;
        const storeCnpj = document.getElementById('storeCnpj').value; 
        const storePhoneNum = document.getElementById('storePhoneNum').value; 

        if (!storeName || !storeCnpj || !storePhoneNum) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const cnpj = storeCnpj.replace(/\D/g, ""); 
        if (!validarCNPJ(cnpj)) {
            alert("CNPJ inválido");
            return; 
        }

        sessionStorage.setItem('storeName', storeName);
        sessionStorage.setItem('storeCnpj', storeCnpj);
        sessionStorage.setItem('storePhoneNum', storePhoneNum);

        window.location.href = './signup-stage-2.html';
    });
});

function validarCNPJ(cnpj) {
    if (cnpj.length !== 14) return false;

    let sum = 0;
    let pos = 5;

    for (let i = 0; i < 12; i++) {
        sum += cnpj[i] * pos--;
        if (pos < 2) pos = 9;
    }

    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;

    sum = 0;
    pos = 6;

    for (let i = 0; i < 13; i++) {
        sum += cnpj[i] * pos--;
        if (pos < 2) pos = 9;
    }

    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;

    return digit1 === Number(cnpj[12]) && digit2 === Number(cnpj[13]);
}

function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ""); 
    if (cnpj.length <= 14) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})?/, "$1.$2.$3/$4-").trim();
    }
    return cnpj; 
}

function formatPhoneNumber(phone) {
    phone = phone.replace(/\D/g, ""); 
    if (phone.length <= 11) {
        if (phone.length <= 10) { 
            return phone.replace(/(\d{2})(\d{4})(\d{4})?/, "($1) $2-$3").trim();
        } else { 
            return phone.replace(/(\d{2})(\d{5})(\d{4})?/, "($1) $2-$3").trim();
        }
    }
    return phone; 
}

document.getElementById('storeCnpj').addEventListener('input', function() {
    this.value = formatCNPJ(this.value);
});

document.getElementById('storeCnpj').addEventListener('blur', function() {
    const formattedCNPJ = formatCNPJ(this.value);
    this.value = formattedCNPJ;

    const cnpj = formattedCNPJ.replace(/\D/g, "");
    if (!validarCNPJ(cnpj)) {
        alert("CNPJ inválido");
        this.value = ""; 
    } else {
        console.log("CNPJ válido!"); 
    }
});

document.getElementById('storePhoneNum').addEventListener('input', function() {
    this.value = formatPhoneNumber(this.value);
});

document.getElementById('storePhoneNum').addEventListener('blur', function() {
    this.value = formatPhoneNumber(this.value);
});
