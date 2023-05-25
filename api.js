"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmr = exports.chunkAudio = exports.__beyond_pkg = exports.______Trash = exports.Audio = exports.AIBackend = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("path");
var dependency_2 = require("fs");
var dependency_3 = require("fluent-ffmpeg");
var dependency_4 = require("@beyond-js/kernel/core");
var dependency_5 = require("os");
var dependency_6 = require("openai");
var dependency_7 = require("@aimpact/backend/engines");
var dependency_8 = require("puppeteer");
var dependency_9 = require("marked");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/api"
  },
  "type": "ts"
}).package();
;
__pkg.dependencies.update([['path', dependency_1], ['fs', dependency_2], ['fluent-ffmpeg', dependency_3], ['@beyond-js/kernel/core', dependency_4], ['os', dependency_5], ['openai', dependency_6], ['@aimpact/backend/engines', dependency_7], ['puppeteer', dependency_8], ['marked', dependency_9]]);
const ims = new Map();

/***********************
INTERNAL MODULE: ./audio
***********************/

ims.set('./audio', {
  hash: 889742810,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Audio = void 0;
    var _path = require("path");
    var _chunkAudio = require("./chunk-audio");
    /*bundle */ /*actions */
    class Audio {
      async process(path) {
        try {
          const filePath = (0, _path.join)(__dirname, "/uploads", path);
          await (0, _chunkAudio.chunkAudio)(filePath, 7);
        } catch (e) {
          console.log(e);
        }
      }
    }
    exports.Audio = Audio;
  }
});

/*****************************
INTERNAL MODULE: ./chunk-audio
*****************************/

ims.set('./chunk-audio', {
  hash: 2332977797,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.chunkAudio = chunkAudio;
    var _fs = require("fs");
    var path = require("path");
    var ffmpeg = require("fluent-ffmpeg");
    var _core = require("@beyond-js/kernel/core");
    //ffmpeg.setFfmpegPath('path/to/your/ffmpeg'); // Add path to your ffmpeg executable
    const CHUNK_SIZE_MB = 10;
    /*bundle*/
    async function chunkAudio(filePath, maxSizeMB) {
      try {
        let promise = new _core.PendingPromise();
        // Check the size of the file
        const stats = await _fs.promises.stat(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        if (fileSizeInMegabytes > maxSizeMB) {
          const outputDir = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)));
          await _fs.promises.mkdir(outputDir, {
            recursive: true
          });
          // Get the duration of the file
          ffmpeg.ffprobe(filePath, function (err, metadata) {
            const duration = metadata.format.duration;
            // Calculate the number of chunks
            const numOfChunks = Math.ceil(fileSizeInMegabytes / maxSizeMB);
            console.log("total chuncks....", numOfChunks);
            const promises = [];
            // Split the file into chunks
            for (let i = 0; i < numOfChunks; i++) {
              const output = path.join(outputDir, `${i}${path.extname(filePath)}`);
              const currentPromise = new _core.PendingPromise();
              promises.push(currentPromise);
              ffmpeg(filePath).setStartTime(duration / numOfChunks * i).setDuration(duration / numOfChunks).output(output).on("end", function (err) {
                currentPromise.resolve();
                if (!err) console.log("conversion Done");
              }).on("error", function (err) {
                currentPromise.reject();
                console.log("error: ", err);
              }).run();
            }
            Promise.all(promises).then(() => {
              promise.resolve();
              console.log("finalizamos.");
            });
          });
        } else {
          console.log("File size is smaller than the max size, no need to chunk");
          promise = undefined;
          return false;
        }
        return promise;
      } catch (error) {
        console.error(`Error occurred: ${error.message}`);
      }
    }
    // chunkAudio('/path/to/your/audio/file', CHUNK_SIZE_MB);
  }
});

/******************************
INTERNAL MODULE: ./convert-path
******************************/

ims.set('./convert-path', {
  hash: 3466960461,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.convertToValidPath = convertToValidPath;
    var _os = require("os");
    function convertToValidPath(filePath) {
      const osPlatform = (0, _os.platform)();
      // Convert backslashes to forward slashes for non-Windows platforms
      if (osPlatform !== 'win32') {
        filePath = filePath.replace(/\\/g, '/');
      }
      // Resolve the path to ensure it is valid
      return filePath;
    }
  }
});

/*********************************
INTERNAL MODULE: ./files/get-files
*********************************/

