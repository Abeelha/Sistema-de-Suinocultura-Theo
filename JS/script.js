function submitFeedEntry() {
    const feedQuantity = document.getElementById('feedQuantity').value;

    if (!feedQuantity || isNaN(feedQuantity) || feedQuantity <= 0) {
        displayFeedMessage('Por favor, insira uma quantidade válida.', 'error');
        return;
    }

    const feedEntry = {
        quantidade: parseInt(feedQuantity),
        data: new Date().toISOString(),
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/entrada-racao', true); // Adjust the endpoint accordingly
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                displayFeedMessage('Entrada de ração registrada com sucesso.', 'success');
            } else {
                displayFeedMessage('Erro ao registrar entrada de ração. Tente novamente.', 'error');
            }
        }
    };

    xhr.send(JSON.stringify(feedEntry));
}

function displayFeedMessage(message, type) {
    const messageDiv = document.getElementById('feedMessage');
    messageDiv.textContent = message;

    if (type === 'error') {
        messageDiv.style.color = 'red';
    } else if (type === 'success') {
        messageDiv.style.color = 'green';
    }

    setTimeout(() => {
        messageDiv.textContent = '';
    }, 5000);
}
