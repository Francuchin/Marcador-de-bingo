'use strict'

let marcados = [],
    booleanBingo = false

Array.prototype.remover = function(elemento) {
    let v = []
    this.map(e => {
        if (e != elemento) v.push(e)
    })
    this.splice(0, this.length)
    v.map(e => this.push(e))
    return this
};
let bingo = () => {
    let g = document.querySelector('gris'),
        b = document.querySelector('#bingo')
    b.classList = ['bingo']
    g.classList = ['adelante']
    b.onclick = noBingo
    booleanBingo = true
}
let noBingo = () => {
    let g = document.querySelector('gris'),
        b = document.querySelector('#bingo')
    b.classList = ''
    g.classList = ''
    b.onclick = bingo
    booleanBingo = false
}

let iniciar = () => {
    let t = document.querySelector('table')
    let m_ = localStorage.getItem("marcados")
    m_ = JSON.parse(m_)
    for (let r = 0; r < 9; r++) {
        let row = document.createElement('tr')
        for (let n = 1; n <= 10; n++) {
            let data = document.createElement('td')
            let num = document.createElement('div')
            num.setAttribute('id', "numero_" + (r * 10 + n));
            num.setAttribute('numero', (r * 10 + n));
            //num.innerHTML = r * 10 + n
            data.appendChild(num)
            data.setAttribute('title', 'Marcar/Desmarcar N°' + (r * 10 + n))
            data.onclick = () => marcar(r * 10 + n)
            row.appendChild(data)
        }
        t.appendChild(row)
    }
    let reinicio = document.querySelector('#reinicio'),
        fnReinicio = () => {
            if (marcados.length > 0) {
                marcar(marcados[marcados.length - 1])
                setTimeout(fnReinicio, 1)
            }
        }
    if (reinicio) reinicio.onclick = fnReinicio
    document.onkeyup = e => {
        if (e.key == "b" || e.key == "B") bingo()
        else noBingo()
    }

    let marcarInicio = num => {
        if (num < m_.length) {
            marcar(m_[num])
            setTimeout(() => marcarInicio(num + 1), 1)
        }
    }
    marcarInicio(0)

}

let marcar = id => {
    let num = document.querySelector('#numero_' + id);
    let ultima = document.querySelector('.ultimo-numero>div');
    if (num && marcados.indexOf(id) > -1) {
        num.className = ''
        marcados.remover(id)
    } else {
        num.className = 'marcado'
        marcados.push(id)
    }
    ultima.parentElement.setAttribute('hidden', true)
    setTimeout(function() {
        if (marcados.length != 0) {
            ultima.parentElement.removeAttribute('hidden')
            ultima.innerHTML = marcados[marcados.length - 1]
        }
    }, 1)
    localStorage.setItem("marcados", JSON.stringify(marcados))
}

iniciar();