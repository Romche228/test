const webdriver = require("selenium-webdriver"),
        By = webdriver.By,
        Key = webdriver.Key,
        until = webdriver.until,
        promise = webdriver.promise;

const test = require('selenium-webdriver/testing');

const driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
const actions = driver.actions({bridge: true});
var assert = require('assert');

test.describe('Automated smoke testing', function(){

    test.before(function() {
        driver.manage().timeouts().implicitlyWait(11000);
        this.timeout(200000);
            
        driver.manage().window().maximize();
        driver.manage().setTimeouts({implicit: (20000)});
        driver.get("https://web.alpha.simplanum.com/");
    });

    test.after(function() {
        this.timeout(8000);
        //driver.quit();
    });

    test.it('Авторизация', function(){
        this.timeout(40000);
        driver.sleep(5000);
        //Ввод номера телефона и кода
        driver.findElement(By.xpath("//input[@type='tel']")).sendKeys('9503130989', Key.RETURN);
        driver.findElement(By.xpath("//input[@type='text']")).sendKeys('1234');     
        //Ожидание загрузки лоадера
        let loader1 = driver.findElement(By.xpath("/html/body/div[@id='root']/div[1]/img"));            
        driver.wait(until.stalenessOf(loader1) , 40000);
    });