ims.set('./files/get-files', {
  hash: 3349062354,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.handlePath = void 0;
    var _fs = require("fs");
    var _path = require("path");
    const isDirectory = async path => {
      try {
        const stat = await _fs.promises.lstat(path);
        return stat.isDirectory();
      } catch (e) {
        console.error(`Error while checking if the path is a directory: ${e}`);
        return false;
      }
    };
    const getSortedFiles = async dirPath => {
      let files;
      try {
        files = await _fs.promises.readdir(dirPath, {
          withFileTypes: true
        });
      } catch (e) {
        console.error(`Error while reading directory files: ${e}`);
        return [];
      }
      // filter out directories, if any
      files = files.filter(file => file.isFile());
      // sort by filename assuming filenames are numbers with mp3 extension
      files.sort((a, b) => Number(a.name.split('.')[0]) - Number(b.name.split('.')[0]));
      // create full paths
      const filePaths = files.map(file => (0, _path.join)(dirPath, file.name));
      return filePaths;
    };
    const handlePath = async path => {
      const directory = await isDirectory(path);
      if (directory) {
        const sortedFiles = await getSortedFiles(path);
        return sortedFiles;
      } else {
        // If path is not a directory, just return the file path.
        return path;
      }
    };
    // Usage:
    // handlePath('./path/to/your/directory-or-file')
    //   .then(result => {
    //     if (Array.isArray(result)) {
    //       console.log('Sorted files:', result);
    //     } else {
    //       console.log('File:', result);
    //     }
    //   })
    //   .catch(err => console.error(err));
    exports.handlePath = handlePath;
  }
});

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 3749446162,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AIBackend = void 0;
    var _openai = require("openai");
    var _path = require("path");
    var _fs = require("fs");
    var _convertPath = require("./convert-path");
    var _engines = require("@aimpact/backend/engines");
    var _pdf = require("./pdf");
    var _getFiles = require("./files/get-files");
    console.log(1, {
      apiKey: process.env.OPEN_AI_KEY
    });
    /*bundle*/
    class AIBackend {
      #configuration = new _openai.Configuration({
        apiKey: process.env.OPEN_AI_KEY
      });
      #openai = new _openai.OpenAIApi(this.#configuration);
      async models() {
        const models = await this.#openai.listModels();
        return models.data;
      }
      async completions(prompt, text) {
        const content = prompt + `\n` + text;
        try {
          const response = await this.#openai.createCompletion({
            model: _engines.davinci3,
            prompt: content,
            temperature: 0.2
          });
          return {
            status: true,
            data: response.data.choices[0].text
          };
        } catch (e) {
          console.error(e.message);
          return {
            status: false,
            error: e.message
          };
        }
      }
      async chatCompletions(messages) {
        try {
          const response = await this.#openai.createChatCompletion({
            model: _engines.gptTurboPlus,
            messages: messages,
            temperature: 0.2
          });
          return {
            status: true,
            data: response.data.choices[0].message.content
          };
        } catch (e) {
          console.error(e.message);
          return {
            status: false,
            error: e.message
          };
        }
      }
      async transcription(path, lang = "en") {
        const p = lang === "en" ? "Please, transcribe the following text in English" : "Por favor, transcribe el siguiente texto en Español";
        path = (0, _convertPath.convertToValidPath)(path);
        const filePath = (0, _path.join)(__dirname, "/uploads", path);
        try {
          const audio = (0, _fs.createReadStream)(filePath);
          const response = await this.#openai.createTranscription(
          // @ts-ignore
          audio, "whisper-1", p, "json", 0.2, lang);
          return {
            status: true,
            text: response.data.text
          };
        } catch (e) {
          const code = e.message.includes("401" ? 401 : 500);
          return {
            status: false,
            error: e.message,
            code
          };
        }
        //
      }

      async largeTranscription(path, lang = "en", prompt = undefined) {
        if (!prompt) {
          prompt = lang === "en" ? "Please, transcribe the following text in English" : "Por favor, transcribe el siguiente texto en Español";
        }
        try {
          const audio = (0, _fs.createReadStream)(path);
          const response = await this.#openai.createTranscription(
          // @ts-ignore
          audio, "whisper-1", prompt, "json", 0.2, lang);
          return {
            status: true,
            text: response.data.text
          };
        } catch (e) {
          console.error(e.message);
          return {
            status: false,
            error: e.message
          };
        }
      }
      async saveToPDF(specs) {
        try {
          const {
            lang = "en",
            name,
            path
          } = specs;
          const filePath = (0, _path.join)(__dirname, "/uploads", path);
          const transcription = await this.transcription(path, lang);
          //@ts-ignore
          await (0, _pdf.saveMarkdownAsPdf)(transcription.text, `./${name}.pdf`);
          return {
            status: true
          };
        } catch (e) {
          console.error(e);
          return {
            status: false,
            error: e.message
          };
        }
      }
      pdf() {
        const markdownContent = "# Hello, world!\nThis is a test.";
        (0, _pdf.saveMarkdownAsPdf)(markdownContent, "./test.pdf");
        return true;
      }
      async saveLargePDF(specs) {
        const {
          lang = "en",
          name,
          path
        } = specs;
        try {
          const path1 = (0, _convertPath.convertToValidPath)(path);
          const filePath = (0, _path.join)(__dirname, "/uploads", path1);
          let files = await (0, _getFiles.handlePath)(filePath);
          let texts = "";
          if (typeof files === "string") files = [files];
          let prompt;
          for (let key in files) {
            const answer = await this.largeTranscription(files[key], "es", prompt);
            if (!answer.status) {
              return;
            }
            texts += answer.text;
            if (key > 1) {
              const lastText = texts.lastIndexOf("\n");
              prompt = "This audio is a continuation of the previous one. Please, continue with the transcription.\n" + texts.slice(lastText);
            }
          }
          //   const bullets = await this.bullets(texts);
          //   await writeFileSync(`./${name}.txt`, bullets);
          //   await saveMarkdownAsPdf(bullets, `./${name}.pdf`);
        } catch (e) {
          console.error(e);
        }
      }
      async resumen(texts) {
        const t1 = `Bueno, recapitulando, la idea de la reunión de hoy es terminar de confirmar el alcance del posible proyecto, confirmar que el interés de ustedes y la motivación tenga que ver con cómo venimos entendiendo los posibles siguientes pasos. Y tras la bendición de Marcelo y la conversación de la semana que viene, definir objetivos bien acotados, tiempos, costos, etcétera, que podamos arrancar un proyecto juntos. Entonces, un poco nosotros, en lo que venimos escuchando que le interesa a alguien y le viene bien a alguien en este momento es, lo pensamos como una asistencia, todo esto con inteligencia artificial, esto es el nexo común a todo lo que voy a decir. Pero hay un bloque que tiene que ver con onboarding al IER. De vuelta, lo que venimos escuchando, después ustedes nos dicen, mira, sí, escucharon correcto, pero arranquemos solamente con esto otro. Quiero escuchar que entendieron hasta ahora y ahí vemos dónde apuntar. Nosotros entendimos, o sea, escuchamos y entendemos que le puede venir bien al IER, tres grandes aspectos. El primero tiene que ver con todo un capítulo de onboarding. ¿Onboarding a qué? Onboarding a lo que es al IER, lo que es al IER hoy, la historia del IER, cómo funciona el valor, edición, etcétera, etcétera, y todo el aspecto de sostenibilidad. Entonces, onboarding al IER, más, ¿qué quiere decir la sostenibilidad? ¿Y cuál es el compromiso del IER en sostenibilidad, puertas adentro y en el modelo de negocio? ¿Qué hace con sus productos y servicios? ¿La visión estratégica, el camino recorrido hasta ahora? ¿Qué pasa desde que hay un cambio de management y de dueños años atrás? Un poco los siguientes pasos hacia futuro, como para tener una optimización de ingresa alguien al IER y ese tiempo que tarda alguien en entender que es una nueva organización siempre es entre 6 y 12 meses, se pierde un montón de productividad, además una empresa que está creciendo en nueva fase y demás, hay un valor intangible pero muy alto de que los nuevos entrantes entren lo más rápidamente en ese tejido de lo que es al IER hoy. Entonces ahí, nuevamente, ¿qué incluiríamos ahí? Después hablamos del cómo, ¿sí? Pero ¿qué sería al IER? ¿Qué es la sostenibilidad y el compromiso del IER en esa sostenibilidad? ¿Cuál es la visión estratégica? O sea, ¿dónde está y hacia dónde quiere ir al IER? Y un onboarding, y ahí un poco suplementando lo anterior, sobre ¿qué es la inteligencia artificial? Y las oportunidades que hay en la inteligencia artificial, o sea, sería una especie de onboarding a los nuevos entrantes pero también una apretar refresh a todos los empleados de al IER hoy para que también entiendan no solamente qué es al IER sino esto nuevo de la inteligencia artificial, cómo va a permear todo lo que hacemos, ¿no? Pero fíjate que por eso lo pensamos dentro del onboarding porque es casi poner en la misma plataforma a todos los empleados y a todos los miembros de al IER. Para qué hacer un cambio cultural si directamente decís esta es mi cultura, no tengo que cambiar nada. Exacto. Entonces todo lo que es cultura y estrategia al IER pues está en un único lugar que narre historia, pasado, presente y futuro, ahí está la visión estratégica, ¿qué es la sostenibilidad? El rol del individuo, del empleado, de la persona también, no solamente lo que hace la empresa. La inteligencia artificial y hacia dónde la podemos llevar a grandes rasgos, entender por dónde viene todo esto y entonces todo esto es estrategia y cultura al IER hoy, un onboarding a eso, un onboarding no solamente a los nuevos entrantes sino para todas las personas. Bring people together en qué es al IER hoy y hacia dónde va al IER incluyendo todos los aspectos de inteligencia artificial. Eso es como una primera pata de esto que nos imaginamos, de vuelta, soportado por inteligencia artificial en una plataforma y ahora hablamos en un ratito de que es ese como, de qué nos imaginamos que podría ser ese como. La segunda pata del banco, del banquito, tiene que ver con esto que hablábamos la reunión pasada, una herramienta en donde, y esto un poco parafraseando a Marcelo, era cómo logramos que entre el miembro de al IER, la persona, por no llamar empleado, pero el que es parte de al IER como individuo y la organización, haya un matrimonio de los mejores matrimonios en donde se logre la mejor versión de cada uno`;
        const t2 = `Entonces, cómo logramos refinar el sistema actual de al IER para que cada persona y al IER mismo logren llegar a su potencial. Entonces, en ese ayudar a alcanzar el potencial nos imaginamos una herramienta donde puede haber la oportunidad de dar feedback, que podría ser de aspectos digamos de frustración y dificultad o desafío, pero realmente más orientada a sugerencias de mejora, sugerencias de innovación. Entonces, todo lo que tiene que ver con qué te gustaría o qué te imaginas que al IER podría hacer un poco diferente para que vos sientas que este es el mejor lugar en el mundo para el desarrollo de tu persona y de tu profesión. Entonces, ahí hay una mezcla de desarrollo profesional y desarrollo personal. Y ahí nos imaginamos una herramienta de vuelta, de captura de sugerencias de innovación, tanto para el management y la parte administrativa del IER como para empleados en la fábrica. Que de pronto se diga, uy, escuchan, uy, importa lo que pienso, importa mi sugerencia, importa lo que me preocupa. Desde cómo resolver para reducir riesgo de accidentes hasta qué me haría mejor en mi recreo de media hora, en la mitad del día, para que yo haga la tarde, rinda al doble. Bueno, y la tercera pata del banquito sería, de vuelta, relacionada con las otras dos, por eso son tres patas del mismo banquito nos imaginamos nosotros. Ahí está después cómo se imagina, pero esa tercera pata tiene que ver con una plataforma que permita comunicar. Desde el top management hay una necesidad o un interés de transmitir un nuevo rumbo, un nuevo logro, un nuevo mercado, un nuevo producto. Por decir algo, en el grupo de IER se está incorporando, por ejemplo, toda una nueva línea de negocios sobre reciclado de plásticos y cómo lo comunicamos para que llegue a cada empleado, ya sea para que puedan levantar la mano y decir yo quiero participar, es super motiva, o para que empiecen a decir con orgullo en la charla de café o en el cumpleaños del amigo, que mi empresa está creciendo y ahora aspiramos a ser los número uno reciclado plástico de España o Europa o el mundo y que esto genere entonces una atracción y una motivación en todos los empleados y esta es la herramienta crucial siempre para atraer y retener talento, que todos conozcan lo lindo que está pasando y lo motivador y lo inspirador del camino por delante de la empresa en la que uno está. Esa herramienta de comunicación que sea también asistida con inteligencia artificial. En resumidas cuentas, ahora hablamos un poquito del cómo. Una plataforma desde la cual se puedan lograr tres aspectos, un onboarding de poner a todos en sintonía sobre qué es IER, qué viene siendo IER, hacia dónde va IER, toda la parte estratégica, qué es la sostenibilidad, cuál es el rol de IER en la sostenibilidad, puertas afuera, puertas adentro, el rol del individuo, qué es la inteligencia artificial, en qué consiste la cultura, los valores de IER y cómo todo esto tiene que ver conmigo como individuo, persona. Esta es la primera pata del banquito, la segunda pata tiene que ver con bueno, ok, ya entendí de qué se trata donde estoy, tengo sugerencias, tengo ideas, tengo innovaciones que quiero plasmar, tengo frustraciones, tengo preocupaciones, dónde y cómo las plasmo, esa sería la segunda pata. Y la tercera es cómo me entero de manera dinámica y actualizada de cada uno de los aspectos importantes que tengo que enterarme a medida que IER evoluciona, se van logrando cada uno de los pasos. Entonces, hago pausa ahí y quiero confirmar que haya sido claro un poquito cómo delineé las tres áreas que nos imaginamos. Sí, sí, sí. Sí, al final tenía que ver con así, con un pantallazo un poco de cómo queremos encarar el cambio cultural, que está bien, o sea, creo que esto es un poco un paso atrás porque es un paso atrás en el sentido de tener una visión un poco más amplia que es hacer la presentación de IER que ya debe haber algo, pero bueno, ver cómo lo podemos mejorar. Sí me interesa un poco la parte esta que vos hablabas de cómo preparar a la organización para el próximo cambio`;
        const t3 = `¿no? Está bien porque primero tenés que ver qué es lo que tenés hoy y plantearlo bien, de manera ordenada, y después ya con eso podés plantear la proyección a futuro y todo lo que es todo lo que es el impacto que puede llegar a tener este tipo de herramientas de inteligencia artificial en algo que por ahí, claro, debe haber mucha gente que no lo ve, que dice, bueno, que a nosotros en nuestra industria o en lo que nos toca no nos va a pegar, pero sí, la idea es que hay que incorporar estas herramientas lo antes posible. Y un poco al final, el punto final. Si además esas herramientas ya me ayudan a gestionar este cambio, mejor. Porque es como le estás enseñando a una persona, che, mirá que hay que usar esta herramienta y es súper importante y te van a decir, bueno, sí, muy bonito, cuando llegue la usaré y te dicen, no entendiste, ya la estamos usando para todo esto. Todo esto que estás viendo hoy, que es todo el onboarding, que es todo esto de alcanzar tu potencial y el tema de cómo la organización se comunica, ya está basado en estas herramientas. O sea, ya te está impactando todo esto. Exactamente. Entonces, Ingembri, dejo abierto, obviamente, el micrófono para que agregues comentarios a medida que avanzo. Un poco ahora, yo sugiero hablar un poquito de cómo nos imaginamos, o sea, en qué consistiría el proyecto, pero no sé si Ingembri querés agregar algo o sigo. Si no, terminamos con la parte más funcional y podemos pasar después a una clínica, mientras tengo miedo de desviarnos antes de tiempo. Dale, perfecto. Entonces, a ver, el proyecto es un proyecto de co-diseño, de co-desarrollo. Alier, por todo el vínculo que se viene armando desde la primera conversación con Marcelo, no es un cliente X, al cual desarrollamos algo en un cuarto oscuro y entre comillas se lo vendemos. Acá sería una alianza para desarrollar algo que sea muy útil para Alier. O sea, no tenemos una cajita, un enlatado que queremos venderles y colocarles, sino que los usaríamos de asociados, de partners. Claro, al final es armar el enlatado que por ahí después podemos adaptar a otras organizaciones. Exactamente. Es un enlatado que después sea muy adaptable. Nunca va a ser un enlatado cerrado, porque justamente una de las grandes bellezas de la inteligencia artificial es su capacidad increíble de diferenciación para cada usuario. Un poquito, acá habría como toda una primera parte de diseño de lo que, de lo que, terminología de acá de vuelta, el que va a ir confirmando que yo por lo menos estoy diciéndolo de la manera más correcta e idónea es Henry, pero armar todo lo que es el knowledge base, o sea, cuál es la base de conocimiento sobre la cual vamos a estar montando cada uno de estos aspectos de la funcionalidad de esta plataforma. La que es Alier, todo esto de la inteligencia artificial. Vos dijiste, ya Alier debe tener algo de material sobre onboarding. Perfecto, lo metemos. Toda la información que está por detrás del sitio web, toda la, no, lo que, lo que no esté plasmado ahí. Entonces, acá, imagínate audios de top management, Marcelo, vos, Mateo, ¿no? Diciendo un poquito a través de nuestra herramienta de voz niños, que es este, traducir, ¿no? Desde un, desde un audio a distintas versiones de texto con bullet points o de audio, ¿no? Entonces, capturar todo lo que es necesario capturar de la base de conocimiento de lo que es Alier y hacia dónde va y qué es la sostenibilidad para Alier y digamos, todo. Es como nuestra propia wiki. Exactamente. Como nuestra. Para no, para no tener que apoyarnos exclusivamente en la información pública. Entonces, cuando, cuando instalamos un dispositivo de intercambio de diálogo, ¿no? Entre un empleado y la inteligencia artificial, que la inteligencia artificial se puede dar vuelta y decir, tengo más información que la que está disponible públicamente a noviembre del 91. Y es customizada, es información propia que tiene la organización. Exactamente, entonces, esa es la primera parte de este esfuerzo que requiere no solamente de la información, sino como lo diseñamos, como lo montamos, etcétera. Luego hay toda una, una puerta de entrada de lo que sería perfil usuario, ¿no? `;
        const t4 = `Entonces, el perfil usuario tendría que ver con qué le pedimos a cada empleado que monte en su perfil de usuario para desde ahí tener esa interacción con la inteligencia artificial, que se da vuelta y busca información en la base de conocimiento, pero al mismo tiempo, para que desde ese perfil usuario nosotros podamos promover interacciones con otros usuarios. Entonces, parte de lo que queremos lograr es romper y todo lo, parte de lo bello de esta irrupción tecnológica que estamos viviendo, es esto de poder tener conversaciones laterales, o sea, romper con esa jerarquía donde había alguien arriba de todo que proveía información y la cascadeaba, ¿no? Eso está dinamitado por las buenas razones, o sea, es mucho más alto potencial que podamos también intercambiar información entre operarios, ¿no? Entre nuevos entrantes y los que están ahí hace más tiempo, ¿no? Entonces, que el diseño ahí de vuelta es cómo diseñamos esa página de entrada del perfil de usuario para que después estas conexiones puedan realizarse de manera lateral y constructiva en red, en ecosistema, en comunidad. Parte de lo que queremos lograr y parte del cambio cultural es que vemos una comunidad Alien, ¿no? Comunidad fuerte hacia adentro, comunidad con la comunidad cercana, ¿no? O sea, si Alien está haciendo algo por el medio ambiente en su entorno, bueno, ¿qué es lo que está haciendo? Cómo puede haber más porosidad y más intercambio. Y todo esto puede ser definido o necesita ser definido con qué información vamos a pedirle al usuario para determinar su perfil y desde ahí todas las interacciones que siguen. Y luego está un poquito cuál es desde un punto de vista de programación qué interacción facilitamos, qué herramientas ofrecemos a este usuario que sean artificialmente inteligentes. O sea, vamos a poner la figura de un coach, de un buddy, ¿no? No sé si conoces el término de buddy en onboarding. O sea, cuando uno ingresa a una nueva empresa, muchas veces las que hacen buenas prácticas se asignan otro empleado que sea un poquito más senior que vos y que te pueda mostrar, o a veces es alguien exactamente... Como un supervisor o como un... Sí, no es supervisor porque al final puede ser de otra área. Es como un compañero. Un compañero, en inglés se le dice muchas veces buddy. Un buddy program. Un ché amigo. Entonces, qué perfil le damos a esa no persona con inteligencia artificial que te acompaña. Acá teníamos un ejemplo, acá en la organización, por lo menos en Alier, hay todo un programa de becas que se hace para el máster papelero. Y entonces como ya vamos por la tercer cuarta camada, siempre se les pide a los de la camada anterior que se egresaron que ayuden a los que están entrando a este año a que les cuenten su experiencia para ir transmitiendo un poco el conocimiento del proceso. Porque después ellos tienen como un tutor asignado para el tema del trabajo final del máster. Pero es como otro rol, es un rol más de acompañante en todo lo que es el proceso. No en lo que es meramente académico. Diciendo que es algo, incluso con estas herramientas se puede conseguir algo mix de estas cosas. Exactamente. Entonces, ese sería como un punto de vista de montaje de lo tecnológico. Tres elementos muy importantes. De vuelta, knowledge base, perfil usuario y cómo definir qué tenés del otro lado. Tenés un coach, tenés un buddy, tenés un qué que te acompaña. Entonces, frente a todo eso, después del diseño y la programación de esto, es cargarlo con la info y establecer cuál es el proceso y digamos la interfaz con ese usuario para que ocurra en el front end, entonces el onboarding y todas las interacciones para onboarding, la parte de feedback y cómo se da, se recibe y se proveen sugerencias, en qué áreas. Todo esto requiere un cómo canalizamos las sugerencias para orientar hacia, que no sea una hoja en blanco nada más. Bueno, esta es para la segunda parte de lo antiguo. Y para la tercera es, bueno, de top management qué tipo de comunicaciones se imaginan queriendo dar, cómo quieren que llegue a quiénes. Si esto está definido, si hay como toda una posibilidad de decir, bueno, quiero que esto llegue solamente a fábrica o quiero que esto vaya a la cartelera tal o quiero que esto vaya al evento anual de no sé qué o sea quiero que esto surja como una actividad de happy hour.`;
        const t5 = `Todo esto también, uno lo puede definir y diseñar desde esa herramienta como para que esté armado desde ahí. Así que te diría que eso es el proyecto inicial central, la idea sería cargando todo después ya en la implementación, acompañarlos a que siempre en las primeras implementaciones, sobre todo herramientas que fueron diseñadas tailor-made, customizadas, hay que acompañar en las fases de implementación y la idea sería acompañarlos de una manera ya por ahí no tan frecuente, tan intensa de dedicación, pero hasta el seguimiento anual para ver cómo el ciclo se cierra, que nos parece interesante. Bueno, entonces habría como una primera fase de desarrollo, de diseño de desarrollo importante, de cargarla en toda la data después de implementación y después de un acompañamiento que nos lleve hacia un cierre por lo menos de esta fase de trabajo con el evento anual que creo que son en octubre. Así lo vemos hoy. Miguel, un poco digamos, esta es un poco la idea es que nos den feedback sobre esto. Bien, yo por mi lado creo que es un poco lo que tenemos, obviamente me gustaría chequearlo con Marcelo, por ahí le comparto incluso la grabación, así ya tiene todo el resumen de lo que planteamos, a menos que quieran mandar algún resumen con un audio o con un transcripto y después tenemos que ver un poco también la opinión de Mateo, porque él a veces expresaba que quería ir en otra dirección o parecía, entonces hay que ver si es un poco esto lo que también busca de ese lado, sino bueno, abriremos una tercera vía, más allá de lo que propone la Fundación o este cambio cultural o estas herramientas que queremos implementar en la organización, que luego tenemos que ver hasta qué punto es únicamente Alier o incluimos al resto de los periféricos que tenemos que son un poco más de personas, pero cuando hablo de la organización en sí es un poco todos, pero esa es mi opinión, por ahí ahora me dicen, no, no, si inscribamos a Alier para hacer la prueba y después vemos con el resto. Sí, yo ahí concuerdo con tu mirada, creo que lo ideal sería que esto sea para el grupo y tal vez sí hacer de Alier el caso piloto, pero que el alcance sea el grupo, me parece que es lo que... Sí, sí, esto es como todo, o sea las otras empresas, claro, una empresa que tiene un año y medio de vida es como que no tiene tanta historia o tanta cultura como para ir a hacer un desarrollo así, en cambio la otra sí, todo lo que cuando vos hablas de pasado, presente y futuro, proyección, en eso Alier lo tiene mucho más claro que las otras empresas, pero después sí que hay una realidad que el grupo está un poco alineado en ciertas cosas, el tema de la sostenibilidad y todos los proyectos que tenemos van de la mano de la organización que tenemos hoy, con las empresas que tenemos hoy y con las que hace que crear en un futuro para seguir dando estos servicios o esta o este impacto positivo que queremos dar. Entonces es un asterisco que es para aclarar, pero que no nos lleva al punto, el punto es como lo aplicamos a Alier, o sea no hay ningún problema en circunscribirlo ahí y después vemos cómo lo compartimos con el resto, que al final los usuarios son transparentes, o sea están metidos todos en la misma organización y apuntamos todos a lo mismo. Buenísimo, bueno, yo un poco lo que sugeriría entonces, si te parece Miguel, es nosotros pasamos esto en limpio y les compartimos ya sea bullet points o un audio resumen para que también le puedas compartir a Marcelo, si él tiene el rato de, le puedes decir, la reunión arrancó en minutos cinco, con él le van a en realidad, apretamos grabación desde el comienzo. Lo previo fue charla. No se grabó, así que tendrá más o menos 30 minutos que por ahí le sirven a él escucharlo en detalle, más allá de que además le mandemos un audio resumen, pero digo creo que estaría buenísimo, lo mismo para Mateo y si te parece tratamos de apuntar a que el martes, más tardar el miércoles, tengamos una reunión ya para confirmar, o si vos tenés feedback antes nos lo mandas. Sí, sí, a ver, lo bueno es también que estamos probando esto, qué pasa cuando algún miembro de la organización no está en una de las reuniones, puede llegarle esta información de otra manera y puede dar su feedback de manera offline o asíncrona`;
        const t6 = `Perfecto, viene bien, yo creería que yo igual ahora en algún momento lo engancho, hagamos esto igual y lunes o martes seguro que tenemos un feedback o incluso antes. Sí, si vos pudieras darnos feedback a más tardar el lunes y ahí definimos entre martes y jueves cuando nos reunimos para una vez que está súper claro el scope, digamos de vuelta, cuál sería el costo, tiempos, equipo, qué necesitamos del lado de ustedes, a quién van a asignar el proyecto, bueno todo esto que sería la consecuencia de haber ya firmado scope y next steps. Dale, perfecto. Buenísimo, Miguel, Henry algún comentario al final de cierre o estamos? Está silenciado. Bueno, estaba pensando mientras hablábamos si había algo que tenía para aportar, me parece que es la síntesis de todo lo que hemos hablado, Seba. Enfatizaría sobre la base de conocimiento que creo que es el gran secreto de esta nueva era, porque mencionaste la wiki, está buena la analogía, la wiki es como algo sobre lo cual era muy difícil operar, era una herramienta que fue muy útil, pero el potencial que tiene hoy la inteligencia artificial para operar contra una base de conocimientos es muchísimo mayor. Yo diría que incluso te ayuda a armarla, no? Porque armar una wiki para una compañía, tener que poner a gente ahí a escribir, y se hace un poco tedioso. No, es que la diferencia enorme que hay entre la wiki y el knowledge base indirect, o sea, no hace falta que tenga demasiada estructura, por ejemplo, porque va a ir a buscar la inteligencia en contenido, lo va a procesar de manera inteligente, se lo va a devolver de manera inteligente al usuario, y sobre la parte de la creación, Seba mencionó, puso el título rápido y vale la pena hacer un doble click, Voice Genius, que es la herramienta que venimos desarrollando, sobre la cual creamos, por ejemplo, tomamos el audio de Marcelo el otro día y lo procesamos por ahí, en un texto y un audio increíble, y eso mismo puede ayudar mucho a las empresas de una organización a poder expresar ideas y mejorarlas muchísimo y compartirlas, y si logramos que eso sea en colaboración y se potencia todo eso y se vuelca en la base de conocimiento, entonces se empieza a crear un aporte de valor muy grande que no se sabe a dónde termina. Sí, sí, sí, tal cual. Yo le hice el análogo como para entenderlo en mi estructura mental, que es por sí un poco más anticuada, pero es tal cual, o sea, es como esta base de conocimiento de la compañía que es interna y única de cada uno, y después se conectará. Ese es nuestro wiki, entre comillas, pero tanto para la generación, porque una persona hoy con una idea, capaz que la idea está buenísima, nadie se le ocurrió, pero esa persona no tiene tanta capacidad de expresarla, de devolverla a documento y demás, y queda en un cajón virtual en su cabeza por ahí. Nadie lo escucha porque no lo entendió bien, porque no le cuesta expresarlo, y de repente si se desarrolla mejor con inteligencia artificial, se vuelca en la base de conocimiento y ya empieza a haber una estructura mucho más inteligente. Entonces empezamos a lograr una empresa inteligente asistida con la inteligencia artificial y mejorar el potencial humano con la inteligencia artificial, que es lo que buscamos en el proyecto. Bueno, entonces creo que estamos en un buen lugar para cerrar hoy, y te dejamos un poquito la pelota de tu lado Miguel, si te parece, con feedback por escrito, en un audio, de la manera que te resulte más fácil, y preferencia de día para que reconectemos martes, miércoles, yo no dejaría pasar mucho más tiempo que eso, el lunes yo estoy volviendo a la mañana, así que prefiero por ahí no, pero ya desde martes nos sugerís el siguiente touch point y lo hacemos. Dale, perfecto, las grabaciones anteriores se las pasó Mateo, no? Tienen? Si, si, lo tenemos. Bueno, yo supongo que también cuando cierre esta, veo como se los comparto, pero quedamos así. Perfecto. Bueno, gracias por tu tiempo. Gracias a ustedes. Un abrazo.`;
        let prompt = `
		Sintetice el siguiente texto para que pueda usarse para un análisis posterior y permita una visualización rápida del contenido. Incluya los puntos principales y utilice los siguientes elementos según corresponda:
		Use negrita, cursiva, subrayado u otro formato para resaltar los puntos principales y los puntos secundarios importantes.
		Utilice viñetas, tablas, gráficos o diagramas para presentar la información de forma clara y visual.
		Incluye una introducción clara y concisa que resuma el tema y los objetivos del texto.
		Incluya una conclusión que resuma las ideas principales y proporcione una descripción general del texto.
	`;
        const message = [{
          role: "system",
          content: prompt
        }, {
          role: "user",
          content: t4
        }, {
          role: "user",
          content: t5
        }, {
          role: "user",
          content: t6
        }];
        console.log("chat", message);
        const response = await this.chatCompletions(message);
        console.log("chat response", response);
        if (!response.status) {
          console.error("response chat");
        }
        await (0, _fs.writeFileSync)(`./meet/bullets2.txt`, response.data);
        return response.data;
      }
      async bullets(texts) {
        const t1 = `
	  En resumen, la reunión tiene como objetivo confirmar el alcance del posible proyecto y definir objetivos bien acotados, tiempos y costos. Se han identificado tres grandes aspectos que le pueden venir bien al IER: onboarding al IER, qué es la sostenibilidad y el compromiso del IER en esa sostenibilidad, y una introducción a la inteligencia artificial. Se propone una herramienta para capturar sugerencias de mejora e innovación, y una plataforma de comunicación para transmitir un nuevo rumbo, logro, mercado o producto. El proyecto es un proyecto de co-diseño y co-desarrollo, y se requiere una base de conocimiento sobre lo que es Alier y hacia dónde va. También se necesita diseñar la puerta de entrada del perfil de usuario. Todo esto se hará con la ayuda de la inteligencia artificial y se espera que sea muy adaptable.
	  `;
        const t2 = `
	  En la reunión se discutió la importancia del perfil de usuario y cómo se puede utilizar para interactuar con la inteligencia artificial y promover interacciones entre los empleados. Se habló de la importancia de romper con la jerarquía y fomentar la comunicación lateral entre los operarios. Se mencionó la importancia de la base de conocimiento y cómo la inteligencia artificial puede ayudar a crearla y utilizarla de manera efectiva. Se habló de la herramienta Voice Genius y cómo puede ayudar a las empresas a expresar y mejorar sus ideas. Se acordó enviar un resumen de la reunión y recibir feedback por escrito o en audio para definir el scope, tiempos, equipo y costos del proyecto. Se acordó reunirse nuevamente entre martes y jueves de la próxima semana. 
	  `;
        let prompt = `
	El siguiente texto es la sintesis de una reunion
	Mejora el formato para que vaya acorde con una minuta de una reunion
	`;
        const message = [{
          role: "system",
          content: prompt
        }, {
          role: "user",
          content: t1
        }, {
          role: "user",
          content: t2
        }];
        console.log("chat", message);
        const response = await this.chatCompletions(message);
        console.log("chat response", response);
        if (!response.status) {
          console.error("response chat");
        }
        await (0, _fs.writeFileSync)(`./meet/bullets3.txt`, response.data);
        return response.data;
      }
    }
    exports.AIBackend = AIBackend;
  }
});

