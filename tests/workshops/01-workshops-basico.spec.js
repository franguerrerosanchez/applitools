// tests/workshops/01-workshops-basico.spec.js

// ----------------------------------------------------------------------------------
// CONFIGURACIÓN INICIAL Y DEPENDENCIAS
// ----------------------------------------------------------------------------------

// Cargamos las variables de entorno desde el archivo .env oculto. 
// Es vital para que Applitools lea la 'APPLITOOLS_API_KEY' de forma segura.
require('dotenv').config();

// Importamos el motor principal de pruebas de Playwright.
const { test } = require('@playwright/test');

// Importamos las herramientas clave del SDK de Applitools para Playwright:
// - Eyes: Es el "fotógrafo" principal que gestionará la sesión visual.
// - Target: Define "qué" vamos a fotografiar (una ventana, un elemento, etc.).
const { Eyes, Target } = require('@applitools/eyes-playwright');

// ----------------------------------------------------------------------------------
// BLOQUE DEL TEST (WORKSHOP 1)
// ----------------------------------------------------------------------------------

test('Workshop 1 - Anatomía del Test Visual', async ({ page }) => {
    
    // 1. NAVEGACIÓN
    // Usamos Playwright de forma estándar para llevar al navegador al estado 
    // exacto que queremos someter a validación visual.
    await page.goto('https://demo.applitools.com/');

    // Creamos la instancia de Eyes. 
    // A partir de aquí, esta variable es nuestra conexión con la nube de Applitools.
    const eyes = new Eyes();

    // 2. INICIALIZACIÓN (Abriendo los ojos)
    // Conecta Playwright con Applitools y prepara el "cajón" en el Dashboard 
    // donde se guardarán los resultados. Le pasamos 3 configuraciones clave:
    await eyes.open(page, {
        // appName: Agrupa lógicamente los tests en el Dashboard.
        appName: 'Mi App', 
        // testName: El nombre específico que tendrá la Baseline de esta prueba.
        testName: 'Workshop 1 - Anatomía del Test Visual',
        // viewportSize: Estandariza la resolución de la pantalla. Esto evita que
        // la prueba falle si un desarrollador la lanza en un monitor más grande que otro.
        viewportSize: { width: 1280, height: 720 },
    });

    // 3. CHECKPOINT (El corazón del test)
    // Envía el DOM (código HTML) y el CSS actual de la página a los servidores de Applitools 
    // para que su IA lo renderice y lo compare.
    // Usamos 'Target.window().fully()' para obligar a Playwright a hacer scroll de arriba
    // a abajo y capturar toda la web, no solo la parte visible en el monitor.
    await eyes.check('Checkpoint - Página completa', Target.window().fully());

    // 4. CIERRE Y REPORTE
    // Le indica a Applitools que la prueba ha terminado. 
    // En este punto, la IA procesa la imagen, la compara con la Baseline 
    // y devuelve el veredicto final (Passed o Unresolved).
    await eyes.close();
});