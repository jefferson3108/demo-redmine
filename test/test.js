var test = require('selenium-webdriver/testing');
var driver;
var homePage;
var indexPage;

var IndexPage = require('./pageObjects/indexPage');
var HomePage = require('./pageObjects/homePage');
var RegisterPage = require('./pageObjects/registerPage');
var LoginPage = require('./pageObjects/loginPage');
var ProjectPage = require('./pageObjects/projectPage');
var NewProjectPage = require('./pageObjects/newProjectPage');
var NewIssuePage = require('./pageObjects/newIssuePage');

const timeOut = 30000;

test.describe('Demo-Redmine', function () {

	var usuario = 'jefferson.ferreira';
	var senha = senha;
    var projeto = 'Prova-Tecnica-Softbox';
    var email = 'jefferson_ferreira@test.com';

    this.timeout(timeOut);

    test.before(function () {
        driver = require('./driver').getDriver();
        driver.manage().window().maximize();
        indexPage = new IndexPage(driver);
        indexPage.view()
    });

    test.after(function () {
        if (driver)
            driver.quit();
    });

    test.it('Registrar usuário', function (done) {
        var indexPage = new IndexPage(driver);
        var homePage = new HomePage(driver);
        var registerPage = new RegisterPage(driver);

        indexPage.view();
        indexPage.clickRegister();
        registerPage.informeLogin(usuario);
        registerPage.informePassword(senha);
        registerPage.informeConfirmation(senha);
        registerPage.informeFirstName('Jefferson');
        registerPage.informeLastName('Ferreira Faria');
        registerPage.informeEmail(email);
        registerPage.submit();
        driver.sleep(1000);

        homePage.verificaMsg('Your account has been activated. You can now log in.');

        homePage.clickLogout();

        done()
    });

    test.it('Realizar login', function (done) {

        var loginPage = new LoginPage(driver);
        homePage = new HomePage(driver);
        indexPage = new IndexPage(driver);

        indexPage.clickLogin();
        loginPage.informeLogin(usuario);
        loginPage.informePassword(senha);
        loginPage.clickBtnLogin();
        driver.sleep(1000);

        homePage.verificaUsuarioLogado(usuario);

        done();
    });

    test.it('Criar projeto', function (done) {

        homePage = new HomePage(driver);
        var projectPage = new ProjectPage(driver);
        var newProjectPage = new NewProjectPage(driver);

        homePage.clickProject();
        projectPage.clickNewProject();
        newProjectPage.informeName(projeto);
        newProjectPage.informeDescription('Desrição do projeto de Teste');
        newProjectPage.desmarcaTracker('Feature');
        newProjectPage.desmarcaTracker('Support');
        newProjectPage.clickCreate();
        driver.sleep(1000);

        homePage.verificaMsg('Successful creation.');

        done();
    });

    test.it('Cadastrar issues', function (done) {

        this.timeout(240000);

        homePage = new HomePage(driver);
        var projectPage = new ProjectPage(driver);
        var newIssuePage = new NewIssuePage(driver);

        homePage.selecioneProjeto(projeto);
        projectPage.clickNewIssue();

        var json = require('./arquivos/tarefas');

        json.issues.forEach(function (issue) {
            newIssuePage.informeSubject(issue.Subject);
            newIssuePage.informeDescription(issue.Description);
            newIssuePage.selecionePriority(issue.Priority);
            newIssuePage.clickCreateAndContinue();
            driver.sleep(1000);
        });

        projectPage.clickIssue();

        done();
    });

});