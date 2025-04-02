const urlWord = 'https://random-word-api.vercel.app/api?words=1&length=5&alphabetize=true';
const urlTip = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

let randomWord; //armazena a palavra gerada
let correctAnswer = 0;
let wrongAnswer = 5;
let ArrayUsedLetter = [];
let usedLetter = false;
let tipNumber = -1;
let score = 10

document.getElementById('genarateBtn').addEventListener('click', () => generateWord());


function generateWord() {

    //resetar os valores
    function reset(){
        //zera a contagem de erros e acertos a cada nova palavra gerada
        correctAnswer = 0;
        wrongAnswer = 5;
        ArrayUsedLetter = [];
        tipNumber = -1
        score = 10

        //fecha o modal
        document.querySelector('dialog').close(); 

        //remove as vidas
        let lifesDisplay = document.getElementById('lifesDisplay');
        lifesDisplay.innerHTML = '';

        //move as dicas
        let displayTips = document.getElementById('displayTips');
        displayTips.innerHTML = '';

        //remove possiveis mensagens de erro
        let infoMsg = document.getElementById('infoMsg');
        infoMsg.innerHTML = '';

        document.getElementById('displayTips').style = 'display: none'

        //remove a classse do modal,para ajustar o funcionamento da transição quanto necessário
        const modal = document.querySelector('dialog'); 
        modal.classList.remove('dialogTransition');
    
    }

    reset()

    fetch(urlWord).then((response) => {
        return response.json()
    }).then((word) => {
        randomWord = word[0];
        displayWordBox();
    }).catch((error) => {
        console.log(error);
    })
}

let TipBtn = document.getElementById('tipBtn').addEventListener('click', () => requestTip(randomWord));

function requestTip(randomWord) {

    tipNumber++;

    let displaytip = document.getElementById('displayTips')
    let tip = document.createElement('li');
    

    if(randomWord == undefined || randomWord == null){
        let infoMsg = document.getElementById('infoMsg')
        infoMsg.innerText = 'Nenhuma palavra foi gerada ainda!'; 
    }else{
        
    if(tipNumber <= 1){


        fetch(urlTip + randomWord).then((response) => {
            return response.json()
        }).then((word) => {
            console.log(word)
    
            tip.innerText = (word[0].meanings[0].definitions[tipNumber].definition)
            
            document.getElementById('displayTips').style = 'display: visible'
            displaytip.appendChild(tip);

            setTimeout(()=>{
                
                tip.classList.add('liTransition'); 

            }, 500)
            
            
    
         
        }).catch((error) => {
            console.log('tives um erro: ' + error);    
        })

        //ajusta a pontuação conforme o uso de dicas
        if(score == 10){
            score = 8
        }else{
            score= 5 
        }


    }else{

        let infoMsg = document.getElementById('infoMsg'); 
        infoMsg.innerText = 'Você não pode mais solicitar idicas'; 
    }   

    }


}

function displayWordBox() {

    let boxContainer = document.getElementById('boxContainer');

    boxContainer.innerHTML = '';

    let lifesDisplay = document.getElementById('lifesDisplay');


    console.log(randomWord)


    //cria as box para cada letraddd                    
    for (let i = 0; i < 5; i++) {

        //display das letras
        let letterBox = document.createElement('div');
        letterBox.setAttribute('class', 'displayLetter');

        boxContainer.appendChild(letterBox);
    

        //display das vidas
        let lifes = document.createElement('img');
        lifes.setAttribute('src', '../favicon_io/heart/heart_icon.png'); 


        lifesDisplay.appendChild(lifes);

        //animação no surgimento das divs
        setTimeout(() => {
            letterBox.classList.add('transitionAnimation'); // Agora aplica a transição
            lifes.classList.add('transitionAnimation');
        },  i * 200);

        
    }

}

//verificar com o btn enter
document.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {

        verify();
    }
})

