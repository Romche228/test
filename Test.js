const webdriver = require("selenium-webdriver"),
        By = webdriver.By,
        Key = webdriver.Key,
        until = webdriver.until,
        promise = webdriver.promise;

const test = require('selenium-webdriver/testing');

const driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
const actions = driver.actions({bridge: true});

var assert = require('assert');

test.describe('Creating one thousand events', function () {
    test.before(function() {
    
        this.timeout(200000);
            
        driver.manage().window().maximize();
        driver.manage().setTimeouts({implicit: (20000)});
        driver.get("https://web-alpha.simplanum.com/");
    });

    test.after(function() {
        this.timeout(8000);
        //driver.quit();
    });

    test.it('Login', function() {
        this.timeout(40000);
        
        driver.findElement(By.xpath("//input[@type='tel']")).sendKeys('9630000009', Key.RETURN);
        driver.findElement(By.xpath("//input[@type='text']")).sendKeys('1234');

        let loader1 = driver.findElement(By.xpath("/html/body/div[@id='root']/div[1]/img"));
        driver.wait(until.stalenessOf(loader1) , 40000);
    });

    test.it('Create new notebook', function() {
        this.timeout(20000);

        driver.findElement(By.xpath("//button[@type='submit']")).click();

        var notebookField = driver.findElement(By.xpath("//span[text()='+']/../input"));
        notebookField.sendKeys('Billion notes', Key.RETURN);
    });

    test.it('Open Month Cal', function() {
        this.timeout(200000);
        driver.findElement(By.xpath("//div[@class='sc-iGPElx cAacFH']/aside[1]/div[2]")).click();  //непостоянное говно
     });
    
    test.it('Creating thousand events', function() {
        this.timeout(36000000);
        
        driver.findElement(By.xpath("//aside[@class='sc-iQNlJl eVQVtp']/button[@class='sc-gwVKww itjbeO']")).click();
        let monthName = driver.findElement(By.xpath("//section/aside/span"));
        driver.wait(until.elementTextIs(monthName, "декабрь 2018 г.") , 40000);

        console.log("TEST");
        for (let i = 1; i < 43; i++) {
            driver.findElement(By.xpath("//div[@class='ReactVirtualized__Grid']/div[@class='ReactVirtualized__Grid__innerScrollContainer']/div[1]")).getLocation(location1 => console.log(location1 + "\n"));
        }
            //driver.findElement(By.xpath("//a/span[text()='Закрыть']")).click();
        
            //.mouseMove(driver.findElement(By.xpath("//div[@class='sc-cQFLBn jSjGxE']/span[text()='" + i + "']/../..")))
            //.mouseMove(driver.findElement(By.xpath("//div[@class='sc-cQFLBn jSjGxE']/span[text()='" + i + "']/../..//div[text()='+']")))
   
    });
});