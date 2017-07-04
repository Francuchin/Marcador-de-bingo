'use strict'

let iniciar = () => {
    let t = document.querySelector('table')
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
    let reinicio = document.querySelector('#reinicio')
    if (reinicio) {
        reinicio.onclick = () => {
            for (let i = 0; i <= 90; i++) {
                let num = document.querySelector('#numero_' + i);
                if (num) num.className = ''
            }
        }
    }

}

let marcar = id => {
    let num = document.querySelector('#numero_' + id);
    if (num) {
        if (num.className == 'marcado')
            num.className = ''
        else
            num.className = 'marcado'
    }
}

iniciar();