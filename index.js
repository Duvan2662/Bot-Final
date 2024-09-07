import puppeteer from "puppeteer";
import fs from "fs";

const data = JSON.parse(fs.readFileSync('data.json'));
console.log(data);


const navigateWebPage = async() => {

  //Abre el navegador 
  const browser = await puppeteer.launch({
    slowMo: 200,//Me permite retrasar las acciones del navegador 200 milisegundos
    headless: false,//True no deja ver lo que hace el navegador 
   });

  //Abre una nueva pagina en el navegador
  const page = await browser.newPage();
  await page.goto("https://bizblogz.com/login/");//Navega al login

  //LLenar el formulario de Login
  // Usuario
  await page.waitForSelector('#user_login'); //Espera hasta que el selector cargue en la pagina
  await page.type('#user_login', data.user);//Ingresa los datos en el selector especifico
  // Contraseña
  await page.waitForSelector('#user_pass'); //Espera hasta que el selector cargue en la pagina
  await page.type('#user_pass', data.password);//Ingresa los datos en el selector especifico
  //Enter al formulario
  await page.keyboard.press('Enter');
  await page.waitForNavigation();//Esperamos a que la pagina termine de cargar 

  //Navegar a donde se postea el blog
  await page.goto("https://bizblogz.com/submit-new-blog-post/");//Navega a donde postear


  //LLenar el formulario de Post
  // Title
  await page.waitForSelector('#blog_title'); //Espera hasta que el selector cargue en la pagina
  await page.type('#blog_title', data.title);//Ingresa los datos en el selector especifico
  //Description
  const frame = page.frames().find(frame => frame.name() === 'blog_description_ifr');//Busca el primer frame con ese id
  frame.evaluate(() => {//Me permite evaluar el frame 
    const etiquetaP = document.querySelector('p');//Busca la etiqueta parrafo en el frame 
    etiquetaP.textContent = 'Hola mundo';//Le cambia el texto al parrafo
  });
  // Tags
  await page.waitForSelector('#blog_tags'); //Espera hasta que el selector cargue en la pagina
  await page.type('#blog_tags', data.tag);//Ingresa los datos en el selector especifico
  //Img
  const fileInput = await page.$('input[type=file]');//Busca el primer input que se le pueda subir archivos
  const fileToUpload = data.img; //Ruta o path de mi imagen
  await fileInput.uploadFile(fileToUpload);//Sube la imagen

  //Enter para postear 
  await page.keyboard.press('Enter');
  // Navegar a la página de perfil
  await page.goto('https://bizblogz.com/my-profile/');

  

  // Esperar a que el enlace de Blog en la página de perfil esté disponible
  await page.waitForSelector('li.pm-profile-tab.pm-pad10.pg-blog-tab');
  // Hacer clic en el enlace de Blog en la página de perfil
  await page.click('li.pm-profile-tab.pm-pad10.pg-blog-tab');


  //Espera que el div donde se muestran los post se cargue
  await page.waitForSelector('#pg-blog-container');
  // Tomar una captura de pantalla y guardarla como screenshot.png en el directorio actual
  await page.screenshot({ path: 'screenshot.png' });



  await browser.close();//Cierra el navegador
}

navigateWebPage()