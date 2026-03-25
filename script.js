let conteo = {};
let total = 0;

// 🔥 ENTER PARA AGREGAR
document.getElementById("nombre").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        agregar();
    }
});

// 🔥 cargar datos
window.onload = () => {
    let data = localStorage.getItem("datos");
    if (data) {
        let obj = JSON.parse(data);
        conteo = obj.conteo;
        total = obj.total;
        mostrar();
    }
};

function guardar() {
    localStorage.setItem("datos", JSON.stringify({conteo, total}));
}

function agregar() {
    let nombre = document.getElementById("nombre").value.trim().toLowerCase();
    if (!nombre) return;

    conteo[nombre] = (conteo[nombre] || 0) + 1;
    total++;

    document.getElementById("nombre").value = "";

    guardar();
    mostrar();
}

function sumar(n) {
    conteo[n]++;
    total++;
    guardar();
    mostrar();
}

function restar(n) {
    conteo[n]--;
    total--;

    if (conteo[n] <= 0) delete conteo[n];

    guardar();
    mostrar();
}

function eliminar(n) {
    total -= conteo[n];
    delete conteo[n];
    guardar();
    mostrar();
}

function editar(n) {
    let nuevo = prompt("Nuevo nombre:", n);
    if (!nuevo) return;

    nuevo = nuevo.trim().toLowerCase();

    if (conteo[nuevo]) {
        conteo[nuevo] += conteo[n];
    } else {
        conteo[nuevo] = conteo[n];
    }

    delete conteo[n];
    guardar();
    mostrar();
}

function mostrar() {
    let html = "";

    for (let n in conteo) {
        let c = conteo[n];
        let p = total > 0 ? ((c/total)*100).toFixed(2) : 0;

        html += `
        <div class="item">
            <span>${capitalizar(n)} (${c}) .. ( ${p}%)</span>
            <div>
                <button class="mas" onclick="sumar('${n}')">+</button>
                <button class="menos" onclick="restar('${n}')">-</button>
                <button class="editar" onclick="editar('${n}')">✏️</button>
                <button class="eliminar" onclick="eliminar('${n}')">❌</button>
            </div>
        </div>`;
    }

    document.getElementById("lista").innerHTML = html;
}

function capitalizar(t) {
    return t.charAt(0).toUpperCase() + t.slice(1);
}

// PDF
function generarPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let y = 10;
    doc.text("Resultados", 10, y);
    y += 10;

    for (let n in conteo) {
        let c = conteo[n];
        let p = ((c/total)*100).toFixed(2);
        doc.text(`${capitalizar(n)}: ${c} (${p}%)`, 10, y);
        y += 8;
    }

    doc.save("resultados.pdf");
}

// Excel
function generarExcel() {
    let data = [["Nombre", "Cantidad", "Porcentaje"]];

    for (let n in conteo) {
        let c = conteo[n];
        let p = ((c/total)*100).toFixed(2);
        data.push([capitalizar(n), c, p + "%"]);
    }

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados.xlsx");
}

function limpiar() {
    if (!confirm("¿Seguro que quieres borrar todo?")) return;

    conteo = {};
    total = 0;
    localStorage.removeItem("datos");
    mostrar();
}
