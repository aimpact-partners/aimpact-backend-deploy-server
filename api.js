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
  hash: 246168531,
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
          console.error(e.message);
          return {
            status: false,
            error: e.message
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
          console.log("translatation texts", texts);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUU7VUFDcEJ6RixPQUFPLENBQUM2QyxLQUFLLENBQUMsZUFBZSxDQUFDOztRQUdoQyxNQUFNLHFCQUFhLEVBQUMscUJBQXFCLEVBQUV1QyxRQUFRLENBQUNMLElBQUksQ0FBQztRQUN6RCxPQUFPSyxRQUFRLENBQUNMLElBQUk7TUFDdEI7O0lBQ0Q3RTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUN2RkQ7SUFDQTtJQUNBO0lBRU8sZUFBZXlILGlCQUFpQixDQUFDeEMsT0FBZSxFQUFFeUMsVUFBa0I7TUFDMUUsTUFBTUMsV0FBVyxHQUFHLGtCQUFNLEVBQUMxQyxPQUFPLENBQUM7TUFFbkMsTUFBTTJDLE9BQU8sR0FBRyxNQUFNQyxrQkFBUyxDQUFDQyxNQUFNLEVBQUU7TUFDeEMsTUFBTUMsSUFBSSxHQUFHLE1BQU1ILE9BQU8sQ0FBQ0ksT0FBTyxFQUFFO01BRXBDLE1BQU1ELElBQUksQ0FBQ0UsVUFBVSxDQUFDTixXQUFXLEVBQUU7UUFDbENPLFNBQVMsRUFBRTtPQUNYLENBQUM7TUFFRixNQUFNN0IsR0FBRyxHQUFHLE1BQU0wQixJQUFJLENBQUMxQixHQUFHLENBQUM7UUFDMUIzRyxJQUFJLEVBQUUsaUJBQU8sRUFBQ2dJLFVBQVUsQ0FBQztRQUN6QmxHLE1BQU0sRUFBRSxJQUFJO1FBQ1oyRyxlQUFlLEVBQUU7T0FDakIsQ0FBQztNQUVGLE1BQU1QLE9BQU8sQ0FBQ1EsS0FBSyxFQUFFO0lBQ3RCO0lBRUE7SUFDQSxNQUFNOUIsZUFBZSxHQUFHLGtDQUFrQztJQUMxRCIsIm5hbWVzIjpbIkF1ZGlvIiwicHJvY2VzcyIsInBhdGgiLCJmaWxlUGF0aCIsIl9fZGlybmFtZSIsImUiLCJjb25zb2xlIiwibG9nIiwiZXhwb3J0cyIsIkNIVU5LX1NJWkVfTUIiLCJjaHVua0F1ZGlvIiwibWF4U2l6ZU1CIiwicHJvbWlzZSIsIlBlbmRpbmdQcm9taXNlIiwic3RhdHMiLCJmcyIsInN0YXQiLCJmaWxlU2l6ZUluQnl0ZXMiLCJzaXplIiwiZmlsZVNpemVJbk1lZ2FieXRlcyIsIm91dHB1dERpciIsImpvaW4iLCJkaXJuYW1lIiwiYmFzZW5hbWUiLCJleHRuYW1lIiwibWtkaXIiLCJyZWN1cnNpdmUiLCJmZm1wZWciLCJmZnByb2JlIiwiZXJyIiwibWV0YWRhdGEiLCJkdXJhdGlvbiIsImZvcm1hdCIsIm51bU9mQ2h1bmtzIiwiTWF0aCIsImNlaWwiLCJwcm9taXNlcyIsImkiLCJvdXRwdXQiLCJjdXJyZW50UHJvbWlzZSIsInB1c2giLCJzZXRTdGFydFRpbWUiLCJzZXREdXJhdGlvbiIsIm9uIiwicmVzb2x2ZSIsInJlamVjdCIsInJ1biIsIlByb21pc2UiLCJhbGwiLCJ0aGVuIiwidW5kZWZpbmVkIiwiZXJyb3IiLCJtZXNzYWdlIiwiY29udmVydFRvVmFsaWRQYXRoIiwib3NQbGF0Zm9ybSIsInJlcGxhY2UiLCJpc0RpcmVjdG9yeSIsImxzdGF0IiwiZ2V0U29ydGVkRmlsZXMiLCJkaXJQYXRoIiwiZmlsZXMiLCJyZWFkZGlyIiwid2l0aEZpbGVUeXBlcyIsImZpbHRlciIsImZpbGUiLCJpc0ZpbGUiLCJzb3J0IiwiYSIsImIiLCJOdW1iZXIiLCJuYW1lIiwic3BsaXQiLCJmaWxlUGF0aHMiLCJtYXAiLCJoYW5kbGVQYXRoIiwiZGlyZWN0b3J5Iiwic29ydGVkRmlsZXMiLCJBSUJhY2tlbmQiLCJDb25maWd1cmF0aW9uIiwiYXBpS2V5IiwiZW52IiwiT1BFTl9BSV9LRVkiLCJPcGVuQUlBcGkiLCJtb2RlbHMiLCJsaXN0TW9kZWxzIiwiZGF0YSIsImNvbXBsZXRpb25zIiwicHJvbXB0IiwidGV4dCIsImNvbnRlbnQiLCJyZXNwb25zZSIsImNyZWF0ZUNvbXBsZXRpb24iLCJtb2RlbCIsImRhdmluY2kzIiwidGVtcGVyYXR1cmUiLCJzdGF0dXMiLCJjaG9pY2VzIiwiY2hhdENvbXBsZXRpb25zIiwibWVzc2FnZXMiLCJjcmVhdGVDaGF0Q29tcGxldGlvbiIsImdwdFR1cmJvUGx1cyIsInRyYW5zY3JpcHRpb24iLCJsYW5nIiwicCIsImF1ZGlvIiwiY3JlYXRlVHJhbnNjcmlwdGlvbiIsImxhcmdlVHJhbnNjcmlwdGlvbiIsInNhdmVUb1BERiIsInNwZWNzIiwicGRmIiwibWFya2Rvd25Db250ZW50Iiwic2F2ZUxhcmdlUERGIiwicGF0aDEiLCJ0ZXh0cyIsImtleSIsImFuc3dlciIsImxhc3RUZXh0IiwibGFzdEluZGV4T2YiLCJzbGljZSIsInJlc3VtZW4iLCJ0MSIsInQyIiwidDMiLCJ0NCIsInQ1IiwidDYiLCJyb2xlIiwiYnVsbGV0cyIsIl9fX19fVHJhc2giLCJzYXZlTWFya2Rvd25Bc1BkZiIsIm91dHB1dFBhdGgiLCJodG1sQ29udGVudCIsImJyb3dzZXIiLCJwdXBwZXRlZXIiLCJsYXVuY2giLCJwYWdlIiwibmV3UGFnZSIsInNldENvbnRlbnQiLCJ3YWl0VW50aWwiLCJwcmludEJhY2tncm91bmQiLCJjbG9zZSJdLCJzb3VyY2VSb290IjoiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC8iLCJzb3VyY2VzIjpbImF1ZGlvLnRzIiwiY2h1bmstYXVkaW8udHMiLCJjb252ZXJ0LXBhdGgudHMiLCJmaWxlcy9nZXQtZmlsZXMudHMiLCJpbmRleC50cyIsIm1lZXQvX19fbWVldC1jYWxscy50cyIsInBkZi50cyJdLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGxdfQ==