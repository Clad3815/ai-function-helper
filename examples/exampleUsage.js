const aiFunction = require('../src/aiFunction');
(async() => {

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

    // aiFunction({
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

    // aiFunction({
    //     args: {
    //         messages: [
    //             "Hey, how's it going?",
    //             "I'm stuck on this programming problem, can anyone help?",
    //             "You're an idiot! Why can't you figure it out yourself?",
    //             "Calm down, let's try to help each other out."
    //         ]
    //     },
    //     description: "Analyze the list of messages and provide moderation actions (warn, mute, ban) for any message that violates community guidelines.",
    //     funcReturn: "dict",
    //     temperature: 0,
    //     autoConvertReturn: true
    // }).then((result) => {
    //     console.log(result); // Expected output: [{"index": 2, "action": "warn", "reason": "Insulting language is not allowed"}]
    // });

    // aiFunction({
    //     args: {
    //         country: "France"
    //     },
    //     functionName: "return_capital",
    //     description: "Return the capital of a given country based on your knowledge or answer 'Unknow' if not found.",
    //     funcReturn: "str",
    //     temperature: 0,
    //     showDebug: true,
    //     autoConvertReturn: true
    // }).then((result) => {
    //     console.log(result);
    // });

    aiFunction({
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


})();