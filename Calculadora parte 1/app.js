document.addEventListener("DOMContentLoaded", () => {
    const particlesContainer = document.querySelector(".particles");

    // Crear partículas
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement("span");
        particle.classList.add("particle");

        // Posición y velocidad aleatoria
        particle.style.left = Math.random() * window.innerWidth + "px";
        particle.style.top = Math.random() * window.innerHeight + "px";
        particle.dataset.vx = (Math.random() * 2 - 1) * 0.5;
        particle.dataset.vy = (Math.random() * 2 - 1) * 0.5;

        particlesContainer.appendChild(particle);
    }

    // Función de animación
    function animateParticles() {
        const calculator = document.getElementById("calculadora").getBoundingClientRect();
        const particles = document.querySelectorAll(".particle");

        particles.forEach(particle => {
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            let vx = parseFloat(particle.dataset.vx);
            let vy = parseFloat(particle.dataset.vy);

            // Actualizar posición
            x += vx;
            y += vy;

            // Rebotar en los bordes de la pantalla
            if (x <= 0 || x >= window.innerWidth - 12) vx *= -1;
            if (y <= 0 || y >= window.innerHeight - 12) vy *= -1;

            // Rebotar en la calculadora
            if (
                x + 12 > calculator.left && x < calculator.right &&
                y + 12 > calculator.top && y < calculator.bottom
            ) {
                vx *= -1;
                vy *= -1;
            }

            particle.style.left = x + "px";
            particle.style.top = y + "px";
            particle.dataset.vx = vx;
            particle.dataset.vy = vy;
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});

// Variables
const calculadora = document.getElementById('calculadora'); // Obtiene el contenedor principal de la calculadora
const resultado = document.getElementById('resultado'); // Apunta al input donde se mostrarán los resultados
let holdTimer; // Variable para almacenar el temporizador de presión prolongada

// Evento para capturar el clic en los botones de la calculadora
calculadora.addEventListener('click', (e) => {
    const boton = e.target; // Obtiene el elemento que se clicó

    // Agregar número o operación al resultado si es un botón válido
    if (boton.classList.contains('num') || boton.classList.contains('operacion')) {
        const valor = boton.innerText; // Obtiene el texto del botón

        // Evitar operadores duplicados y condiciones no válidas
        if (isOperator(valor)) {
            if (resultado.value === '' || isOperator(lastChar())) return; // Evita operadores al inicio y duplicados
        }

        if (resultado.value === '0' && !isOperator(valor)) {
            resultado.value = valor; // Si el valor es "0" y se presiona un número, se reemplaza el "0"
        } else {
            resultado.value += valor; // Agrega el valor del botón al input de resultado
        }
    }

    // Igualar y mostrar resultado al hacer clic en "="
    if (boton.id === 'igual') {
        calcularResultado(); // Llama a la función para calcular el resultado
    }
});

// Borrar el último dígito o todo si es una presión prolongada
const borrarButton = document.getElementById('borrar'); // Obtiene el botón de borrar

// Detecta si el botón se mantiene presionado
borrarButton.addEventListener('mousedown', () => {
    holdTimer = setTimeout(() => {
        resultado.value = '0'; // Borra todo el contenido después de 1 segundo
    }, 1000); // Establece un temporizador de 1 segundo
});

// Detecta cuando se suelta el botón
borrarButton.addEventListener('mouseup', () => {
    clearTimeout(holdTimer); // Limpia el temporizador al soltar el botón
    if (resultado.value.length > 1) {
        resultado.value = resultado.value.slice(0, -1); // Borra solo el último carácter si se soltó antes de 1 segundo
    } else {
        resultado.value = '0'; // Restaura a "0" si solo queda un carácter
    }
});

// Evento para capturar las teclas del teclado
document.addEventListener('keydown', (e) => {
    const key = e.key; // Obtiene la tecla presionada

    // Si la tecla es un número o punto decimal
    if (!isNaN(key) || key === '.') {
        if (resultado.value === '0') {
            resultado.value = key; // Reemplaza "0" si el primer número es digitado
        } else {
            resultado.value += key; // Agrega el número o el punto al resultado
        }
    }

    // Si la tecla es una operación matemática
    if (isOperator(key)) {
        if (resultado.value === '' || isOperator(lastChar())) return; // Evitar operadores duplicados
        resultado.value += key; // Agrega el operador al resultado
    }

    // Si la tecla es Enter, calcular el resultado
    if (key === 'Enter') {
        calcularResultado(); // Llama a la función para calcular el resultado
    }

    // Si la tecla es Backspace, borrar el último carácter
    if (key === 'Backspace') {
        if (resultado.value.length > 1) {
            resultado.value = resultado.value.slice(0, -1); // Borra el último carácter
        } else {
            resultado.value = '0'; // Restaura a "0" si solo queda un carácter
        }
    }

    // Si la tecla es Escape, limpiar toda la pantalla
    if (key === 'Escape') {
        resultado.value = '0'; // Borra todo el contenido de la pantalla y restaura a "0"
    }
});

// Función para calcular el resultado
function calcularResultado() {
    try {
        const resultadoOperacion = eval(resultado.value); // Evalúa la expresión matemática en el input

        // Verifica si el resultado es válido
        if (isNaN(resultadoOperacion) || !isFinite(resultadoOperacion)) {
            resultado.value = "Error"; // Muestra "Error" si el resultado no es válido
        } else {
            resultado.value = resultadoOperacion; // Muestra el resultado en el input
        }
    } catch {
        resultado.value = "Error"; // Muestra "Error" si ocurre un error en la evaluación
    }
}

// Función para verificar si un valor es operador
function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value); // Devuelve true si el valor es un operador
}

// Función para obtener el último carácter de la pantalla
function lastChar() {
    return resultado.value.slice(-1); // Devuelve el último carácter del input de resultado
}

