function verify() {

    let userLetter = document.getElementById('inputLetter').value   ;
    let check = false; // var auxiliar para fazer a verificação de erros e acertos; 

    //verifica se alguma palavra já foi gerada
    if (randomWord == null || randomWord == undefined) {
        let infoMsg = document.getElementById('infoMsg')
        infoMsg.innerText = 'Nenhuma palavra foi gerada ainda!'; 
    }

    else {
        //verifica se o valor enviado é uma letra


        let infoMsg = document.getElementById('infoMsg');

        if (userLetter.toLowerCase() >= 'a' && userLetter.toLowerCase() <= 'z') {

            //verifica se caso a letra já tenha sido usada
            for (let i = 0; i < ArrayUsedLetter.length; i++) {
                if (userLetter == ArrayUsedLetter[i]) {

                    //exibe msg de erro
                    infoMsg.innerText = 'Letra já inserida! Tente Novamente.';

                    usedLetter = true;
                    break

                }
                else {
                    usedLetter = false;

                }


            }
            // se a letra não for usada segue a verificação

            if (!usedLetter) {
                //limpa as mensgens de erro
                infoMsg.innerHTML = '';

                //verifica se oq foi inserido é uma palavra e se está correto
                if(userLetter.toLowerCase() ===  randomWord){
                    check = true; //se estiver certo check = true 
                    correctAnswer = 5
                    ArrayUsedLetter.push(userLetter);
                    
                    


                //o que foi inserido é uma letra, faz então a verificação
                }else{

                    for (let i = 0; i < 5; i++) {

                        if (userLetter.toLowerCase() === randomWord[i]) {
                            let letter = document.createElement('h2');
                            
                            
    
    
                            letter.innerText = userLetter.toUpperCase();
    
                            let box = document.getElementsByClassName('displayLetter')[i]
    
    
                            box.appendChild(letter);

                            setTimeout(() => {
                                letter.classList.add('CorrectAnswer');
                                box.classList.add('CorrectAnswer') // Agora aplica a transição
                            }, 50);
    
                            //soma os acertos
                            correctAnswer++;
                            console.log('acertos: ' + correctAnswer)
    
                            ArrayUsedLetter.push(userLetter);
    
                            check = true; //se estiver certo a var aux vira true
    
                        }
                    }
    
                }

                //limpa o input
                document.getElementById('inputLetter').value = '';

                //com o var aux 'check' verifica se está certo ou errado e diminui vidas
                if (check == false) {
                    wrongAnswer--;
                    //pega o 'vida' e retira do display
                    let hideLife = document.getElementsByTagName('img')[wrongAnswer]
                    hideLife.style = 'display: none';


                    console.log('erros: ' + wrongAnswer);
                    ArrayUsedLetter.push(userLetter);//adiciona ao array de letras/palavras usadas
                }

                //chama a função que verifica a virória com os parametros de pts de acerto e erros
                verifyWin(correctAnswer, wrongAnswer)

            }

        }

        else if (userLetter == '') {//verificação sobre o valor enviado no input é vazio
            console.log('nenhuma letra inserida');
        }
        else {//verificação sobre o valor enviado no input 
            console.log('parametro não aceito')
        }
    }
}


function verifyWin(correct, wrong) {

    if (correct == 5) {
        console.log('Parabéns vc Ganhou!!!!');

        for (let i = 0; i < 5; i++) {

            let letter = document.createElement('h2');
           

            letter.innerText = randomWord[i].toUpperCase();
            let box = document.getElementsByClassName('displayLetter')[i]
            box.innerHTML = '';
            box.appendChild(letter);
            setTimeout(() => {
                letter.classList.add('CorrectAnswer'); //     Agora aplica a transição
                box.classList.add('CorrectAnswer');
            }, 50);

            //exibe o modal 
            const modal = document.querySelector('dialog'); 

            let result = document.querySelector('dialog h1'); 
            result.innerText = 'Você Ganhou!'
            
            let subtitle = document.querySelector('dialog p');
            subtitle.innerHTML =  `A palavra era: <strong>${randomWord}</strong>`;  

             let scoreExb = document.querySelectorAll('dialog p')[1];
            scoreExb.innerHTML = `Sua pontuação foi de: <strong>${score}<strong>`

            setTimeout(()=>{
                modal.showModal();
                modal.classList.add('dialogTransition')
            }, 500); 
            
            
        }

        randomWord = '';
    }
    else if (wrong == 0) {
        
        score = 0; 

        //adiciona toda a palavra quando a pessoa perde
        for (let i = 0; i < 5; i++) {

            let letter = document.createElement('h2');
            

            letter.innerText = randomWord[i].toUpperCase();
            let box = document.getElementsByClassName('displayLetter')[i]
            box.innerHTML = '';
            box.appendChild(letter);
            setTimeout(() => {
                letter.classList.add('WrongAnswer'); //     Agora aplica a transição
                box.classList.add('WrongAnswer');
            }, 50);
        }

        //exibe o modal 
        const modal = document.querySelector('dialog'); 
       

        let result = document.querySelector('dialog h1'); 
        result.innerText = 'Você Perdeu!'; 
        
        let subtitle = document.querySelector('dialog p');
        subtitle.innerHTML =  `A palavra era: <strong>${randomWord}</strong>`;  

        let scoreExb = document.querySelectorAll('dialog p')[1];
        scoreExb.innerHTML = `Sua pontuação foi de: <strong>${score}<strong>`; 
        modal.showModal();
      
        // Exibir o modal com transição
        
        setTimeout(()=>{
            modal.showModal();
            modal.classList.add('dialogTransition'); 
        }, 500); 

        randomWord = '';

    }

}

let quitBtn = document.getElementById('GiveUpBtn').addEventListener('click', () => quit());

function quit() {

    score = 0; 

    if (randomWord == undefined || randomWord == null || randomWord == '') {
        let infoMsg = document.getElementById('infoMsg'); 
        infoMsg.innerText = 'Nenhuma palavra foi gerada ainda!'; 
    }
    else {
        wrongAnswer = 0;

        verifyWin( undefined, wrongAnswer)

        }

    }