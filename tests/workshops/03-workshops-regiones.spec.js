// tests/workshops/03-workshops-regiones.spec.js

require('dotenv').config(); // Carga tu APPLITOOLS_API_KEY desde el archivo .env
const { test } = require('@playwright/test');
const { ClassicRunner, Eyes, Target, Configuration } = require('@applitools/eyes-playwright');

test.describe('Workshop 3: Regiones Inteligentes y Gestión de Ruido', () => {
    let eyes;
    let runner;
    let conf;

    test.beforeAll(async () => {
        // Inicializamos el runner clásico de Applitools
        runner = new ClassicRunner();
    });

    test.beforeEach(async ({ page }) => {
        eyes = new Eyes(runner);
        conf = new Configuration();
        
        // Configuración de la app y resolución del navegador para el taller
        conf.setAppName('Mi App Bancaria');
        conf.setViewportSize({ width: 1280, height: 720 });
        eyes.setConfiguration(conf);

        // PASO CLAVE: Navegamos a la versión 1 para establecer nuestra Baseline limpia
        // (Luego para probar los fallos dinámicos la cambiaremos a /app_v2.html)
        await page.goto('https://demo.applitools.com/app.html');
    });

    test('Control milimétrico con Regiones Codificadas Reales', async ({ page }) => {
        // Iniciamos el test visual en la nube
        await eyes.open(page, conf.getAppName(), 'Workshop 3 - Demostración en Vivo');

        // Realizamos la captura aplicando los selectores CSS reales detectados en el HTML
        await eyes.check('Panel Bancario', Target.window().fully()
            
            // 1. REGIÓN DE IGNORADO (.ignore)
            // Es la clase real de la caja que envuelve los bloques de dinero (saldos).
            // La IA ignorará cualquier cambio numérico aquí dentro para evitar falsos positivos.
            .ignore(page.locator('.element-balances'))
            
            // Aquí Ignoramos también el reloj/alerta
            .ignore(page.locator('.alert, #time'))
            // 2. REGIÓN FLOTANTE (.floating)
            // Es la clase real del contenedor de los botones superiores ("Add Account", etc.).
            // Le da flexibilidad a la IA por si estos botones se mueven unos píxeles según la pantalla.
            .floating(page.locator('.element-actions'), 10, 10, 5, 5)
            
            // 3. REGIÓN ESTRICTA (.strict)
            // Apunta directamente a la etiqueta de la tabla de transacciones recientes.
            // Aquí vigilamos con lupa: cualquier cambio en texto, descripción o icono saltará como bug.
            .strict(page.locator('table'))
        );

        // Cerramos la sesión enviando los datos para el análisis visual
        await eyes.closeAsync();
    });

    test.afterAll(async () => {
        // Vuelca de manera estructurada los resultados del test en la consola
        await runner.getAllTestResults(false);
    });
});