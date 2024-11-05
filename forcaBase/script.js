let words = ["tampa", "praia", "manga"]; //vetor com as palavras 
let randomWord = "";
let countVidas = 6; //contador de vidas
let countAcertos = 0; //contador de acertos
let displayVidas = document.createElement("h2"); // exibe as vidas
let letrasUsadas = new Array(); //letras corretas; 
let letrasErradas = new Array();

let gerar = document.getElementById("genarateBtn");
gerar.addEventListener("click", generateWord);


document.addEventListener("keyup", function(event){
    if(event.key === 'Enter'){
        
        verify(); 
    }
})

function random(n) { //gera numero aleatório 
    return Math.floor(Math.random() * (n - 0)) + 0;
}
function reset() {
    //reseta os valores para o padrão
    randomWord = "";
    countVidas = 6; 
    countAcertos = 0; 
    letrasUsadas = [];

    let displayLetter = document.getElementById("displayLetter"); 
    displayLetter.innerHTML = ""; 

    document.getElementById("letter").value = "";
 

    //remove as divs anteriores
    let container = document.getElementById("container");
    if (container) {
        container.innerHTML = '';
    }

    // Remover elemento h2 do DOM, se houver
    let displayVidas = document.getElementById("displayVidas");
    if (displayVidas) {
        displayVidas.remove();
    } 

}

function generateWord() {//escolhe uma palavra aleatória de dentro do vetor

    reset(); 

    let title = document.getElementById("title"); // h1 com o nome do jogo
    title.after(displayVidas);


    displayVidas.innerHTML = `Vidas: ${countVidas}`; //exibe as vidas

    randomWord = words[random(words.length)];
    console.log(randomWord);

    displayContainer(randomWord.length);

    


    return randomWord;
}

function displayContainer(numberletter) { //exibe as caixas referente a cada letra

    let container = document.getElementById("container"); //div pai do display 


    for (var i = 0; i < numberletter; i++) {

        let div_display = document.createElement("div"); // cria as divs que exibem as letras
        div_display.classList = "containerWords";
        container.appendChild(div_display);

    }


}

function verify() {

    let check = 0; // verificador caso encontre a letra 
    let userLetter = document.getElementById("letter").value; //recebe a letra do usuário
    let displayMessage = document.getElementById('waring_messages'); // exibe mensagem sobre as letras
    // displayMessage.innerHTML = ""; 
    let displayLetter = document.getElementById("displayLetter"); 
    
    
    if(userLetter === ""  ){
        displayMessage.innerHTML = "Insira alguma letra"; 
    }
    else if(randomWord == ""){
        displayMessage.innerHTML = "nenhuma palavra foi gerada"; 
    }
    else{
        //verifica se a letra existe na palavra
    for (let i = 0; i < randomWord.length; i++) {
        if (userLetter.toLowerCase() === randomWord[i]){
            check = 1;
            countAcertos++;
            //exibe a letra
            let div_postion = document.getElementsByTagName("div")[i + 1];
            div_postion.innerHTML = `<h2 class = "displayWord">${userLetter.toUpperCase()}</h2>`
             
        }
            
    }

    //valida se as letras usadas são novas
    if (check == 1) { 

        let LetraNaoUsada = true; 

        for(let i = 0; i<letrasUsadas.length; i++){
            if(userLetter.toLowerCase() === letrasUsadas[i]){
                LetraNaoUsada = false; 
                break; 
            }
        }
        //contabiliza acerto a cada nova letra correta
        if(LetraNaoUsada){
            
            console.log(countAcertos)
            letrasUsadas.push(userLetter);

        }
    }

    else{
        displayMessage.innerHTML = "Letra não encontrada"; 
        displayLetter.innerHTML += " " + userLetter.toUpperCase(); 
        countVidas--;
        displayVidas.innerHTML = `Vidas: ${countVidas}`;
        letrasErradas.push(userLetter); 
    }


    //analisa vitoria ou derrota    
     
    verificaVencedor(countVidas, countAcertos);
     document.getElementById("letter").value = "";



    }
}

function verificaVencedor(contadorVidas, contadorAcertos) {

    if (contadorVidas == 0 && (contadorAcertos < randomWord.length)) {
        alert("voce perdeu");
        generateWord();

    }
    else if (contadorVidas > 0 && (contadorAcertos === randomWord.length)) {
        alert("voce ganhou");
        generateWord(); 
    }

}




