const aiFunction = require('../src/aiFunction');
(async() => {
    /*
    // await aiFunction({
    //     args: {
    //         category: "Quake (Jeu vidéo)"
    //     },
    //     functionName: "generate_quiz",
    //     description: "Génère un quiz à partir d'une catégorie donnée, propose 4 choix de réponses et indique quel réponse est la bonne. Utilise toute ta connaissance ou wikipedia !",
    //     funcReturn: "dict",
    //     showDebug: true,
    //     autoConvertReturn: true,
    //     temperature: 0.8
    // }).then((result) => {
    //     console.log(result);
    // });

    // await aiFunction({
    //     args: {
    //         hobbies: ["peinture", "lecture"],
    //         interests: ["histoire", "art contemporain"]
    //     },
    //     functionName: "idees_cadeaux",
    //     description: "Proposez une liste d'idées de cadeaux pour un ami en fonction de ses hobbies et centres d'intérêt.",
    //     funcReturn: "dict",
    //     temperature: 1,
    //     showDebug: true,
    //     autoConvertReturn: true
    // }).then((result) => {
    //     console.log(result); // Expected output: ["Set de peinture acrylique", "Abonnement à une revue d'art", "Livre sur l'histoire de l'art", "Billets pour une exposition d'art", "Marque-pages personnalisés
    // });

    await aiFunction({
        args: {
            hobbies: ["peinture", "lecture"],
            interests: ["histoire", "art contemporain"]
        },
        functionName: "idees_cadeaux",
        description: "Proposez une liste d'idées de cadeaux pour un ami en fonction de ses hobbies et centres d'intérêt.",
        funcReturn: "list",
        temperature: 1,
        showDebug: true,
        autoConvertReturn: true
    }).then((result) => {
        console.log(result); // Expected output: ["Set de peinture acrylique", "Abonnement à une revue d'art", "Livre sur l'histoire de l'art", "Billets pour une exposition d'art", "Marque-pages personnalisés
    });

    await aiFunction({
        args: {
            hobbies: ["peinture", "lecture"],
            interests: ["histoire", "art contemporain"]
        },
        functionName: "idees_cadeaux",
        description: "Proposez une liste d'idées de cadeaux pour un ami en fonction de ses hobbies et centres d'intérêt.",
        funcReturn: "list",
        temperature: 1,
        showDebug: true,
        autoConvertReturn: false
    }).then((result) => {
        console.log(result); // Expected output: ["Set de peinture acrylique", "Abonnement à une revue d'art", "Livre sur l'histoire de l'art", "Billets pour une exposition d'art", "Marque-pages personnalisés
    });
    */

    await aiFunction({
        args: {
            country: "France"
        },
        functionName: "return_capital",
        description: "Return the capital of a given country based on your knowledge or answer 'Unknow' if not found.",
        funcReturn: "str",
        temperature: 0,
        showDebug: true,
        autoConvertReturn: true
    }).then((result) => {
        console.log(result);
    });


    await aiFunction({
        args: {
            country: "France"
        },
        functionName: "return_capital",
        description: "Return the capital of a given country based on your knowledge or answer 'Unknow' if not found.",
        funcReturn: "str",
        funcArgs: "country: str",
        temperature: 0,
        showDebug: true,
        autoConvertReturn: false
    }).then((result) => {
        console.log(result);
    });



})();