/************************************
INTERNAL MODULE: ./meet/___meet-calls
************************************/

ims.set('./meet/___meet-calls', {
  hash: 2875921153,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports._____Trash = void 0;
    var _openai = require("openai");
    var _fs = require("fs");
    /*bundle*/
    class _____Trash {
      #configuration = new _openai.Configuration({
        apiKey: process.env.OPEN_AI_KEY
      });
      #openai = new _openai.OpenAIApi(this.#configuration);
      async resumen(texts) {
        const t1 = `Bueno, recapitulando, la idea de la reunión de hoy es terminar de confirmar el alcance del posible proyecto, confirmar que el interés de ustedes y la motivación tenga que ver con cómo venimos entendiendo los posibles siguientes pasos. Y tras la bendición de Marcelo y la conversación de la semana que viene, definir objetivos bien acotados, tiempos, costos, etcétera, que podamos arrancar un proyecto juntos. Entonces, un poco nosotros, en lo que venimos escuchando que le interesa a alguien y le viene bien a alguien en este momento es, lo pensamos como una asistencia, todo esto con inteligencia artificial, esto es el nexo común a todo lo que voy a decir. Pero hay un bloque que tiene que ver con onboarding al IER. De vuelta, lo que venimos escuchando, después ustedes nos dicen, mira, sí, escucharon correcto, pero arranquemos solamente con esto otro. Quiero escuchar que entendieron hasta ahora y ahí vemos dónde apuntar. Nosotros entendimos, o sea, escuchamos y entendemos que le puede venir bien al IER, tres grandes aspectos. El primero tiene que ver con todo un capítulo de onboarding. ¿Onboarding a qué? Onboarding a lo que es al IER, lo que es al IER hoy, la historia del IER, cómo funciona el valor, edición, etcétera, etcétera, y todo el aspecto de sostenibilidad. Entonces, onboarding al IER, más, ¿qué quiere decir la sostenibilidad? ¿Y cuál es el compromiso del IER en sostenibilidad, puertas adentro y en el modelo de negocio? ¿Qué hace con sus productos y servicios? ¿La visión estratégica, el camino recorrido hasta ahora? ¿Qué pasa desde que hay un cambio de management y de dueños años atrás? Un poco los siguientes pasos hacia futuro, como para tener una optimización de ingresa alguien al IER y ese tiempo que tarda alguien en entender que es una nueva organización siempre es entre 6 y 12 meses, se pierde un montón de productividad, además una empresa que está creciendo en nueva fase y demás, hay un valor intangible pero muy alto de que los nuevos entrantes entren lo más rápidamente en ese tejido de lo que es al IER hoy. Entonces ahí, nuevamente, ¿qué incluiríamos ahí? Después hablamos del cómo, ¿sí? Pero ¿qué sería al IER? ¿Qué es la sostenibilidad y el compromiso del IER en esa sostenibilidad? ¿Cuál es la visión estratégica? O sea, ¿dónde está y hacia dónde quiere ir al IER? Y un onboarding, y ahí un poco suplementando lo anterior, sobre ¿qué es la inteligencia artificial? Y las oportunidades que hay en la inteligencia artificial, o sea, sería una especie de onboarding a los nuevos entrantes pero también una apretar refresh a todos los empleados de al IER hoy para que también entiendan no solamente qué es al IER sino esto nuevo de la inteligencia artificial, cómo va a permear todo lo que hacemos, ¿no? Pero fíjate que por eso lo pensamos dentro del onboarding porque es casi poner en la misma plataforma a todos los empleados y a todos los miembros de al IER. Para qué hacer un cambio cultural si directamente decís esta es mi cultura, no tengo que cambiar nada. Exacto. Entonces todo lo que es cultura y estrategia al IER pues está en un único lugar que narre historia, pasado, presente y futuro, ahí está la visión estratégica, ¿qué es la sostenibilidad? El rol del individuo, del empleado, de la persona también, no solamente lo que hace la empresa. La inteligencia artificial y hacia dónde la podemos llevar a grandes rasgos, entender por dónde viene todo esto y entonces todo esto es estrategia y cultura al IER hoy, un onboarding a eso, un onboarding no solamente a los nuevos entrantes sino para todas las personas. Bring people together en qué es al IER hoy y hacia dónde va al IER incluyendo todos los aspectos de inteligencia artificial. Eso es como una primera pata de esto que nos imaginamos, de vuelta, soportado por inteligencia artificial en una plataforma y ahora hablamos en un ratito de que es ese como, de qué nos imaginamos que podría ser ese como. La segunda pata del banco, del banquito, tiene que ver con esto que hablábamos la reunión pasada, una herramienta en donde, y esto un poco parafraseando a Marcelo, era cómo logramos que entre el miembro de al IER, la persona, por no llamar empleado, pero el que es parte de al IER como individuo y la organización, haya un matrimonio de los mejores matrimonios en donde se logre la mejor versión de cada uno`;
        const t2 = `Entonces, cómo logramos refinar el sistema actual de al IER para que cada persona y al IER mismo logren llegar a su potencial. Entonces, en ese ayudar a alcanzar el potencial nos imaginamos una herramienta donde puede haber la oportunidad de dar feedback, que podría ser de aspectos digamos de frustración y dificultad o desafío, pero realmente más orientada a sugerencias de mejora, sugerencias de innovación. Entonces, todo lo que tiene que ver con qué te gustaría o qué te imaginas que al IER podría hacer un poco diferente para que vos sientas que este es el mejor lugar en el mundo para el desarrollo de tu persona y de tu profesión. Entonces, ahí hay una mezcla de desarrollo profesional y desarrollo personal. Y ahí nos imaginamos una herramienta de vuelta, de captura de sugerencias de innovación, tanto para el management y la parte administrativa del IER como para empleados en la fábrica. Que de pronto se diga, uy, escuchan, uy, importa lo que pienso, importa mi sugerencia, importa lo que me preocupa. Desde cómo resolver para reducir riesgo de accidentes hasta qué me haría mejor en mi recreo de media hora, en la mitad del día, para que yo haga la tarde, rinda al doble. Bueno, y la tercera pata del banquito sería, de vuelta, relacionada con las otras dos, por eso son tres patas del mismo banquito nos imaginamos nosotros. Ahí está después cómo se imagina, pero esa tercera pata tiene que ver con una plataforma que permita comunicar. Desde el top management hay una necesidad o un interés de transmitir un nuevo rumbo, un nuevo logro, un nuevo mercado, un nuevo producto. Por decir algo, en el grupo de IER se está incorporando, por ejemplo, toda una nueva línea de negocios sobre reciclado de plásticos y cómo lo comunicamos para que llegue a cada empleado, ya sea para que puedan levantar la mano y decir yo quiero participar, es super motiva, o para que empiecen a decir con orgullo en la charla de café o en el cumpleaños del amigo, que mi empresa está creciendo y ahora aspiramos a ser los número uno reciclado plástico de España o Europa o el mundo y que esto genere entonces una atracción y una motivación en todos los empleados y esta es la herramienta crucial siempre para atraer y retener talento, que todos conozcan lo lindo que está pasando y lo motivador y lo inspirador del camino por delante de la empresa en la que uno está. Esa herramienta de comunicación que sea también asistida con inteligencia artificial. En resumidas cuentas, ahora hablamos un poquito del cómo. Una plataforma desde la cual se puedan lograr tres aspectos, un onboarding de poner a todos en sintonía sobre qué es IER, qué viene siendo IER, hacia dónde va IER, toda la parte estratégica, qué es la sostenibilidad, cuál es el rol de IER en la sostenibilidad, puertas afuera, puertas adentro, el rol del individuo, qué es la inteligencia artificial, en qué consiste la cultura, los valores de IER y cómo todo esto tiene que ver conmigo como individuo, persona. Esta es la primera pata del banquito, la segunda pata tiene que ver con bueno, ok, ya entendí de qué se trata donde estoy, tengo sugerencias, tengo ideas, tengo innovaciones que quiero plasmar, tengo frustraciones, tengo preocupaciones, dónde y cómo las plasmo, esa sería la segunda pata. Y la tercera es cómo me entero de manera dinámica y actualizada de cada uno de los aspectos importantes que tengo que enterarme a medida que IER evoluciona, se van logrando cada uno de los pasos. Entonces, hago pausa ahí y quiero confirmar que haya sido claro un poquito cómo delineé las tres áreas que nos imaginamos. Sí, sí, sí. Sí, al final tenía que ver con así, con un pantallazo un poco de cómo queremos encarar el cambio cultural, que está bien, o sea, creo que esto es un poco un paso atrás porque es un paso atrás en el sentido de tener una visión un poco más amplia que es hacer la presentación de IER que ya debe haber algo, pero bueno, ver cómo lo podemos mejorar. Sí me interesa un poco la parte esta que vos hablabas de cómo preparar a la organización para el próximo cambio`;
        const t3 = `¿no? Está bien porque primero tenés que ver qué es lo que tenés hoy y plantearlo bien, de manera ordenada, y después ya con eso podés plantear la proyección a futuro y todo lo que es todo lo que es el impacto que puede llegar a tener este tipo de herramientas de inteligencia artificial en algo que por ahí, claro, debe haber mucha gente que no lo ve, que dice, bueno, que a nosotros en nuestra industria o en lo que nos toca no nos va a pegar, pero sí, la idea es que hay que incorporar estas herramientas lo antes posible. Y un poco al final, el punto final. Si además esas herramientas ya me ayudan a gestionar este cambio, mejor. Porque es como le estás enseñando a una persona, che, mirá que hay que usar esta herramienta y es súper importante y te van a decir, bueno, sí, muy bonito, cuando llegue la usaré y te dicen, no entendiste, ya la estamos usando para todo esto. Todo esto que estás viendo hoy, que es todo el onboarding, que es todo esto de alcanzar tu potencial y el tema de cómo la organización se comunica, ya está basado en estas herramientas. O sea, ya te está impactando todo esto. Exactamente. Entonces, Ingembri, dejo abierto, obviamente, el micrófono para que agregues comentarios a medida que avanzo. Un poco ahora, yo sugiero hablar un poquito de cómo nos imaginamos, o sea, en qué consistiría el proyecto, pero no sé si Ingembri querés agregar algo o sigo. Si no, terminamos con la parte más funcional y podemos pasar después a una clínica, mientras tengo miedo de desviarnos antes de tiempo. Dale, perfecto. Entonces, a ver, el proyecto es un proyecto de co-diseño, de co-desarrollo. Alier, por todo el vínculo que se viene armando desde la primera conversación con Marcelo, no es un cliente X, al cual desarrollamos algo en un cuarto oscuro y entre comillas se lo vendemos. Acá sería una alianza para desarrollar algo que sea muy útil para Alier. O sea, no tenemos una cajita, un enlatado que queremos venderles y colocarles, sino que los usaríamos de asociados, de partners. Claro, al final es armar el enlatado que por ahí después podemos adaptar a otras organizaciones. Exactamente. Es un enlatado que después sea muy adaptable. Nunca va a ser un enlatado cerrado, porque justamente una de las grandes bellezas de la inteligencia artificial es su capacidad increíble de diferenciación para cada usuario. Un poquito, acá habría como toda una primera parte de diseño de lo que, de lo que, terminología de acá de vuelta, el que va a ir confirmando que yo por lo menos estoy diciéndolo de la manera más correcta e idónea es Henry, pero armar todo lo que es el knowledge base, o sea, cuál es la base de conocimiento sobre la cual vamos a estar montando cada uno de estos aspectos de la funcionalidad de esta plataforma. La que es Alier, todo esto de la inteligencia artificial. Vos dijiste, ya Alier debe tener algo de material sobre onboarding. Perfecto, lo metemos. Toda la información que está por detrás del sitio web, toda la, no, lo que, lo que no esté plasmado ahí. Entonces, acá, imagínate audios de top management, Marcelo, vos, Mateo, ¿no? Diciendo un poquito a través de nuestra herramienta de voz niños, que es este, traducir, ¿no? Desde un, desde un audio a distintas versiones de texto con bullet points o de audio, ¿no? Entonces, capturar todo lo que es necesario capturar de la base de conocimiento de lo que es Alier y hacia dónde va y qué es la sostenibilidad para Alier y digamos, todo. Es como nuestra propia wiki. Exactamente. Como nuestra. Para no, para no tener que apoyarnos exclusivamente en la información pública. Entonces, cuando, cuando instalamos un dispositivo de intercambio de diálogo, ¿no? Entre un empleado y la inteligencia artificial, que la inteligencia artificial se puede dar vuelta y decir, tengo más información que la que está disponible públicamente a noviembre del 91. Y es customizada, es información propia que tiene la organización. Exactamente, entonces, esa es la primera parte de este esfuerzo que requiere no solamente de la información, sino como lo diseñamos, como lo montamos, etcétera. Luego hay toda una, una puerta de entrada de lo que sería perfil usuario, ¿no? `;
        const t4 = `Entonces, el perfil usuario tendría que ver con qué le pedimos a cada empleado que monte en su perfil de usuario para desde ahí tener esa interacción con la inteligencia artificial, que se da vuelta y busca información en la base de conocimiento, pero al mismo tiempo, para que desde ese perfil usuario nosotros podamos promover interacciones con otros usuarios. Entonces, parte de lo que queremos lograr es romper y todo lo, parte de lo bello de esta irrupción tecnológica que estamos viviendo, es esto de poder tener conversaciones laterales, o sea, romper con esa jerarquía donde había alguien arriba de todo que proveía información y la cascadeaba, ¿no? Eso está dinamitado por las buenas razones, o sea, es mucho más alto potencial que podamos también intercambiar información entre operarios, ¿no? Entre nuevos entrantes y los que están ahí hace más tiempo, ¿no? Entonces, que el diseño ahí de vuelta es cómo diseñamos esa página de entrada del perfil de usuario para que después estas conexiones puedan realizarse de manera lateral y constructiva en red, en ecosistema, en comunidad. Parte de lo que queremos lograr y parte del cambio cultural es que vemos una comunidad Alien, ¿no? Comunidad fuerte hacia adentro, comunidad con la comunidad cercana, ¿no? O sea, si Alien está haciendo algo por el medio ambiente en su entorno, bueno, ¿qué es lo que está haciendo? Cómo puede haber más porosidad y más intercambio. Y todo esto puede ser definido o necesita ser definido con qué información vamos a pedirle al usuario para determinar su perfil y desde ahí todas las interacciones que siguen. Y luego está un poquito cuál es desde un punto de vista de programación qué interacción facilitamos, qué herramientas ofrecemos a este usuario que sean artificialmente inteligentes. O sea, vamos a poner la figura de un coach, de un buddy, ¿no? No sé si conoces el término de buddy en onboarding. O sea, cuando uno ingresa a una nueva empresa, muchas veces las que hacen buenas prácticas se asignan otro empleado que sea un poquito más senior que vos y que te pueda mostrar, o a veces es alguien exactamente... Como un supervisor o como un... Sí, no es supervisor porque al final puede ser de otra área. Es como un compañero. Un compañero, en inglés se le dice muchas veces buddy. Un buddy program. Un ché amigo. Entonces, qué perfil le damos a esa no persona con inteligencia artificial que te acompaña. Acá teníamos un ejemplo, acá en la organización, por lo menos en Alier, hay todo un programa de becas que se hace para el máster papelero. Y entonces como ya vamos por la tercer cuarta camada, siempre se les pide a los de la camada anterior que se egresaron que ayuden a los que están entrando a este año a que les cuenten su experiencia para ir transmitiendo un poco el conocimiento del proceso. Porque después ellos tienen como un tutor asignado para el tema del trabajo final del máster. Pero es como otro rol, es un rol más de acompañante en todo lo que es el proceso. No en lo que es meramente académico. Diciendo que es algo, incluso con estas herramientas se puede conseguir algo mix de estas cosas. Exactamente. Entonces, ese sería como un punto de vista de montaje de lo tecnológico. Tres elementos muy importantes. De vuelta, knowledge base, perfil usuario y cómo definir qué tenés del otro lado. Tenés un coach, tenés un buddy, tenés un qué que te acompaña. Entonces, frente a todo eso, después del diseño y la programación de esto, es cargarlo con la info y establecer cuál es el proceso y digamos la interfaz con ese usuario para que ocurra en el front end, entonces el onboarding y todas las interacciones para onboarding, la parte de feedback y cómo se da, se recibe y se proveen sugerencias, en qué áreas. Todo esto requiere un cómo canalizamos las sugerencias para orientar hacia, que no sea una hoja en blanco nada más. Bueno, esta es para la segunda parte de lo antiguo. Y para la tercera es, bueno, de top management qué tipo de comunicaciones se imaginan queriendo dar, cómo quieren que llegue a quiénes. Si esto está definido, si hay como toda una posibilidad de decir, bueno, quiero que esto llegue solamente a fábrica o quiero que esto vaya a la cartelera tal o quiero que esto vaya al evento anual de no sé qué o sea quiero que esto surja como una actividad de happy hour.`;
        const t5 = `Todo esto también, uno lo puede definir y diseñar desde esa herramienta como para que esté armado desde ahí. Así que te diría que eso es el proyecto inicial central, la idea sería cargando todo después ya en la implementación, acompañarlos a que siempre en las primeras implementaciones, sobre todo herramientas que fueron diseñadas tailor-made, customizadas, hay que acompañar en las fases de implementación y la idea sería acompañarlos de una manera ya por ahí no tan frecuente, tan intensa de dedicación, pero hasta el seguimiento anual para ver cómo el ciclo se cierra, que nos parece interesante. Bueno, entonces habría como una primera fase de desarrollo, de diseño de desarrollo importante, de cargarla en toda la data después de implementación y después de un acompañamiento que nos lleve hacia un cierre por lo menos de esta fase de trabajo con el evento anual que creo que son en octubre. Así lo vemos hoy. Miguel, un poco digamos, esta es un poco la idea es que nos den feedback sobre esto. Bien, yo por mi lado creo que es un poco lo que tenemos, obviamente me gustaría chequearlo con Marcelo, por ahí le comparto incluso la grabación, así ya tiene todo el resumen de lo que planteamos, a menos que quieran mandar algún resumen con un audio o con un transcripto y después tenemos que ver un poco también la opinión de Mateo, porque él a veces expresaba que quería ir en otra dirección o parecía, entonces hay que ver si es un poco esto lo que también busca de ese lado, sino bueno, abriremos una tercera vía, más allá de lo que propone la Fundación o este cambio cultural o estas herramientas que queremos implementar en la organización, que luego tenemos que ver hasta qué punto es únicamente Alier o incluimos al resto de los periféricos que tenemos que son un poco más de personas, pero cuando hablo de la organización en sí es un poco todos, pero esa es mi opinión, por ahí ahora me dicen, no, no, si inscribamos a Alier para hacer la prueba y después vemos con el resto. Sí, yo ahí concuerdo con tu mirada, creo que lo ideal sería que esto sea para el grupo y tal vez sí hacer de Alier el caso piloto, pero que el alcance sea el grupo, me parece que es lo que... Sí, sí, esto es como todo, o sea las otras empresas, claro, una empresa que tiene un año y medio de vida es como que no tiene tanta historia o tanta cultura como para ir a hacer un desarrollo así, en cambio la otra sí, todo lo que cuando vos hablas de pasado, presente y futuro, proyección, en eso Alier lo tiene mucho más claro que las otras empresas, pero después sí que hay una realidad que el grupo está un poco alineado en ciertas cosas, el tema de la sostenibilidad y todos los proyectos que tenemos van de la mano de la organización que tenemos hoy, con las empresas que tenemos hoy y con las que hace que crear en un futuro para seguir dando estos servicios o esta o este impacto positivo que queremos dar. Entonces es un asterisco que es para aclarar, pero que no nos lleva al punto, el punto es como lo aplicamos a Alier, o sea no hay ningún problema en circunscribirlo ahí y después vemos cómo lo compartimos con el resto, que al final los usuarios son transparentes, o sea están metidos todos en la misma organización y apuntamos todos a lo mismo. Buenísimo, bueno, yo un poco lo que sugeriría entonces, si te parece Miguel, es nosotros pasamos esto en limpio y les compartimos ya sea bullet points o un audio resumen para que también le puedas compartir a Marcelo, si él tiene el rato de, le puedes decir, la reunión arrancó en minutos cinco, con él le van a en realidad, apretamos grabación desde el comienzo. Lo previo fue charla. No se grabó, así que tendrá más o menos 30 minutos que por ahí le sirven a él escucharlo en detalle, más allá de que además le mandemos un audio resumen, pero digo creo que estaría buenísimo, lo mismo para Mateo y si te parece tratamos de apuntar a que el martes, más tardar el miércoles, tengamos una reunión ya para confirmar, o si vos tenés feedback antes nos lo mandas. Sí, sí, a ver, lo bueno es también que estamos probando esto, qué pasa cuando algún miembro de la organización no está en una de las reuniones, puede llegarle esta información de otra manera y puede dar su feedback de manera offline o asíncrona`;
        const t6 = `Perfecto, viene bien, yo creería que yo igual ahora en algún momento lo engancho, hagamos esto igual y lunes o martes seguro que tenemos un feedback o incluso antes. Sí, si vos pudieras darnos feedback a más tardar el lunes y ahí definimos entre martes y jueves cuando nos reunimos para una vez que está súper claro el scope, digamos de vuelta, cuál sería el costo, tiempos, equipo, qué necesitamos del lado de ustedes, a quién van a asignar el proyecto, bueno todo esto que sería la consecuencia de haber ya firmado scope y next steps. Dale, perfecto. Buenísimo, Miguel, Henry algún comentario al final de cierre o estamos? Está silenciado. Bueno, estaba pensando mientras hablábamos si había algo que tenía para aportar, me parece que es la síntesis de todo lo que hemos hablado, Seba. Enfatizaría sobre la base de conocimiento que creo que es el gran secreto de esta nueva era, porque mencionaste la wiki, está buena la analogía, la wiki es como algo sobre lo cual era muy difícil operar, era una herramienta que fue muy útil, pero el potencial que tiene hoy la inteligencia artificial para operar contra una base de conocimientos es muchísimo mayor. Yo diría que incluso te ayuda a armarla, no? Porque armar una wiki para una compañía, tener que poner a gente ahí a escribir, y se hace un poco tedioso. No, es que la diferencia enorme que hay entre la wiki y el knowledge base indirect, o sea, no hace falta que tenga demasiada estructura, por ejemplo, porque va a ir a buscar la inteligencia en contenido, lo va a procesar de manera inteligente, se lo va a devolver de manera inteligente al usuario, y sobre la parte de la creación, Seba mencionó, puso el título rápido y vale la pena hacer un doble click, Voice Genius, que es la herramienta que venimos desarrollando, sobre la cual creamos, por ejemplo, tomamos el audio de Marcelo el otro día y lo procesamos por ahí, en un texto y un audio increíble, y eso mismo puede ayudar mucho a las empresas de una organización a poder expresar ideas y mejorarlas muchísimo y compartirlas, y si logramos que eso sea en colaboración y se potencia todo eso y se vuelca en la base de conocimiento, entonces se empieza a crear un aporte de valor muy grande que no se sabe a dónde termina. Sí, sí, sí, tal cual. Yo le hice el análogo como para entenderlo en mi estructura mental, que es por sí un poco más anticuada, pero es tal cual, o sea, es como esta base de conocimiento de la compañía que es interna y única de cada uno, y después se conectará. Ese es nuestro wiki, entre comillas, pero tanto para la generación, porque una persona hoy con una idea, capaz que la idea está buenísima, nadie se le ocurrió, pero esa persona no tiene tanta capacidad de expresarla, de devolverla a documento y demás, y queda en un cajón virtual en su cabeza por ahí. Nadie lo escucha porque no lo entendió bien, porque no le cuesta expresarlo, y de repente si se desarrolla mejor con inteligencia artificial, se vuelca en la base de conocimiento y ya empieza a haber una estructura mucho más inteligente. Entonces empezamos a lograr una empresa inteligente asistida con la inteligencia artificial y mejorar el potencial humano con la inteligencia artificial, que es lo que buscamos en el proyecto. Bueno, entonces creo que estamos en un buen lugar para cerrar hoy, y te dejamos un poquito la pelota de tu lado Miguel, si te parece, con feedback por escrito, en un audio, de la manera que te resulte más fácil, y preferencia de día para que reconectemos martes, miércoles, yo no dejaría pasar mucho más tiempo que eso, el lunes yo estoy volviendo a la mañana, así que prefiero por ahí no, pero ya desde martes nos sugerís el siguiente touch point y lo hacemos. Dale, perfecto, las grabaciones anteriores se las pasó Mateo, no? Tienen? Si, si, lo tenemos. Bueno, yo supongo que también cuando cierre esta, veo como se los comparto, pero quedamos así. Perfecto. Bueno, gracias por tu tiempo. Gracias a ustedes. Un abrazo.`;
        let prompt = `
		Sintetice el siguiente texto para que pueda usarse para un análisis posterior y permita una visualización rápida del contenido. Incluya los puntos principales y utilice los siguientes elementos según corresponda:
		Use negrita, cursiva, subrayado u otro formato para resaltar los puntos principales y los puntos secundarios importantes.
		Utilice viñetas, tablas, gráficos o diagramas para presentar la información de forma clara y visual.
		Incluye una introducción clara y concisa que resuma el tema y los objetivos del texto.
		Incluya una conclusión que resuma las ideas principales y proporcione una descripción general del texto.
	`;
        const message = [{
          role: "system",
          content: prompt
        }, {
          role: "user",
          content: t4
        }, {
          role: "user",
          content: t5
        }, {
          role: "user",
          content: t6
        }];
        console.log("chat", message);
        const response = await this.chatCompletions(message);
        console.log("chat response", response);
        if (!response.status) {
          console.error("response chat");
        }
        await (0, _fs.writeFileSync)(`./meet/bullets2.txt`, response.data);
        return response.data;
      }
      async bullets(texts) {
        const t1 = `
	  En resumen, la reunión tiene como objetivo confirmar el alcance del posible proyecto y definir objetivos bien acotados, tiempos y costos. Se han identificado tres grandes aspectos que le pueden venir bien al IER: onboarding al IER, qué es la sostenibilidad y el compromiso del IER en esa sostenibilidad, y una introducción a la inteligencia artificial. Se propone una herramienta para capturar sugerencias de mejora e innovación, y una plataforma de comunicación para transmitir un nuevo rumbo, logro, mercado o producto. El proyecto es un proyecto de co-diseño y co-desarrollo, y se requiere una base de conocimiento sobre lo que es Alier y hacia dónde va. También se necesita diseñar la puerta de entrada del perfil de usuario. Todo esto se hará con la ayuda de la inteligencia artificial y se espera que sea muy adaptable.
	  `;
        const t2 = `
	  En la reunión se discutió la importancia del perfil de usuario y cómo se puede utilizar para interactuar con la inteligencia artificial y promover interacciones entre los empleados. Se habló de la importancia de romper con la jerarquía y fomentar la comunicación lateral entre los operarios. Se mencionó la importancia de la base de conocimiento y cómo la inteligencia artificial puede ayudar a crearla y utilizarla de manera efectiva. Se habló de la herramienta Voice Genius y cómo puede ayudar a las empresas a expresar y mejorar sus ideas. Se acordó enviar un resumen de la reunión y recibir feedback por escrito o en audio para definir el scope, tiempos, equipo y costos del proyecto. Se acordó reunirse nuevamente entre martes y jueves de la próxima semana. 
	  `;
        let prompt = `
	El siguiente texto es la sintesis de una reunion
	Mejora el formato para que vaya acorde con una minuta de una reunion
	`;
        const message = [{
          role: "system",
          content: prompt
        }, {
          role: "user",
          content: t1
        }, {
          role: "user",
          content: t2
        }];
        console.log("chat", message);
        const response = await this.chatCompletions(message);
        console.log("chat response", response);
        if (!response.status) {
          console.error("response chat");
        }
        await (0, _fs.writeFileSync)(`./meet/bullets3.txt`, response.data);
        return response.data;
      }
    }
    exports._____Trash = _____Trash;
  }
});

