'use strict'
Array.prototype.remover = function(elemento) {
    let v = []
    this.map(e => {
        if (e != elemento) v.push(e)
    })
    this.splice(0, this.length)
    v.map(e => this.push(e))
    return this
};
let
    app,
    conf,
    sorteando,
    marcados = [],
    bolaSorteo,
    request = obj => {
        return new Promise((aceptar, rechazar) => {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    aceptar(xhttp.responseText)
                }
            }
            xhttp.open(obj.methodo ? obj.methodo : "GET", obj.url, true)
            xhttp.send(obj.datos)
        })
    },
    css = (selector, property, value) => {
        for (let i = 0; i < document.styleSheets.length; i++) {
            try {
                document.styleSheets[i].insertRule(selector + ' {' + property + ':' + value + '}', document.styleSheets[i].cssRules.length);
            } catch (err) {
                try {
                    document.styleSheets[i].addRule(selector, property + ':' + value);
                } catch (err) {}
            }
        }
    },
    estilos = e => {
        css('celda', 'width', (100 / e.numeros) + '%')
        css('celda>svg', 'max-height', (50 / e.filas) + 'vh')
        css('sorteo>svg', 'height', screen.height / 4 + 'px')
        if (e.fondo) {
            css('body', 'background', e.fondo.color ? e.fondo.color : 'red')
        }
    },
    init = () => {
        document.oncontextmenu = clickDerecho
        request({
            url: 'config.json'
        }).then(c => {
            c = JSON.parse(c)
            conf = c
            bolaSorteo = document.querySelector('sorteo')
            estilos(c)
            app = document.querySelector('app')
            let grilla = document.createElement('grilla'),
                index = 1
            marcados = localStorage.getItem("marcados")
            marcados = JSON.parse(marcados)
            for (let i = 0; i < c.filas; i++) {
                let f = document.createElement('fila')
                for (let j = 0; j < c.numeros / c.filas; j++) {
                    if (index > c.numeros) break;
                    request({
                        url: 'bolablanca.svg'
                    }).then(bola => {
                        let celda = document.createElement('celda')
                        celda.setAttribute('id', "c_" + index)
                        celda.innerHTML = bola
                        celda.getElementsByTagName('text')[0].innerHTML = index < 10 ? "0" + index : index
                        index++;
                        f.appendChild(celda)
                        if (index == c.numeros) marcarInicio(0)
                    })
                }
                grilla.appendChild(f)
            }
            app.appendChild(grilla)
            randomMove()
        })
    },
    fnReinicio = () => {
        if (marcados.length > 0) {
            desmarcar(marcados[marcados.length - 1])
            marcados.remover(marcados[marcados.length - 1])
            setTimeout(fnReinicio, 100)
        }
        localStorage.setItem("marcados", JSON.stringify(marcados))
    },
    marcarInicio = num => {
        if (num < marcados.length) {
            marcar(marcados[num])
            setTimeout(() => marcarInicio(num + 1), 1)
        }
    },
    desmarcar = num => {
        let celda = document.getElementById('c_' + num)
        if (celda == undefined) return
        let circulo = celda.getElementsByTagName('circle')[0]
        if (circulo == undefined) return
        celda.classList = ['']
        circulo.setAttribute('fill', 'url(#grad_white)')
    },
    marcar = num => {
        let celda = document.getElementById('c_' + num)
        if (celda == undefined) return
        let circulo = celda.getElementsByTagName('circle')[0]
        if (circulo == undefined) return
        celda.classList = ['marcada']
        circulo.setAttribute('fill', 'url(#grad_red)')
        celda.getElementsByTagName('text')[0]
        let t = bolaSorteo.querySelector('text')
        t.innerHTML = num
    },
    guardarMarca = num => {
        marcados.push(num)
        localStorage.setItem("marcados", JSON.stringify(marcados))
    },
    sortear = () => {
        if (marcados.length >= conf.numeros) {
            console.log("Ya no hay mas numeros para sortear")
            return
        }
        if (sorteando) return finSorteo()
        sorteando = true
        let n = generarNumeroRandom()
        while (marcados.includes(n)) n = generarNumeroRandom()
        let num = bolaSorteo.querySelector('text'),
            numerosRandom = () => {
                bolaSorteo.classList = ['mostrar']
                let e = function(resolve, veces) {
                    veces++
                    num.innerHTML = generarNumeroRandom()
                    if (veces > 50) resolve()
                    else setTimeout(() => e(resolve, veces), Math.floor((Math.random() * 4) + 1) * (veces / 2))
                }
                return new Promise((resolve) => {
                    setTimeout(() => e(resolve, 0), 10)
                })
            }
        numerosRandom().then(() => {
            marcar(n)
            guardarMarca(n)
        })
    },
    finSorteo = () => {
        sorteando = false
        bolaSorteo.classList = []
    },
    generarNumeroRandom = () => Math.floor((Math.random() * conf.numeros) + 1),
    randomMove = () => {
        let __c = document.querySelectorAll('celda')
        let _c = document.querySelectorAll('celda[randomanim]')
        if (_c != undefined && _c[0] != undefined)
            _c.forEach(_e => {
                _e.removeAttribute('randomAnim')
            })
        if (__c != undefined && __c[0] != undefined)
            __c[Math.floor(Math.random() * conf.numeros)].setAttribute('randomAnim', true)
        setTimeout(randomMove, Math.random() * 5000)
    },
    clickDerecho = e => {
        e.preventDefault()
    }