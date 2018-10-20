var escalonador = angular.module('escalonador', []);

escalonador.controller('escalonadorCtrl', function ($scope, $interval) {
    var _ = $scope;

    _.vel = 500;
    _.tempo = 300;
    _.segundos = 0;
    _.chegada1 = 0;
    _.chegada2 = 0;
    _.saida = 0;
    _.fila1 = 0;
    _.fila2 = 0;
    _.servico = false;
    escalonaChegada1(0);
    escalonaChegada2(0);
    _.logs = [];
    var intervalPromise;
    var isPaused = false;

    _.run = function () {
        if (_.segundos > 0 && !isPaused) {
            return;
        }
        isPaused = false;
        intervalPromise = $interval(function () {
            if (_.segundos < _.tempo) {
                _.segundos++;
                checaEventosCriados(_.segundos);
            }
        }, _.vel);
    };

    _.stop = function () {
        $interval.cancel(intervalPromise);
        isPaused = false;
        _.segundos = 0;
        _.chegada1 = 0;
        _.chegada2 = 0;
        _.saida = 0;
        _.fila1 = 0;
        _.fila2 = 0;
        _.servico = false;
        escalonaChegada1(0);
        escalonaChegada2(0);
        _.logs = [];
    };

    _.pause = function () {
        $interval.cancel(intervalPromise);
        isPaused = true;
    };

    function checaEventosCriados(seg) {
        var houveAlteracao = false;

        if (seg == _.chegada1) {
            houveAlteracao = true;
            log('Tipo de evento: Chegada, Momento do evento: ' + seg);
            if (!_.servico) {
                escalonaSaida(seg);
                _.servico = true;
                log('Elemento no serviço: Fila 1');
            } else {
                _.fila1++;
            }
            escalonaChegada1(seg);
        }

        if (seg == _.chegada2) {
            houveAlteracao = true;
            log('Tipo de evento: Chegada, Momento do evento: ' + seg);
            if (!_.servico) {
                escalonaSaida(seg);
                _.servico = true;
                log('Elemento no serviço: Fila 2');
            } else {
                _.fila2++;
            }
            escalonaChegada2(seg);
        }

        if (seg == _.saida) {
            houveAlteracao = true;
            log('Tipo de evento: Saída, Momento do evento: ' + seg);
            if (_.fila1 !== 0) {
                _.fila1--;
                escalonaSaida(seg);
                _.servico = true;
                log('Elemento no serviço: Fila 1');
            } else if (_.fila2 !== 0 && _.fila1 === 0) {
                _.fila2--;
                escalonaSaida(seg);
                _.servico = true;
                log('Elemento no serviço: Fila 2');
            }
        }

        if (houveAlteracao && _.fila1 === 0 && _.fila2 === 0) {
            _.servico = false;
        }

        if (houveAlteracao) {
            log('Elementos na Fila 1: ' + _.fila1);
            log('Elementos na Fila 2: ' + _.fila2);
            log('-*-');
        }
    }

    function escalonaChegada1(seg) {
        _.chegada1 = seg + geraNumeroAleatorioFila1();
    }

    function escalonaChegada2(seg) {
        _.chegada2 = seg + geraNumeroAleatorioFila2();
    }

    function escalonaSaida(seg) {
        var rand = geraNumeroAleatorioTermino();
        _.saida = seg + rand;
    }

    function log(msg) {
        console.log(msg);
        _.logs.unshift(msg);
    }
});

function geraNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function geraNumeroAleatorioFila1() {
    return geraNumeroAleatorio(1, 10);
}

function geraNumeroAleatorioFila2() {
    return geraNumeroAleatorio(1, 5);
}

function geraNumeroAleatorioTermino() {
    return geraNumeroAleatorio(3, 7);
}