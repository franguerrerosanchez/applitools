// tests/workshops/02-workshops-match-levels.spec.js

// ----------------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL Y DEPENDENCIAS
// ----------------------------------------------------------------------------------
require('dotenv').config(); // Carga la API Key de Applitools desde el archivo .env oculto.
const { test } = require('@playwright/test');

// Importamos las herramientas de Applitools. 
// Novedad en este workshop: Importamos 'MatchLevel' para poder cambiar el algoritmo de la IA.
const { ClassicRunner, Eyes, Target, Configuration, MatchLevel } = require('@applitools/eyes-playwright');

test.describe('Workshop 2: Los 4 Algoritmos (Match Levels)', () => {
    // Declaramos las variables globales que usaremos en todos los tests de este bloque
    let eyes;
    let runner;
    let conf;

    test.beforeAll(async () => {
        // Inicializamos el motor de ejecución clásico (local)
        runner = new ClassicRunner();
    });

    test.beforeEach(async ({ page }) => {
        // Preparamos el "fotógrafo" y su configuración antes de cada uno de los 4 tests
        eyes = new Eyes(runner);
        conf = new Configuration();
        
        // Agrupamos estas pruebas bajo el mismo nombre de App que en el Workshop 1
        conf.setAppName('Applitools Demo App');
        
        // ¡TRUCO PEDAGÓGICO PARA LA DEMOSTRACIÓN!
        // Actualmente apunta a la versión original para crear las Baselines:
        await page.goto('https://demo.applitools.com/');
        // NOTA PARA EL PROFESOR: Durante la clase, cambiaremos esta URL a '.../index_v2.html' 
        // para inyectar fallos visuales (botón azul, gráficos nuevos) y demostrar 
        // cómo reacciona cada nivel de IA a esos bugs.
    });

    // ---------------------------------------------------------------------
    // TEST 1: Nivel STRICT (Por defecto)
    // ---------------------------------------------------------------------
    // Qué hace: Es el cerebro principal de Applitools. Imita el ojo humano.
    // Detecta cambios reales de diseño, color y forma, ignorando fallos minúsculos de renderizado.
    // Resultado esperado (con v2): FALLARÁ (Unresolved) porque detecta que el botón ha cambiado de color.
    test('1. Algoritmo STRICT', async ({ page }) => {
        conf.setTestName('Workshop 2 - Nivel STRICT');
        
        // Configuramos el nivel de IA a Strict
        conf.setMatchLevel(MatchLevel.Strict);
        eyes.setConfiguration(conf);

        await eyes.open(page);
        await eyes.check('Validación Strict', Target.window().fully());
    });

    // ---------------------------------------------------------------------
    // TEST 2: Nivel LAYOUT (Estructura)
    // ---------------------------------------------------------------------
    // Qué hace: La joya de la corona para contenido dinámico. 
    // Solo mira la geometría (cajas, columnas, márgenes). Ignora colores, textos e imágenes.
    // Resultado esperado (con v2): PASARÁ (Verde) porque aunque el botón es distinto, 
    // la estructura del formulario sigue intacta.
    test('2. Algoritmo LAYOUT', async ({ page }) => {
        conf.setTestName('Workshop 2 - Nivel LAYOUT');
        
        // Configuramos el nivel de IA a Layout
        conf.setMatchLevel(MatchLevel.Layout);
        eyes.setConfiguration(conf);

        await eyes.open(page);
        await eyes.check('Validación Layout', Target.window().fully());
    });

    // ---------------------------------------------------------------------
    // TEST 3: Nivel CONTENT (Contenido)
    // ---------------------------------------------------------------------
    // Qué hace: Verifica el texto y la estructura, pero ignora los colores y estilos.
    // Es el algoritmo perfecto para webs que tienen "Modo Claro" y "Modo Oscuro".
    test('3. Algoritmo CONTENT', async ({ page }) => {
        conf.setTestName('Workshop 2 - Nivel CONTENT');
        
        // Configuramos el nivel de IA a Content
        conf.setMatchLevel(MatchLevel.Content);
        eyes.setConfiguration(conf);

        await eyes.open(page);
        await eyes.check('Validación Content', Target.window().fully());
    });

    // ---------------------------------------------------------------------
    // TEST 4: Nivel EXACT (Píxel a Píxel)
    // ---------------------------------------------------------------------
    // Qué hace: El método tradicional y obsoleto. Compara la web píxel a píxel.
    // Es tan rígido que generará alertas falsas (ruido) por cosas invisibles al ojo humano
    // (como el anti-aliasing de una fuente gráfica).
    test('4. Algoritmo EXACT', async ({ page }) => {
        conf.setTestName('Workshop 2 - Nivel EXACT');
        
        // Configuramos el nivel a Exact
        conf.setMatchLevel(MatchLevel.Exact);
        eyes.setConfiguration(conf);

        await eyes.open(page);
        await eyes.check('Validación Exact', Target.window().fully());
    });

    // ----------------------------------------------------------------------------------
    // 2. LIMPIEZA Y CIERRE
    // ----------------------------------------------------------------------------------
    test.afterEach(async () => {
        // Usamos 'closeAsync()' en lugar de 'close()'.
        // ¿Por qué? Si un test falla (encuentra diferencias), 'close()' detendría toda la ejecución.
        // 'closeAsync()' permite que Playwright siga ejecutando los siguientes algoritmos aunque uno falle.
        await eyes.closeAsync(); 
    });

    test.afterAll(async () => {
        // Recopilamos todos los resultados al final del bloque.
        // El 'false' le dice a Applitools que no lance un error masivo en la consola de Node
        // si alguna prueba ha fallado, permitiendo una salida limpia en la terminal.
        await runner.getAllTestResults(false);
    });
});