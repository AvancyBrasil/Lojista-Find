document.addEventListener('DOMContentLoaded', function() {

    const storeName = sessionStorage.getItem('storeName');
    const storeCnpj = sessionStorage.getItem('storeCnpj');
    const storePhoneNum = sessionStorage.getItem('storePhoneNum');

   
    console.log(storeName, storeCnpj, storePhoneNum);

    
    document.getElementById('tela3').addEventListener('click', function() {
    
        const storeCep = document.getElementById('storeCep').value;
        const storeState = document.getElementById('storeState').value;
        const storeCity = document.getElementById('storeCity').value;
        const storeStreet = document.getElementById('storeStreet').value;
        const storeLocalNum = document.querySelector('input[placeholder="Digite o número do local da empresa"]').value;


        if (!storeCep || !storeLocalNum || !storeState || !storeCity || !storeStreet) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

    
        sessionStorage.setItem('storeCep', storeCep);
        sessionStorage.setItem('storeState', storeState);
        sessionStorage.setItem('storeCity', storeCity);
        sessionStorage.setItem('storeStreet', storeStreet);
        sessionStorage.setItem('storeLocalNum', storeLocalNum);

    
        window.location.href = './signup-stage-3.html';
    });
});

