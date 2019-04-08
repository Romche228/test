const webdriver = require("selenium-webdriver"),
        By = webdriver.By,
        Key = webdriver.Key,
        until = webdriver.until,
        promise = webdriver.promise;

const test = require('selenium-webdriver/testing');

const driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
const actions = driver.actions({bridge: true});
var assert = require('assert');

test.describe('Automated smoke testing', function() {

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

    test.it('Авторизация', function() {
        this.timeout(40000);
        driver.sleep(5000);
        //Ввод номера телефона и кода
        driver.findElement(By.xpath("//input[@type='tel']")).sendKeys('9630000009', Key.RETURN);
        driver.findElement(By.xpath("//input[@type='text']")).sendKeys('1234');     
        //Ожидание загрузки лоадера
        let loader1 = driver.findElement(By.xpath("/html/body/div[@id='root']/div[1]/img"));            
        driver.wait(until.stalenessOf(loader1) , 40000);
        //Проверка данных пользователя
        driver.findElement(By.name("name")).getAttribute("value")                                       
        .then(accountName => {
            assert.equal(accountName, "Roma")
        });
        driver.findElement(By.name("surname")).getAttribute("value")
        .then(accountSurname => {
            assert.equal(accountSurname, "Test")
        });
        driver.findElement(By.name("email")).getAttribute("value")
        .then(email => {
            assert.equal(email, "mail@mail.mail")
        });
        driver.findElement(By.xpath("//*[contains(text(), 'Сохранить')]")).click();
    });

    // test.it('Открыть/скрыть List', function() {
    //     this.timeout(40000);

    //     let closeListButton = driver.findElement(By.xpath("//aside[2]/div"));
    //     //Сравнение стандартного размера недельного календаря        
    //     driver.findElement(By.xpath("//div[@class='index-ws']")).getCssValue("left")
    //     .then(weekCalendarWidth => {
    //         assert.equal(weekCalendarWidth, "660px");    
    //     });
    //     closeListButton.click();
    //     //Сравнение размера недельного календаря при закрытом List'е
    //     driver.findElement(By.xpath("//div[@class='index-ws']")).getCssValue("left")
    //     .then(weekCalendarWidth => {
    //        assert.equal(weekCalendarWidth, "268px");    
    //     });
    //     closeListButton.click();
    //     //Отображение записей в List'e
    //     driver.findElement(By.xpath("//div[@class='drag-source']/div"));
    // });

    test.it('Создание записей через Menu', function() {
        this.timeout(40000);
        //Создание записей
        function entryCreate(entryText) {
            driver.findElement(By.xpath("//*[contains(text(), 'Новая запись')]")).click();
            //Ввод текста в RichText
            driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(entryText);
            driver.sleep(1000);
            driver.findElement(By.xpath("//*[contains(text(), 'Закрыть')]")).click();
        }

        //Проверка превью события в List'е
        function checkEntryCreate(entryText, expectedEventArrow) {
            //Поиск события по контенту и проверка даты и времени события в eventArrow
            driver.findElement(By.xpath("//div[@class='drag-source']//p[text()='" + entryText + "']/../../../../div[@data-event-editor-info]")).getText()
            .then(eventArrow => {
                assert.equal(eventArrow, expectedEventArrow)
            });
        }
        
        entryCreate('Событие 21 марта');
        checkEntryCreate('Событие 21 марта', '21 марта 2020 г.\n09:00 - 09:30');
        entryCreate('Событие 20 марта');
        checkEntryCreate('Событие 20 марта', '20 марта 2020 г.\n09:00 - 09:30');
    });

    // test.it("Открытие контекстного редактора записи в List'е", function() {
    //     this.timeout(40000);
    //     //Высота первой записи
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]")).getCssValue("height")
    //     .then(entryHeight => {
    //         assert.equal(entryHeight, "128px");
    //     });
    //     //Положение второй записи в List'е
    //     driver.findElement(By.xpath("//div[@class='drag-source'][2]")).getCssValue("top")
    //     .then(entryHeight => {
    //         assert.equal(entryHeight, "178px");
    //     });
    //     driver.findElement(By.xpath("//p[text()='Событие 21 марта']")).click();
    //     driver.sleep(2000);
    //     //Высота первой записи в открытом контекстном редакторе
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]")).getCssValue("height")
    //     .then(entryHeight => {
    //         assert.equal(entryHeight, "158px");
    //     });
    //     //Положение второй записи в List'е при открытом контекстном редакторе первой записи
    //     driver.findElement(By.xpath("//div[@class='drag-source'][2]")).getCssValue("top")
    //     .then(entryTop => {
    //         assert.equal(entryTop, "208px");
    //     });
    //     driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();    
    // });

    // test.it('Жирный текст в контекстном редакторе', function() {
    //     this.timeout(40000);
    //     //Открытие контекстного редактора
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//p[text()]")).click();
    //     driver.findElement(By.xpath("//button[@title='BOLD']")).then(boldButton => {
    //         boldButton.click();
    //         driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(' Bold Text');
    //         driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();    
    //     });
    //     //Проверка жирного текста в записи
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//strong")).getText()
    //     .then(boldText => {
    //         assert.equal(boldText, " Bold Text")
    //     });
    //     //Открытие контекстного редактора
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//p[text()]")).click();
    //     //Удаление жирного текста
    //     driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(Key.DELETE, Key.DELETE, Key.DELETE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE);
    // });

    // test.it('Курсивный текст в контекстном редакторе', function() {
    //     this.timeout(40000);
    //     driver.findElement(By.xpath("//button[@title='ITALIC']")).then(italicButton => {
    //         italicButton.click();
    //         driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(' Italic Text');
    //         driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();
    //     });
    //     //Проверка курсива в записи
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//em")).getText()
    //     .then(italicText => {
    //         assert.equal(italicText, " Italic Text")
    //     });
    //     //Открытие контекстного редактора
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//p[text()]")).click();
    //     //Удаление курсивного текста
    //     driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(Key.DELETE, Key.DELETE, Key.DELETE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE);
    // });

    // test.it('Подчеркнутый текст в контекстном редакторе', function() {
    //     this.timeout(40000);
    //     driver.findElement(By.xpath("//button[@title='UNDERLINE']")).then(underlineButton => {
    //         underlineButton.click();
    //         driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(' Underline Text');
    //         driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();
    //     });
    //     //Проверка подчеркнутого текста в записи
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//ins")).getText()
    //     .then(underlineText => {
    //         assert.equal(underlineText, " Underline Text")
    //     });
    //     //Открытие контекстного редактора
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//p[text()]")).click();
    //     //Удаление подчеркнутого текста
    //     driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(Key.DELETE, Key.DELETE, Key.DELETE, Key.DELETE, Key.DELETE, Key.DELETE, Key.DELETE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE);
        
    // });

    // test.it('Чек-лист в контекстном редакторе', function() {
    //     this.timeout(40000);
    //     driver.findElement(By.xpath("//button[@title='list-item-checked']")).then((checklistButton) => {
    //         checklistButton.click();
    //         driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys('\nВторая задача\nТретья задача\nЧетвертая задача');
    //         driver.findElement(By.xpath("//div[@data-contents='true']//div[1]//div[1]//span[1]//input[1]")).click();
    //         driver.findElement(By.xpath("//div[@data-contents='true']//div[3]//div[1]//span[1]//input[1]")).click();
    //         driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();
    //     });
    //     //Проверка, выполненные ли первая и третья задачи
    //     driver.findElement(By.xpath("//span[text()='Событие 21 марта']")).getAttribute('class')
    //     .then(textClass => {
    //         assert.equal(textClass, "check-box-done");
    //     });
    //     driver.findElement(By.xpath("//span[text()='Третья задача']")).getAttribute('class')
    //     .then(textClass => {
    //         assert.equal(textClass, "check-box-done");
    //     });
    //     //Проверка, невыполненные ли вторая и четвертая задачи
    //     driver.findElement(By.xpath("//span[text()='Вторая задача']")).getAttribute('class')
    //     .then(textClass => {
    //         assert.equal(textClass, "check-box-undone");
    //     });
    //     driver.findElement(By.xpath("//span[text()='Четвертая задача']")).getAttribute('class')
    //     .then(textClass => {
    //         assert.equal(textClass, "check-box-undone");
    //     });
    // });

    // test.it('Скрытие/отображение выполненных задач', function() {
    //     //Открытие контекстного редактора
    //     driver.findElement(By.xpath("//ul[@class='checklist']/li[4]")).click();
    //     //Скрытие выполненных задач
    //     driver.findElement(By.xpath("//h6")).click();
    //     //Провера на текст в шапке
    //     driver.findElement(By.xpath("//h6")).getAttribute("content")
    //     .then(headerText => {
    //         assert.equal(headerText, "\\25b8  Сделать: 2 / 4 сделано");
    //     });
    //     //Провера на число отображаемых задач
    //     driver.findElements(By.xpath("//div[@class='thin-scrollbar sc-gPEVay jBbMDo']//section[@class='sc-brqgnP gFbSXS']/div/div/div"))
    //     .then(checkList => {
    //         assert.equal(checkList.length, "2");
    //     });
    //     driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();

    //     //Провера, невыполненные ли первая и вторая задачи
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//ul[@class='checklist']/li[1]/span")).getAttribute("class")
    //     .then(task => {
    //         assert.equal(task, "check-box-undone");
    //     });
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//ul[@class='checklist']/li[2]/span")).getAttribute("class")
    //     .then(task => {
    //         assert.equal(task, "check-box-undone");
    //     });
    //     //Открытие контекстного редактора
    //     driver.findElement(By.xpath("//ul[@class='checklist']/li[2]")).click();
    //     //Отмена скрытия выполненных задач
    //     driver.findElement(By.xpath("//h6")).click();
    //     //Провера на число отображаемых задач
    //     driver.findElements(By.xpath("//div[@class='thin-scrollbar sc-gPEVay jBbMDo']//section[@class='sc-brqgnP gFbSXS']/div/div/div"))
    //     .then(checkList => {
    //         assert.equal(checkList.length, "4");
    //     });
    // });
    
    // test.it('Удаление задач в чек-листе', function() {
    //     this.timeout(40000);
    //     //Установить курсор на конец четвертой задачи
    //     driver.findElement(By.xpath("//section[@class='sc-brqgnP gFbSXS']/div[4]/div/div")).click();
    //     //Удаление четвертой задачи через удаление текста
    //     driver.findElement(By.xpath("//div[@class='notranslate public-DraftEditor-content']")).sendKeys(Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE);
    //     //Проверка на текст в шапке
    //     driver.findElement(By.xpath("//h6")).getAttribute("content")
    //     .then(headerText => {
    //         assert.equal(headerText, "\\25be  Сделать: 2 / 3 сделано");
    //     });
    //     //Удаление третьей задачи через кнопку удаления
    //     driver.findElement(By.xpath("//div[3]/div/span[@class='sc-cvbbAY fbjzgb']/button[@class='sc-hSdWYo cNHIZT']")).click();
    //     //Проверка количества оставшихся задач по числу чек-боксов
    //     driver.findElements(By.xpath("//div[@class='thin-scrollbar sc-gPEVay jBbMDo']/..//input"))
    //     .then(checkboxNumber => {
    //         assert.equal(checkboxNumber.length, 2);
    //     });
    //     //Удаление второй задачи через кнопку удаления
    //     driver.findElement(By.xpath("//div[2]/div/span[@class='sc-cvbbAY fbjzgb']/button[@class='sc-hSdWYo cNHIZT']")).click();
    //     //Проверка на оставшийся в чек-листе текст
    //     driver.findElement(By.xpath("//div[@class='thin-scrollbar sc-gPEVay jBbMDo']/..//section")).getText()
    //     .then(checklistText => {
    //         assert.equal(checklistText, "Событие 21 марта");
    //     });
    //     //Сделать задачу обычной строкой кликом по кнопке создания чек-листа
    //     driver.findElement(By.xpath("//button[@title='list-item-checked']")).click();
    //     //Проверка текста вне чек-листа
    //     driver.findElement(By.xpath("//div[@class='thin-scrollbar sc-gPEVay jBbMDo']//div[@class='notranslate public-DraftEditor-content']/div/div/div")).getText()
    //     .then(entryText => {
    //         assert.equal(entryText, "Событие 21 марта");
    //     })
    //     driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();

    //     //Проверка текста вне чек-листа в превью записи
    //     driver.findElement(By.xpath("//div[@class='drag-source'][1]//p")).getText()
    //     .then(entryText => {
    //         assert.equal(entryText, "Событие 21 марта");
    //     })
    // });

    // test.it("Открытие EntryEditor'а через превью записи в List'е", function() {
    //     this.timeout(40000);
    //     //Проверки открытия EntryEditor'а
    //     function checkOpenEntry(expectedEventArrow, expectedEntryText) {
    //         //Проверка даты события
    //         driver.findElement(By.xpath("//div[@class='row']//div[@data-event-editor-info]")).getText()
    //         .then(function(actualEventArrow) {
    //             assert.equal(actualEventArrow, expectedEventArrow);
    //         });
    //         //Проверка контента записи
    //         driver.findElement(By.xpath("//div[@class='row']//div[@class='DraftEditor-root']")).getText()
    //         .then(function(actualText) {
    //             assert.equal(actualText, expectedEntryText);
    //         });
    //         //Проверка изменения URL 
    //         driver.getCurrentUrl()
    //         .then(currentUrl => {
    //             assert.notEqual(currentUrl, "https://web.alpha.simplanum.com/");
    //         });
    //         driver.findElement(By.xpath("//*[contains(text(), 'Закрыть')]")).click();
    //     }
        
    //     //Открытие первой записи List'а через кнопку в превью
    //     let entryOpenButton = driver.findElement(By.xpath("//div[@class='drag-source'][1]/div/div[1]"));
    //     driver.actions()
    //           .mouseMove(entryOpenButton)
    //           .click()
    //           .perform();
    //     checkOpenEntry('21 марта 2020 г.\n09:00 - 09:30', 'Событие 21 марта');
    //     //Открытие записи второй записи List'а даблкликом
    //     let entryContent = driver.findElement(By.xpath("//div[@class='drag-source'][2]/div/div[3]"));
    //     driver.actions()
    //           .doubleClick(entryContent)
    //           .perform();
    //     checkOpenEntry('20 марта 2020 г.\n09:00 - 09:30', 'Событие 20 марта');
    // });

    test.it("Отметить запись выполненной", function() {
        this.timeout(40000);
        //Отметить первую запись выполненной
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[@title='Сделано!']")).click();
        //Проверка на зачеркнутый текст
        driver.findElement(By.xpath("//div[@class='drag-source'][1]/div[1]/div[3]/div[1]")).getCssValue("text-decoration")
        .then(done => {
            assert.equal(done, "line-through solid rgb(47, 146, 138)");
        });
        //Проверка на изображение кнопки "Сделано!"
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[@title='Сделано!']")).getCssValue("background")
        .then(done => {
            assert.equal(done, "rgba(0, 0, 0, 0) url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAAEc4A0XAAAABGdBTUEAALGPC/xhBQAAAU5JREFUKBVjYEAGXv0PHyD4nv0PkhA8KMtzwqPHKILu/Q8k4QJuPfc1wByvCQ9XwTlAEUa4EjQGSBEzC9NeBqBt05BtBEl49j96hKaegQFktGf/w/sYEvgEnPpuSjPhUgAyjf0/uxhWeZCkV99dXbCk14RH/5FVgSTduu/owMSYvn34ywlTBHbkXwbvXaUqV2AKwOHg0HCfg0uA+fufP381d5Uo3oBJgmicAYWsCJ0NCisWZqYdQLcdIckAcOgzM21nZGBk/ffnj9eOUqVLjB59DwIZmBhZdhTIr0a3CcaHaWRgZGRh/Pfba1uR8mWYHKNb90VuFlaB+UDfhP7//y95e6HCPJgkXCMDI/O///89dxbJX4XJwWi4FyABxbQIZBDDv//dwNAJBipi/sXw33NPocJ1mAZ0Gm4ATAJkECc/U8Z/xr/bdxQo3YSJ46IBkD987kFhjPUAAAAASUVORK5CYII=\") no-repeat scroll 0% 0% / contain padding-box border-box");
        });

        //Отметить первую запись невыполненной
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[@title='Сделано!']")).click();
        //Проверка на незачеркнутый текст
        driver.findElement(By.xpath("//div[@class='drag-source'][1]/div[1]/div[3]/div[1]")).getCssValue("text-decoration")
        .then(undone => {
            assert.equal(undone, "none solid rgb(47, 146, 138)");
        });
        //Проверка на изображение кнопки "Сделано!"
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[@title='Сделано!']")).getCssValue("background")
        .then(undone => {
            assert.equal(undone, "rgba(0, 0, 0, 0) url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAAEc4A0XAAAABGdBTUEAALGPC/xhBQAAASxJREFUKBWVkkFKw0AUhjPTFhQ3WQmSCyjoQVpXIl6gQmKSS2SfvSEJKLisB6gbd55AK+qqouQMQhKS/hPmTadTI5jNzPu///0z84hl6V+e55/rOsuy6bqSO4jfG2KapgdKQHHYFUiaqQIKUxZjI0yc80cLHdf6iQJA+zL8ljDOYFxugb+EJEkc3meQafu/cgFxl5MO4uxWdwmI6GPSeFEUu2QSsGmaU9/3F2To5hBF0Y7jOD+AR57nvRMUa++gdJO5l0N8aNv26V8BopExNkfgqK7rSRAEzwz3PkPSEFe7N0+iWmscwjuB94UYi+N4z7btWwgXgJeu694QpEacOgAbg70So1U9QQ7qTgRhWDF+lHPsB2VZjsMwfKMGc1UBBGTQVVVVc7zxg/S+dQWjPIiwlS11NQAAAABJRU5ErkJggg==\") no-repeat scroll 0% 0% / contain padding-box border-box");
        });
    });

    test.it("Отметить запись выполненной в контекстном редакторе", function() {
        this.timeout(40000);
        //Проверка выполнена ли запись
        function checkEntryDone(textLocator) {
            //Проверка на зачеркнутый текст
            driver.findElement(By.xpath(textLocator)).getCssValue("text-decoration")
            .then(done => {
                assert.equal(done, "line-through solid rgb(47, 146, 138)");
            });
            //Проверка на изображение кнопки "Сделано!"
            driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[@title='Сделано!']")).getCssValue("background")
            .then(done => {
                assert.equal(done, "rgba(0, 0, 0, 0) url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAAEc4A0XAAAABGdBTUEAALGPC/xhBQAAAU5JREFUKBVjYEAGXv0PHyD4nv0PkhA8KMtzwqPHKILu/Q8k4QJuPfc1wByvCQ9XwTlAEUa4EjQGSBEzC9NeBqBt05BtBEl49j96hKaegQFktGf/w/sYEvgEnPpuSjPhUgAyjf0/uxhWeZCkV99dXbCk14RH/5FVgSTduu/owMSYvn34ywlTBHbkXwbvXaUqV2AKwOHg0HCfg0uA+fufP381d5Uo3oBJgmicAYWsCJ0NCisWZqYdQLcdIckAcOgzM21nZGBk/ffnj9eOUqVLjB59DwIZmBhZdhTIr0a3CcaHaWRgZGRh/Pfba1uR8mWYHKNb90VuFlaB+UDfhP7//y95e6HCPJgkXCMDI/O///89dxbJX4XJwWi4FyABxbQIZBDDv//dwNAJBipi/sXw33NPocJ1mAZ0Gm4ATAJkECc/U8Z/xr/bdxQo3YSJ46IBkD987kFhjPUAAAAASUVORK5CYII=\") no-repeat scroll 0% 0% / contain padding-box border-box");
            });
        }
        //Проверка невыполнена ли запись
        function checkEntryUndone(textLocator) {
            //Проверка на незачеркнутый текст
            driver.findElement(By.xpath(textLocator)).getCssValue("text-decoration")
            .then(undone => {
                assert.equal(undone, "none solid rgb(47, 146, 138)");
            });
            //Проверка на изображение кнопки "Сделано!"
            driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[@title='Сделано!']")).getCssValue("background")
            .then(undone => {
                assert.equal(undone, "rgba(0, 0, 0, 0) url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAAEc4A0XAAAABGdBTUEAALGPC/xhBQAAASxJREFUKBWVkkFKw0AUhjPTFhQ3WQmSCyjoQVpXIl6gQmKSS2SfvSEJKLisB6gbd55AK+qqouQMQhKS/hPmTadTI5jNzPu///0z84hl6V+e55/rOsuy6bqSO4jfG2KapgdKQHHYFUiaqQIKUxZjI0yc80cLHdf6iQJA+zL8ljDOYFxugb+EJEkc3meQafu/cgFxl5MO4uxWdwmI6GPSeFEUu2QSsGmaU9/3F2To5hBF0Y7jOD+AR57nvRMUa++gdJO5l0N8aNv26V8BopExNkfgqK7rSRAEzwz3PkPSEFe7N0+iWmscwjuB94UYi+N4z7btWwgXgJeu694QpEacOgAbg70So1U9QQ7qTgRhWDF+lHPsB2VZjsMwfKMGc1UBBGTQVVVVc7zxg/S+dQWjPIiwlS11NQAAAABJRU5ErkJggg==\") no-repeat scroll 0% 0% / contain padding-box border-box");
            });
        }

        //Открытие контекстного редактора
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//p")).click();
        //Отметить первую запись выполненной
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[1]/div[@title='Сделано!']")).click();
        //Проверка, выполнена ли запись в контекстном редакторе
        checkEntryDone("//div[@class='drag-source'][1]//div[2]/div[1]/div[1]");
        driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();
        //Проверка, выполнена ли запись в превью записи
        checkEntryDone("//div[@class='drag-source'][1]/div[1]/div[3]/div[1]");
        
        //Открытие контекстного редактора
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//p")).click();
        //Отметить первую запись невыполненной
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[@title='Сделано!']")).click();
        //Проверка, невыполнена ли запись в контекстном редакторе
        checkEntryUndone("//div[@class='drag-source'][1]//div[2]/div[1]/div[1]");
        driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();
        //Проверка, невыполнена ли запись в превью записи
        checkEntryUndone("//div[@class='drag-source'][1]/div[1]/div[3]/div[1]");
    });

    test.it("Выбор цветовой схемы записи", function() {
        this.timeout(40000);
        let colorArr = ['#2f928a', '#f0580d', '#fc321d', '#7466a8', '#ffab09', '#a27f5f', '#155588', '#e9435b', '#88b12d', '#adadad'];

        //Переход к блоку первого события в недельном календаре через eventArrow
        driver.findElement(By.xpath("//div[@class='drag-source'][1]//div/div/div[5]")).click();

        for(let colorNum = 1; colorNum < colorArr.length; colorNum++) {
            //Открытие контекстного редактора
            driver.findElement(By.xpath("//div[@class='drag-source'][1]//p")).click();
            //Нажать кнопку "Выбрать цветовую схему"
            driver.actions()
                .click(driver.findElement(By.xpath("//div[@class='drag-source'][1]//img[@title='Выбрать цветовую схему']")))
                .perform();
            driver.actions()
                .click(driver.findElement(By.xpath("//span/ul/li[" + colorNum + "]")))
                .perform();
            //div[@class='drag-source'][1]//div[3]/div/span

            //Проверка цвета текста в контекстном редакторе
            driver.findElement(By.xpath("//div[@class='drag-source'][1]//div[3]//span/span")).getCssValue("color")
            .then(textColor => {
                assert.equal(textColor, colorArr[colorNum]);
            });
            driver.findElement(By.xpath("//*[contains(text(), 'Готово')]")).click();   

            //Проверка цвета текста в превью записи
            driver.findElement(By.xpath("//div[@class='drag-source'][1]/div[1]/div[3]/div[1]")).getCssValue("color")
            .then(textColor => {
                assert.equal(textColor, colorArr[colorNum]);
            });
            //Проверка цвета eventArrow
            driver.findElements(By.xpath("//div[@class='drag-source'][1]//div[@data-event-editor-info]/div"))
            .then(partsEventArrow => {
                assert.equal(partsEventArrow[0].getAttribute('class'), "event-label-before color-" + colorNum + " future");
                assert.equal(partsEventArrow[1].getAttribute('class'), "event-label-background color-" + colorNum + " future");
                assert.equal(partsEventArrow[2].getAttribute('class'), "event-label-after color-" + colorNum + " future");
            });
            //Проверка цвета блока события
            driver.findElement(By.xpath("//div[@class='daysContainer']/div[5]/div[1]/div[1]/div[2]")).getCssValue("background-color")
            .then(eventBlockColor => {
                assert.equal(eventBlockColor, colorArr[colorNum])
            });
        } 
    });

    test.it("Удаление записи через превью", function() {
        this.timeout(40000);
        //Удаление первой записи в List'е num раз
        function entryDelete(num) {
            //Определение изначального числа записей
            driver.findElements(By.xpath("//div[@class='drag-source']/div"))
            .then(allEntries => {
                for(let deletedEntries = 1; deletedEntries <= num; deletedEntries++) {
                    //Действия удаления первой записи List'а через превью
                    driver.actions()
                          .click(driver.findElement(By.xpath("//div[@class='drag-source'][1]//span/span")))
                          .perform();
                    driver.actions()
                          .click(driver.findElement(By.xpath("//div[@class='drag-source']/div/div/span/div//span[text()='Удалить']")))
                          .perform();
                    driver.actions()
                          .click(driver.findElement(By.xpath("//div[@id='modal-content']//button[text()='Удалить']")))
                          .perform();
                    //Проверка на число отображаемых записей после удаления
                    driver.findElements(By.xpath("//div[@class='drag-source']/div"))
                    .then(actualEntries => {
                        assert.equal(actualEntries.length, allEntries.length - deletedEntries);
                    });
                }
            });
        }
        //Удаление двух первых записей
        entryDelete(2);
    });
});
    
    //driver.wait(webdriver.until.titleIs('webdriver - Google Search'), 1000).then(() => driver.quit());