const hitsong = new Audio();
hitsong .src = './efeitos/hit.wav';

let frames = 0;
let bestScore = 0;
let bestScore2 = 0;
let bestScore3 = 0;
let ScoreAtual = 0;

const sprites = new Image();
sprites.src = './sprites.png';

const ouro = new Image();
ouro.src = './medalhas/ouro.png';

const prata = new Image();
prata.src = './medalhas/prata.png';

const bronze = new Image();
bronze.src = './medalhas/bronze.png';

const ferro = new Image();
ferro.src = './medalhas/ferro.png';


const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// Mensagem Game Over
const mensagemGameOver = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {


        contexto.drawImage(
            sprites,
            mensagemGameOver.spriteX, mensagemGameOver.spriteY,
            mensagemGameOver.largura, mensagemGameOver.altura,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura, mensagemGameOver.altura,
        );
        if (ScoreAtual == bestScore) {
            contexto.drawImage(
                ouro, 73, 135
            );
        } else if (ScoreAtual == bestScore2) {
            contexto.drawImage(
                prata, 73, 135
            );
        } else if (ScoreAtual == bestScore3) {
            contexto.drawImage(
                bronze, 73, 135
            );
        } else {

            contexto.drawImage(
                ferro, 73, 135
            );
        }

        contexto.font = '35px "VT323"';
        contexto.textAlign = 'right';
        contexto.fillStyle = 'brown';
        contexto.fillText(`${ScoreAtual}`, canvas.width - 80, 147);

        contexto.font = '35px "VT323"';
        contexto.textAlign = 'right';
        contexto.fillStyle = 'brown';
        contexto.fillText(`${bestScore}`, canvas.width - 80, 190);
    },

    atualiza() {


    },
};

// Mensagem get Ready
const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width/2)-174/2,
    y: 50,
    desenha() {


        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    },
};

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce'; // Define a cor
    contexto.fillRect(0,0, canvas.width, canvas.height) // Define o tamanho e posição da forma e desenha no fundo

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

      contexto.drawImage( // Duplica e desloca o background para preencher a tela
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};


function criaCanos() {

    const canos = {

        largura: 52,
        altura: 400,

        chao: {

            spriteX: 0,
            spriteY: 169,

        },

        ceu: {

            spriteX: 52,
            spriteY: 169,

        },

        desenha() {

            canos.pares.forEach(function (par) {

                const yRandom = par.y;
                const espacamentoEntreCanos = 100;

                const canoCeuX = par.x;
                const canoCeuY = 0 + yRandom;


                // CANO DO CÉU

                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,

                )

                // CANO DO CHÃO

                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;

                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,

                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }

            })

        },

        pares: [],
        temColisaoComOFlappy(par) {

            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if ((globais.flappyBird.x + globais.flappyBird.largura - 20 + globais.flappyBird.largura) >= par.x) {
                if (cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if (peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }
            return false;

        },

        atualiza() {

            const passou100Frames = frames % 100 == 0;

            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random()+1),
                });

            }

            canos.pares.forEach(function (par) {

                if (canos.temColisaoComOFlappy(par)) {
                    hitsong.play();

                    setTimeout(() => {
                        mudaParaTela(Telas.GAME_OVER);

                    }, 500);
                }

                par.x = par.x - 2;

                if (par.x <= -52) {

                    canos.pares.shift();

                }

            });

        }

        }

        return canos;
}

function criaChao() {

    // [Chao]
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        atualiza() {

            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            chao.x = movimentacao % repeteEm;
        },

        desenha() {
            contexto.drawImage(
                sprites,                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );

            contexto.drawImage( // Duplica e desloca o chão para preencher a tela
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    };

    return chao;
}

function fazColisao(flappyBird, chao) {

    const flappyBirdyY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdyY >= chaoY) {

        return true;
    } else {

        return false;
    }

}

function criaFlappyBird(){

    // Flappy Bird
    const flappyBird = {
        spriteX: 0, //tamanho do recorte x
        spriteY: 0, //tamanho do recorte y
        largura: 33, //tamanho do sprite
        altura: 24, //tamanho do sprite
        x: 10, //posição x
        y: 50, //posição y
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula() {

            flappyBird.velocidade = - flappyBird.pulo;

        },

        movimentos: [

            { spriteX: 0, spriteY:0, },
            { spriteX: 0, spriteY:26, },
            { spriteX: 0, spriteY:52, },

        ],

        atualiza() {

            if (fazColisao(flappyBird, globais.chao)) {

                hitsong.play();

                mudaParaTela(Telas.GAME_OVER);
                return;

            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;

        },

        frameAtual: 0,

        atualizarFrame() {
            const intervaloDeFrames = 10;
            const passouIntervalo = frames % intervaloDeFrames;
            if (passouIntervalo == 0) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }

        },

        desenha() {

            flappyBird.atualizarFrame();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage( // Desenha no canvas
                sprites,
                spriteX, spriteY, // Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}

function criaPlacar() {

    frames = 1;
    const placar = {
        
        pontuacao: 0,


        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width-10, 35);
            

        },

        atualiza() {
            let intervaloDeFrames = 0;
            if (frames < 240) {
                ScoreAtual = 0;
                intervaloDeFrames = 240;

            } else {

                intervaloDeFrames = 90;

            }
            const passouIntervalo = frames % intervaloDeFrames == 0;
            
            if (passouIntervalo) {
                placar.pontuacao += 1;
                ScoreAtual = placar.pontuacao;
                console.log(ScoreAtual);

                if (bestScore < placar.pontuacao) {

                    bestScore = placar.pontuacao;
                } else if (bestScore2 < placar.pontuacao) {

                    bestScore2 = placar.pontuacao;
                } else if (bestScore3 < placar.pontuacao) {

                    bestScore3 = placar.pontuacao;
                }
            }

        }
    }
    return placar;
}


//TELAS
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela){

    telaAtiva = novaTela;
    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }

};

const Telas = {
    INICIO: {

        inicializa() {

            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();

        },

        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            

           mensagemGetReady.desenha();

        },

        click() {

            mudaParaTela(Telas.JOGO);

        },

        atualiza() {

            globais.chao.atualiza();

        },
    },

    JOGO: {

        inicializa() {
            globais.placar = criaPlacar();

        },

        desenha() {

            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.placar.desenha();

        },
        click() {

            globais.flappyBird.pula();

        },


        atualiza() {
            globais.chao.atualiza();
            globais.flappyBird.atualiza();
            globais.canos.atualiza();
            globais.placar.atualiza();

        },
    },

        GAME_OVER: {

            inicializa() {

                globais.flappyBird = criaFlappyBird();
                globais.chao = criaChao();
                globais.canos = criaCanos();

        },

        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGameOver.desenha();

        },
        click() {

            mudaParaTela(Telas.INICIO);

        },


        atualiza() {

        },
    }

};
    

function loop() {
  //chama as funções desenha() de cada constante de acordo com a ordem

    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames += 1;
  requestAnimationFrame(loop); // Desenha em loop de forma inteligente
}

window.addEventListener('click', function () {

    if (telaAtiva.click) {
        
        telaAtiva.click();

    }

});

mudaParaTela(Telas.INICIO);
loop();