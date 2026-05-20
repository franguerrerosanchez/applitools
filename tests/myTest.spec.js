import { SauceDemo } from '../pages/SauceDemo';
const { test } = require('@playwright/test');
const { Eyes, Target, VisualGridRunner, Configuration, MatchLevel } = require('@applitools/eyes-playwright');
//PENEQUESITO

const applitoolsConfig = require('../applitools.config.js');

const users = [
    "standard_user",
    "locked_out_user",
    "problem_user",
    "performance_glitch_user",
    "error_user",
    "visual_user"
];
const password = "secret_sauce";

const runner = new VisualGridRunner({ testConcurrency: 10 });

test.describe('SauceDemo Advanced Visual AI', () => {

    for (const user of users) {
        test(`Pruebas Avanzadas para ${user}`, async ({ page }) => {
            const sauceDemo = new SauceDemo(page);
            const eyes = new Eyes(runner);

            const config = new Configuration(applitoolsConfig);
            config.setMatchLevel(MatchLevel.Strict);
            config.setBatch({ name: 'SauceDemo E2E Visual Tests', id: process.env.APPLITOOLS_BATCH_ID }); 
            eyes.setConfiguration(config);

            try {
                await eyes.open(page, 'SauceDemo', `Usuario: ${user}`);

                await sauceDemo.goto();
                await eyes.check('Login Page', Target.window().fully());

                await sauceDemo.authentificate(user, password);
                await eyes.check('Estado Post-Login', Target.window().fully());
                await page.waitForSelector('.inventory_list', { timeout: 5000 }); 
                await eyes.check('Página principal', Target.window()
                    .fully()
                    .ignoreRegions('.shopping_cart_link')
                    .layoutRegions('.inventory_list')
                );

                await sauceDemo.elegirFiltro("za");
                await eyes.check("Filtro Z a A", Target.window()
                    .fully()
                    .matchLevel(MatchLevel.IgnoreColors)
                );

                await sauceDemo.goToCart();
                await sauceDemo.clickCheckout();
                await sauceDemo.writeInfoPerson("John", "Doe", "12345");
                await eyes.check("Datos Personales", Target.window().fully());

                await sauceDemo.clickContinue();
                await eyes.check("Datos finales de compra", Target.window().fully());

                await sauceDemo.clickFinish();
                await eyes.check("Felicidades por la compra", Target.window().fully());

                await sauceDemo.clickBackHome();
                await sauceDemo.clickBurgerMenu();
                await eyes.check("Burger menu abierto", Target.window().fully());


                await eyes.close(false);
            } catch (error) {
                console.error(`Error detectado en ${user}:`, error.message);
                await eyes.abort();
                throw error;
            }
        });
    }

    test.afterAll(async () => {
        await runner.getAllTestResults(false);
        console.log('Resultados procesados en Applitools.');
    });
});