/*********************
INTERNAL MODULE: ./pdf
*********************/

ims.set('./pdf', {
  hash: 2559446608,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.saveMarkdownAsPdf = saveMarkdownAsPdf;
    var _path = require("path");
    var _puppeteer = require("puppeteer");
    var _marked = require("marked");
    async function saveMarkdownAsPdf(content, outputPath) {
      const htmlContent = (0, _marked.marked)(content);
      const browser = await _puppeteer.default.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });
      const pdf = await page.pdf({
        path: (0, _path.resolve)(outputPath),
        format: 'A4',
        printBackground: true
      });
      await browser.close();
    }
    // Use function
    const markdownContent = '# Hello, world!\nThis is a test.';
    //saveMarkdownAsPdf(markdownContent, './test.pdf');
  }
});

__pkg.exports.descriptor = [{
  "im": "./audio",
  "from": "Audio",
  "name": "Audio"
}, {
  "im": "./chunk-audio",
  "from": "chunkAudio",
  "name": "chunkAudio"
}, {
  "im": "./index",
  "from": "AIBackend",
  "name": "AIBackend"
}, {
  "im": "./meet/___meet-calls",
  "from": "______Trash",
  "name": "______Trash"
}];
let Audio, chunkAudio, AIBackend, ______Trash;

