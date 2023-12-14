// Projeto Theodoro  bertol Suinocultura

function registrarEntradaRacao() {
    // Get form data
    const nomeRacao = document.getElementById('nomeRacao').value;
    const quantidadeRacao = document.getElementById('quantidadeRacao').value;
    const validadeRacao = document.getElementById('validadeRacao').value;

    // Create an object with the form data
    const formData = {
        nomeRacao,
        quantidadeRacao,
        validadeRacao
    };

    // Make a POST request to the server
    fetch('/entradaracao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            console.log(data);
            // Display a message on the HTML page based on the response
            document.getElementById('mensagemEntradaRacao').innerText = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
