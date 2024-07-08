function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    } else {
        alert("Geolocalização não é suportada por esse navegador.");
    }
}

function showWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiKey = 'cb1156bf172d4037ae8143805240807'; 

    
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&lang=pt`;

    console.log("URL da API:", apiUrl);

    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos da API:", data);

            if (data.current && data.forecast) {
               
                const temperatura = data.current.temp_c;
                const descricao = data.current.condition.text;
                const icone = data.current.condition.icon;
                document.getElementById('tempo-atual').innerHTML = `
                    <p>Temperatura: ${temperatura} °C</p>
                    <p>Descrição: ${descricao}</p>
                    <img src="${icone}" alt="Ícone do clima">
                `;

                
                let previsaoHTML = '';
                data.forecast.forecastday.forEach(dia => {
                    const data = dia.date;
                    const tempMax = dia.day.maxtemp_c;
                    const tempMin = dia.day.mintemp_c;
                    const descricao = dia.day.condition.text;
                    const icone = dia.day.condition.icon;
                    previsaoHTML += `
                        <div class="previsao-dia">
                            <h4>${data}</h4>
                            <p>Máx: ${tempMax} °C</p>
                            <p>Mín: ${tempMin} °C</p>
                            <p>Descrição: ${descricao}</p>
                            <img src="${icone}" alt="Ícone do clima">
                        </div>
                    `;
                });
                document.getElementById('previsao-futura').innerHTML = previsaoHTML;
            } else {
                console.error('Dados do clima incompletos:', data);
                document.getElementById('tempo-atual').innerHTML = `
                    <p>Dados do clima incompletos. Por favor, tente novamente mais tarde.</p>
                `;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados do clima:', error);
            document.getElementById('tempo-atual').innerHTML = `
                <p>Erro ao buscar dados do clima. Por favor, tente novamente mais tarde.</p>
            `;
        });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário rejeitou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informação de localização não está disponível.");
            break;
        case error.TIMEOUT:
            alert("A solicitação para obter localização expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ocorreu um erro desconhecido.");
            break;
    }
}

window.onload = getLocation;