// Module exports
exports.______Trash = ______Trash;
exports.AIBackend = AIBackend;
exports.chunkAudio = chunkAudio;
exports.Audio = Audio;
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {
  (require || prop === 'Audio') && (exports.Audio = Audio = require ? require('./audio').Audio : value);
  (require || prop === 'chunkAudio') && (exports.chunkAudio = chunkAudio = require ? require('./chunk-audio').chunkAudio : value);
  (require || prop === 'AIBackend') && (exports.AIBackend = AIBackend = require ? require('./index').AIBackend : value);
  (require || prop === '______Trash') && (exports.______Trash = ______Trash = require ? require('./meet/___meet-calls').______Trash : value);
};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => __pkg.hmr.on(event, listener);
  this.off = (event, listener) => __pkg.hmr.off(event, listener);
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsInJlcXVpcmUiLCJfY2h1bmtBdWRpbyIsIkF1ZGlvIiwicHJvY2VzcyIsInBhdGgiLCJmaWxlUGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJjaHVua0F1ZGlvIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJleHBvcnRzIiwiX2ZzIiwiZmZtcGVnIiwiX2NvcmUiLCJDSFVOS19TSVpFX01CIiwibWF4U2l6ZU1CIiwicHJvbWlzZSIsIlBlbmRpbmdQcm9taXNlIiwic3RhdHMiLCJwcm9taXNlcyIsInN0YXQiLCJmaWxlU2l6ZUluQnl0ZXMiLCJzaXplIiwiZmlsZVNpemVJbk1lZ2FieXRlcyIsIm91dHB1dERpciIsImRpcm5hbWUiLCJiYXNlbmFtZSIsImV4dG5hbWUiLCJta2RpciIsInJlY3Vyc2l2ZSIsImZmcHJvYmUiLCJlcnIiLCJtZXRhZGF0YSIsImR1cmF0aW9uIiwiZm9ybWF0IiwibnVtT2ZDaHVua3MiLCJNYXRoIiwiY2VpbCIsImkiLCJvdXRwdXQiLCJjdXJyZW50UHJvbWlzZSIsInB1c2giLCJzZXRTdGFydFRpbWUiLCJzZXREdXJhdGlvbiIsIm9uIiwicmVzb2x2ZSIsInJlamVjdCIsInJ1biIsIlByb21pc2UiLCJhbGwiLCJ0aGVuIiwidW5kZWZpbmVkIiwiZXJyb3IiLCJtZXNzYWdlIiwiX29zIiwiY29udmVydFRvVmFsaWRQYXRoIiwib3NQbGF0Zm9ybSIsInBsYXRmb3JtIiwicmVwbGFjZSIsImlzRGlyZWN0b3J5IiwibHN0YXQiLCJnZXRTb3J0ZWRGaWxlcyIsImRpclBhdGgiLCJmaWxlcyIsInJlYWRkaXIiLCJ3aXRoRmlsZVR5cGVzIiwiZmlsdGVyIiwiZmlsZSIsImlzRmlsZSIsInNvcnQiLCJhIiwiYiIsIk51bWJlciIsIm5hbWUiLCJzcGxpdCIsImZpbGVQYXRocyIsIm1hcCIsImhhbmRsZVBhdGgiLCJkaXJlY3RvcnkiLCJzb3J0ZWRGaWxlcyIsIl9vcGVuYWkiLCJfY29udmVydFBhdGgiLCJfZW5naW5lcyIsIl9wZGYiLCJfZ2V0RmlsZXMiLCJhcGlLZXkiLCJlbnYiLCJPUEVOX0FJX0tFWSIsIkFJQmFja2VuZCIsImNvbmZpZ3VyYXRpb24iLCJDb25maWd1cmF0aW9uIiwib3BlbmFpIiwiT3BlbkFJQXBpIiwibW9kZWxzIiwibGlzdE1vZGVscyIsImRhdGEiLCJjb21wbGV0aW9ucyIsInByb21wdCIsInRleHQiLCJjb250ZW50IiwicmVzcG9uc2UiLCJjcmVhdGVDb21wbGV0aW9uIiwibW9kZWwiLCJkYXZpbmNpMyIsInRlbXBlcmF0dXJlIiwic3RhdHVzIiwiY2hvaWNlcyIsImNoYXRDb21wbGV0aW9ucyIsIm1lc3NhZ2VzIiwiY3JlYXRlQ2hhdENvbXBsZXRpb24iLCJncHRUdXJib1BsdXMiLCJ0cmFuc2NyaXB0aW9uIiwibGFuZyIsInAiLCJhdWRpbyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJjcmVhdGVUcmFuc2NyaXB0aW9uIiwiY29kZSIsImluY2x1ZGVzIiwibGFyZ2VUcmFuc2NyaXB0aW9uIiwic2F2ZVRvUERGIiwic3BlY3MiLCJzYXZlTWFya2Rvd25Bc1BkZiIsInBkZiIsIm1hcmtkb3duQ29udGVudCIsInNhdmVMYXJnZVBERiIsInBhdGgxIiwidGV4dHMiLCJrZXkiLCJhbnN3ZXIiLCJsYXN0VGV4dCIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJyZXN1bWVuIiwidDEiLCJ0MiIsInQzIiwidDQiLCJ0NSIsInQ2Iiwicm9sZSIsIndyaXRlRmlsZVN5bmMiLCJidWxsZXRzIiwiX19fX19UcmFzaCIsIl9wdXBwZXRlZXIiLCJfbWFya2VkIiwib3V0cHV0UGF0aCIsImh0bWxDb250ZW50IiwibWFya2VkIiwiYnJvd3NlciIsImRlZmF1bHQiLCJsYXVuY2giLCJwYWdlIiwibmV3UGFnZSIsInNldENvbnRlbnQiLCJ3YWl0VW50aWwiLCJwcmludEJhY2tncm91bmQiLCJjbG9zZSJdLCJzb3VyY2VzIjpbIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvYXVkaW8udHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L2NodW5rLWF1ZGlvLnRzIiwiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC9jb252ZXJ0LXBhdGgudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L2ZpbGVzL2dldC1maWxlcy50cyIsIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvaW5kZXgudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L21lZXQvX19fbWVldC1jYWxscy50cyIsIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvcGRmLnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxJQUFBQSxLQUFBLEdBQUFDLE9BQUE7SUFDQSxJQUFBQyxXQUFBLEdBQUFELE9BQUE7SUFFTyxZQUFZO0lBQVksTUFBT0UsS0FBSztNQUN6QyxNQUFNQyxPQUFPQSxDQUFDQyxJQUFJO1FBQ2hCLElBQUk7VUFDRixNQUFNQyxRQUFRLEdBQUcsSUFBQU4sS0FBQSxDQUFBTyxJQUFJLEVBQUNDLFNBQVMsRUFBRSxVQUFVLEVBQUVILElBQUksQ0FBQztVQUNsRCxNQUFNLElBQUFILFdBQUEsQ0FBQU8sVUFBVSxFQUFDSCxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzlCLENBQUMsT0FBT0ksQ0FBQyxFQUFFO1VBQ1ZDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDRixDQUFDLENBQUM7O01BRWxCOztJQUNERyxPQUFBLENBQUFWLEtBQUEsR0FBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNaRCxJQUFBVyxHQUFBLEdBQUFiLE9BQUE7SUFDQSxJQUFBSSxJQUFBLEdBQUFKLE9BQUE7SUFDQSxJQUFBYyxNQUFBLEdBQUFkLE9BQUE7SUFDQSxJQUFBZSxLQUFBLEdBQUFmLE9BQUE7SUFDQTtJQUVBLE1BQU1nQixhQUFhLEdBQUcsRUFBRTtJQUVqQjtJQUNQLGVBQWVSLFVBQVVBLENBQUNILFFBQWdCLEVBQUVZLFNBQWlCO01BQzNELElBQUk7UUFDRixJ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